from django.contrib import admin

from chat.models import Room, Message, ContactList


class RoomAdmin(admin.ModelAdmin):
    list_display = ('owner','name')



class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender','send_date')
    


class ContactListAdmin(admin.ModelAdmin):
     list_display = ('owner',)




admin.site.register(Room, RoomAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(ContactList, ContactListAdmin)

