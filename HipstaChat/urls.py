from django.conf.urls import patterns, include
from django.contrib import admin
from django.views.generic import TemplateView, RedirectView

from HipstaChat.views import secret


urlpatterns = patterns('',
    (r'^accounts/', include('registration.backends.default.urls')),
    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
    (r'^$', TemplateView.as_view(template_name='index.html')),
    (r'^chat/', include('chat.urls')),
    (r'^api/', include('api.urls')),
    (r'^secret', secret),
    (r'^accounts/profile/', RedirectView.as_view(url='/'), )
)