# Create your views here.
import json
from json import loads

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from HipstaChat import models

from HipstaChat.models import HCUser
from api.decorators import auth_required, payload_required
from api.utils import api_response, user_in_room
from chat.models import Room, Message


class APIView(View):
    def dispatch(self, request, *args, **kwargs):
        self.request = request

        if request.method.upper() in self.allowed_methods:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        response = handler(request, *args, **kwargs)
        return self.finalize(response)

    @property
    def allowed_methods(self):
        default_methods = ['OPTIONS']
        return self.methods + default_methods

    def finalize(self, response):
        response['Allow'] = ", ".join(self.allowed_methods)
        response['Access-Control-Allow-Credentials'] = "true"
        response['Access-Control-Allow-Origin'] = self.request.META.get('HTTP_ORIGIN', "*")
        response['Access-Control-Allow-Methods'] = response['Allow']
        response[
            'Access-Control-Allow-Headers'] = 'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        response['Access-Control-Max-Age'] = 3600

        return response

    @classmethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        view.cls = cls
        return csrf_exempt(view)

    def access_denied_error(self):
        return api_response({'error': 'access denied'}, status=403)

    def error_response(self, text):
        return api_response({'error': text}, status=403)


class MyProfile(APIView):
    methods = ['GET', 'PUT']

    @auth_required
    def get(self, request, *args, **kwargs):
        # return api_response({
        # "email": request.user.email,
        # "password": request.user.password,
        # "nickName": request.user.username,
        # "firstName": request.user.first_name,
        # "lastName": request.user.last_name,
        # "avatarUrl": "костыль",
        # "createdDate": int(request.user.date_joined.timestamp()),
        # "lastOnlineDate": int(request.user.last_login.timestamp()),
        #     "active": request.user.is_active,
        #     "emailVerified": request.user.is_active,
        #     "contactListsEmails": "костыль"
        # })
        return api_response(request.user.serialize())

    @auth_required
    @payload_required
    def put(self, request, *args, **kwargs):

        user = request.user
        decoded = json.loads(request.body.decode())

        if "nickName" in decoded:
            user.username = decoded["nickName"]
        if "avatarUrl" in decoded:
            user.avatar = decoded["avatarUrl"]
        if "firstName" in decoded:
            user.first_name = decoded["firstName"]
        if "lastName" in decoded:
            user.last_name = decoded["lastName"]

        user.save()
        return api_response({"response": "ok"})


class User(APIView):
    methods = ['GET']

    @auth_required
    def get(self, request, pk=None, email=None, *args, **kwargs):
        if pk:
            return api_response(get_object_or_404(HCUser, pk=pk).serialize())
        if email:
            return api_response(get_object_or_404(HCUser, email=email).serialize(fields=[
                'id', 'email', 'nickName', 'firstName', 'lastName', 'avatarUrl']))


class UserSearch(APIView):
    methods = ['POST']

    @auth_required
    @payload_required
    def post(self, request):
        parser = json.loads(request.body.decode())

        if "text" not in parser:
            return api_response({"error": "text required"}, status=403)

        text = str(parser["text"]).strip()
        if " " not in text:
            first, last = text, ""
        else:
            first, last = text.split(maxsplit=1)

        obj = {
            "response": []
        }

        query = HCUser.objects.filter(
            Q(first_name__istartswith=first) | Q(last_name__istartswith=first),
            Q(first_name__istartswith=last) | Q(last_name__istartswith=last)
        )

        obj["response"] += [{"name": user.get_full_name(), "id": user.pk} for user in query]
        return api_response(obj)


class ContactList(APIView):
    methods = ['GET', 'PUT', 'DELETE']

    @auth_required
    def get(self, request):
        return api_response({
            "response": [contact.serialize(fields=['email', 'id']) for contact in
                         request.user.contact_owner_id.contacts.all()]
        })

    @auth_required
    @payload_required
    def put(self, request):
        parsed = json.loads(request.body.decode())

        if "userid" not in parsed:
            return api_response({"error": "userid required"}, status=403)

        other = get_object_or_404(HCUser, pk=parsed['userid'])

        request.user.contact_owner_id.contacts.add(other)
        request.user.contact_owner_id.save()

        return api_response({"response": "ok"})

    @auth_required
    def delete(self, request, abr=None):
        try:
            contact = request.user.contact_owner_id.contacts.get(pk=abr)
        except HCUser.DoesNotExist:
            print(abr)
            return api_response({"error:": "user with such id does not in contact list"}, status=403)

        request.user.contact_owner_id.contacts.remove(abr)
        request.user.contact_owner_id.save()
        return api_response({"response": "ok"})


class ContactListDetailed(APIView):
    methods = ['GET']

    @auth_required
    def get(self, request):
        fields = ['id', 'email', 'avatarUrl', 'lastName', 'firstName', 'lastOnlineDate']
        return api_response({
            "response": [contact.serialize(fields=fields) for contact in request.user.contact_owner_id.contacts.all()]
        })


class Rooms(APIView):
    methods = ['GET', 'PUT', 'POST', 'DELETE']

    def serialize_room(self, room):
        return {
            'members': [u.pk for u in room.members.all()],
            'name': room.name,
            'id': room.pk,
            'owner': room.owner.email
        }

    @auth_required
    def get(self, request, pk=None):

        if pk is None:
            return self.get_all_rooms(request)

        room = get_object_or_404(Room, pk=pk)

        if not room.members.filter(pk=request.user.pk).exists():
            return self.access_denied_error()

        return api_response(self.serialize_room(room))


    @auth_required
    @payload_required
    def put(self, request):
        parsed = json.loads(request.body.decode())

        if 'name' not in parsed:
            return self.error_response('name required')

        if 'members' in parsed:
            # return api_response({'error': 'member ids required required'}, status=403)
            members = HCUser.objects.filter(pk__in=parsed['members'])
        else:
            members = []

        room = Room.objects.create(owner=request.user, name=parsed['name'])
        room.members.add(request.user, *members)
        room.save()

        return api_response({
            "response": "ok",
            "id": room.pk
        })


    @auth_required
    @payload_required
    def post(self, request, pk):
        parsed = json.loads(request.body.decode())
        room = get_object_or_404(Room, pk=pk)

        if not room.owner.pk == request.user.pk:
            return self.access_denied_error()

        if 'name' in parsed:
            room.name = parsed['name']

        if 'addMembers' in parsed:
            new_users = HCUser.objects.filter(pk__in=parsed['addMembers'])
            room.members.add(*new_users)

        if 'dismissMembers' in parsed:
            delete_users = HCUser.objects.filter(pk__in=parsed['dismissMembers'])
            room.members.remove(*delete_users)

        room.save()
        return api_response({"response": "ok"})

    @auth_required
    def delete(self, request, pk):

        room = get_object_or_404(Room, pk=pk)

        if not room.members.filter(pk=request.user.pk).exists():
            return api_response({
                                    "error": "you are not member of that room"
                                }, status=403)

        room.members.remove(request.user)

        if not room.members.all().exists():
            room.delete()

        return api_response({
            "response": "ok"
        })

    def get_all_rooms(self, request):
        rooms = Room.objects.filter(members__id=request.user.pk)
        return api_response([
            self.serialize_room(r) for r in rooms
        ])


class Messages(APIView):
    methods = ['GET', 'PUT']

    @auth_required
    @payload_required
    def put(self, request, pk):
        parsed = loads(request.body.decode())

        room = get_object_or_404(Room, pk=pk)

        if not user_in_room(room, request.user):
            return self.access_denied_error()

        if not 'text' in parsed:
            return self.error_response('text required')

        message = Message.objects.create(sender=request.user, content=parsed['text'], receiver=room)
        message.save()

        return api_response({"response": "ok", "id": message.pk})

    @auth_required
    def get(self, request, pk, since=None, count=None):

        room = get_object_or_404(Room, pk=pk)

        if not user_in_room(room, request.user):
            return self.access_denied_error()

        if not since:
            messages = Message.objects.filter(receiver=room).order_by('-id')[:20]
        elif not count:
            messages = Message.objects.filter(receiver=room).exclude(pk__lte=since).order_by('-id')[:20]
        else:
            messages = Message.objects.filter(receiver=room).exclude(pk__gte=since).order_by('-id')[:int(count)]

        return api_response({
            "response": "ok",
            "messages": [
                m.serialize() for m in messages
            ]
        })






