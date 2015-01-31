import json

from django.contrib.auth.models import User
from django.http import HttpResponse


# Create your views here.


def messages_get(respnse):
    users = User.objects

    payload = {
        "FROM": "VASEK",
        "TEXT": "PRODAM GARAJ"
    }

    return HttpResponse(json.dumps(payload), content_type='application/json')
