from django.conf.urls import patterns

from api.views import MyProfile


urlpatterns = patterns('',
                       (r'^myaccount', MyProfile.as_view()),
)