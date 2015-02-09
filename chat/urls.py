from django.conf.urls import patterns

from chat.views import messages_get


urlpatterns = patterns('',
                       ('^mg', messages_get),
)