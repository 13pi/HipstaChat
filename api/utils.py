from json import dumps
from django.contrib.auth.models import User

from django.http import HttpResponse


def api_response(data=None, status=None, headers=None, content_type=None):
    response = HttpResponse()
    if status is None:
        response.status_code = 200
    else:
        response.status_code = status
    if headers is not None:
        for k, v in headers.items():
            response[k] = v
    if content_type:
        response['Content-Type'] = content_type
    else:
        response['Content-Type'] = 'application/json'
    if data:
        response.content = dumps(data)
    return response


def user_in_room(room, user):
    return room.members.filter(pk=user.pk).exists


def users_are_friends(first, other):
    return first.contact_owner_id.contacts.filter(pk=other.pk).exists() and other.contact_owner_id.contacts.filter(
        pk=first.pk).exists()


