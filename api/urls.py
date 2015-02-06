from django.conf.urls import patterns

from api.views import MyProfile, Room


urlpatterns = patterns('',
                       (r'^myaccount', MyProfile.as_view()),
                       (r'^room', Room.as_view())
)