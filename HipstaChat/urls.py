from django.conf.urls import patterns, include
from django.contrib import admin
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.shortcuts import redirect
from django.views.generic import TemplateView, RedirectView
from HipstaChat.settings import MEDIA_ROOT
from HipstaChat.settings_local import DEBUG

from HipstaChat.views import secret, helpage


urlpatterns = patterns('',
                       (r'^accounts/', include('registration.backends.default.urls')),
                       (r'^app', RedirectView.as_view(url='static/app/index.html')),
                       # Uncomment the next lin    e to enable the admin:
                       (r'^admin/', include(admin.site.urls)),
                       (r'^$', TemplateView.as_view(template_name='index.html')),
                       (r'^chat/', include('chat.urls')),
                       (r'^api/', include('api.urls')),
                       (r'^secret', secret),
                       (r'^help', helpage),
                       (r'^accounts/profile/', RedirectView.as_view(url='/')),

)

if DEBUG:
    urlpatterns += patterns('',
                            (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
                                'document_root': MEDIA_ROOT}))