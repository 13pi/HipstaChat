import requests
from HipstaChat.settings import key, sandbox,request_url,ACTIVATION_HOSTNAME, USE_SANDBOX_MAIL, SEND_ACTIVATION_EMAIL


def send_invite(rec, act):
    requests.post(request_url, auth=('api', key), data={
        'from': 'HipstaTeam <postmaster@sandbox50f958596328413ba57a57bfeb12eb27.mailgun.org>',
        'to': (rec if not USE_SANDBOX_MAIL else 'HipstaTeam <hipsta.team@mail.ru>'),
        'subject': 'Hello',
        'text': 'Hello from HipstaTeam, we are happy to be visited by you. So, if you want to join us, just click here.\n' + \
        '%s/%s' % (ACTIVATION_HOSTNAME, act) + '\n'\
        'It was not you? Just don\'t click that and all\'ll be ok'
    })

