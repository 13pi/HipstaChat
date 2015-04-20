from datetime import datetime
from api.utils import api_response


def auth_required(fn):
    def wrapped(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return api_response({"error": "not authenticated"}, status=401)
        request.user.last_action=datetime.now().replace(tzinfo=None)
        request.user.save()
        return fn(self, request, *args, **kwargs)

    return wrapped


def payload_required(fn):
    def wrapped(self, request, *args, **kwargs):
        if not request.body:
            return api_response({"error": "payload required"}, status=403)
        return fn(self, request, *args, **kwargs)

    return wrapped



