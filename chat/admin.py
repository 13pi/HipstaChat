from django.contrib import admin

from chat.models import Room, Message, ContactList


class RoomAdmin(admin.ModelAdmin):
    pass


class MessageAdmin(admin.ModelAdmin):
    pass


class ContactListAdmin(admin.ModelAdmin):
    pass




admin.site.register(Room, RoomAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(ContactList, ContactListAdmin)

