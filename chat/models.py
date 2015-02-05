from django.contrib.auth.models import User

# Create your models here.
from django.db.models import Model, ForeignKey, ManyToManyField, DateTimeField
from HipstaChat.models import HCUser


class Room(Model):
    members = ManyToManyField(HCUser)


class Message(Model):
    sender = ForeignKey(HCUser)
    receiver = ForeignKey(Room)
    send_date = DateTimeField()


class ContactList(Model):
    contacts = ManyToManyField(HCUser)



