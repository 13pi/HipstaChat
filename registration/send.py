import requests
from HipstaChat.settings import key, sandbox,request_url,IFDEBUG

def send_invite(rec,act):

    if IFDEBUG==0:
        request = requests.post(request_url, auth=('api', key), data={
            'from': 'HipstaTeam <postmaster@sandbox50f958596328413ba57a57bfeb12eb27.mailgun.org>',
            'to': rec,
            'subject': 'Hello',
            'text': 'Hello from HipstaTeam, we are happy to be visited by you. So, if you want to join us, just click here.\n' + \
            'http://hipstachat.tk/accounts/activate/%s' % act + '\n'\
            'It was not you? Just dont click that and all\'ll be ok' 
        })
    else:   
        request = requests.post(request_url, auth=('api', key), data={
            'from': 'HipstaTeam <postmaster@sandbox50f958596328413ba57a57bfeb12eb27.mailgun.org>',
            'to': 'HipstaTeam <hipsta.team@mail.ru>',
            'subject': 'Hello',
            'text': 'Hello from HipstaTeam, we are happy to be visited by you. So, if you want to join us, just click here.\n' + \
            'http://127.0.0.1:8000/accounts/activate/%s' % act + '\n'\
            'It was not you? Just dont click that and all\'ll be ok' 
        })
