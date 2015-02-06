from django.conf.urls import patterns

from api.views import MyProfile, User


urlpatterns = patterns('',
                       (r'^myaccount', MyProfile.as_view()),
                       (r'^user/(?P<pk>\d+)/$', User.as_view()),
                       (r'^user/(?P<email>[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})/$', User.as_view())
)