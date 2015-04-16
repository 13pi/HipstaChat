from django.conf.urls import patterns

from api.views import MyProfile, User, UserSearch, ContactList, Rooms, Messages, ContactListDetailed, Notifications, \
    RejectAuthorization


urlpatterns = patterns('',
                       (r'^myaccount', MyProfile.as_view()),
                       (r'^user/(?P<pk>\d+)/$', User.as_view()),
                       (r'^user/(?P<email>[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})/$', User.as_view()),
                       (r'^searchUser', UserSearch.as_view()),
                       (r'^contactList/(?P<abr>\d+)/$', ContactList.as_view()),
                       (r'^contactList/$', ContactList.as_view()),
                       (r'^contactListWithDetails/$', ContactListDetailed.as_view()),
                       (r'^room/$', Rooms.as_view()),
                       (r'^room/(?P<pk>\d+)/$', Rooms.as_view()),
                       (r'^messages/(?P<pk>\d+)/$', Messages.as_view()),
                       (r'^messages/(?P<pk>\d+)/(?P<since>\d+)/$', Messages.as_view()),
                       (r'^messages/(?P<pk>\d+)/(?P<since>\d+)/(?P<count>\d+)/$', Messages.as_view()),
                       (r'^notifications/$', Notifications.as_view()),
                       (r'^notifications/((?P<pk>\d+))/$$', Notifications.as_view()),
                       (r'^rejectauth/(?P<pk>\d+)/$', RejectAuthorization.as_view()),

)