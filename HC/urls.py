from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    (r'^accounts/', include('registration.backends.default.urls')),
    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
)