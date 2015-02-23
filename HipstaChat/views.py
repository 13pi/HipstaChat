from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response

@login_required
def secret(response):
    return render_to_response('secret.html')

def helpage(response):
	return render_to_response('help.html')


