from django.contrib.auth.models import User

# Create your models here.
from django.db.models import Model, ForeignKey, ManyToManyField, DateTimeField
from django.db.models.fields.related import OneToOneField
from HipstaChat.models import HCUser


class Room(Model):
    members = ManyToManyField(HCUser)


class Message(Model):
    sender = ForeignKey(HCUser)
    receiver = ForeignKey(Room)
    send_date = DateTimeField()


class ContactList(Model):
    owner = OneToOneField(HCUser, related_name='contact_owner_id', null=True)
    contacts = ManyToManyField(HCUser)



