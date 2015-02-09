# Create your views here.
import json

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from HipstaChat.models import HCUser
from api.decorators import auth_required, payload_required
from api.utils import api_response


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


class MyProfile(APIView):
    methods = ['GET', 'PUT']

    @auth_required
    def get(self, request, *args, **kwargs):
        return api_response({
            "email": request.user.email,
            "password": request.user.password,
            "nickName": request.user.username,
            "firstName": request.user.first_name,
            "lastName": request.user.last_name,
            "avatarUrl": "костыль",
            "createdDate": int(request.user.date_joined.timestamp()),
            "lastOnlineDate": int(request.user.last_login.timestamp()),
            "active": request.user.is_active,
            "emailVerified": request.user.is_active,
            "contactListsEmails": "костыль"
        })

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
            return api_response(get_object_or_404(HCUser, email=email).serialize())


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
            Q(first_name__startswith=first) | Q(last_name__startswith=first),
            Q(first_name__startswith=last) | Q(last_name__startswith=last)
        )

        obj["response"] += [{"name": user.get_full_name(), "id": user.pk} for user in query]
        return api_response(obj)


class ContactList(APIView):
    methods = ['GET', 'PUT']

    @auth_required
    def get(self, request):
        return api_response({
            "response": [contact.pk for contact in request.user.contact_owner_id.contacts.all()]
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