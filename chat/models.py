from django.contrib.auth.models import User

# Create your models here.
from django.db.models import Model, ForeignKey, ManyToManyField, DateTimeField, TextField, CharField
from django.db.models.fields import BooleanField, IntegerField
from django.db.models.fields.related import OneToOneField


class Room(Model):
    owner = ForeignKey('HipstaChat.HCUser', related_name='room_owner')
    name = CharField(max_length=256, blank=True)
    members = ManyToManyField('HipstaChat.HCUser')


class Message(Model):
    sender = ForeignKey('HipstaChat.HCUser')
    receiver = ForeignKey(Room)
    send_date = DateTimeField(auto_now_add=True)
    content = TextField(blank=True)

    def serialize(self):
        return {
            "id": self.pk,
            "room": self.receiver.pk,
            "date": self.send_date.timestamp(),
            "text": self.content,
            "sender": self.sender.pk,
        }


class ContactList(Model):
    owner = OneToOneField('HipstaChat.HCUser', related_name='contact_owner_id', primary_key=True)
    contacts = ManyToManyField('HipstaChat.HCUser',blank=True, null=True)

class Notification(Model):
    user = ForeignKey('HipstaChat.HCUser')
    shown = BooleanField(default=False)
    type = IntegerField()
    details = IntegerField(blank=True)

    def serialize(self):
        return {
            "id": self.pk,
            "type": self.type,
            "shown": self.shown,
            "details": self.details
        }

    @classmethod
    def send(cls, user, type, details=None):
        cls.objects.create(
            user=user,
            type=type,
            details=details
        )
