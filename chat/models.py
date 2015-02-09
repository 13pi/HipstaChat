from django.contrib.auth.models import User

# Create your models here.
from django.db.models import Model, ForeignKey, ManyToManyField, DateTimeField, TextField
from django.db.models.fields.related import OneToOneField


class Room(Model):
    members = ManyToManyField('HipstaChat.HCUser')


class Message(Model):
    sender = ForeignKey('HipstaChat.HCUser')
    receiver = ForeignKey(Room)
    send_date = DateTimeField(auto_now_add=True)
    content = TextField(blank=True)


class ContactList(Model):
    owner = OneToOneField('HipstaChat.HCUser', related_name='contact_owner_id', primary_key=True)
    contacts = ManyToManyField('HipstaChat.HCUser', null=True)



