from json import dumps

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


