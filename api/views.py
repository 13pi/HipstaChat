# Create your views here.
from django.views.generic import View

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

        response['Access-Control-Allow-Credentials'] = True
        response['Access-Control-Allow-Origin'] = self.request.META.get('Origin', "*")
        response['Access-Control-Allow-Methods'] = response['Allow']
        response[
            'Access-Control-Allow-Headers'] = 'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        response['Access-Control-Max-Age'] = 3600

        return response


class MyProfile(APIView):
    methods = ['GET', 'POST']

    def get(self, request, *args, **kwargs):
        Obj = {}
        if request.user.is_authenticated():
            return api_response({
                "email": request.user.email,
                "password": request.user.password,
                "nickName": "костыль",
                "firstName": request.user.first_name,
                "lastName": request.user.last_name,
                "avatarUrl": "костыль",
                "createdDate": int(request.user.date_joined.timestamp()),
                "lastOnlineDate": int(request.user.last_login.timestamp()),
                "active": request.user.is_active,
                "emailVerified": request.user.is_active,
                "contactListsEmails": "костыль"
            })
        else:
            return api_response({"error": "not authenticated"})