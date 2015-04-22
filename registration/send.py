import requests
from HipstaChat.settings import key, sandbox,request_url,ACTIVATION_HOSTNAME,    SEND_ACTIVATION_EMAIL


def send_invite(rec, act):
    requests.post(request_url, auth=('api', key), data={
        'from': 'HipstaChat <noreply@hipstachat.ru>',
        'to': rec,
        'subject': 'HipstaChat - подтверждение email',
        'text': '''Здраствуйте, ваш email был указан при регистрации в HipstaChat
Для подтверждения email адреса пройдите по ссылке. Если вы не регестрировались в HipstaChat - просто проигнорируйте данное письмо
%s/accounts/activate/%s''' % (ACTIVATION_HOSTNAME, act)
    })

