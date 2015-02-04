from django.contrib.auth.models import User

# Create your models here.
from django.db.models import Model, CharField, ForeignKey, ManyToManyField, DateTimeField, TextField


class Message(Model):
    text = CharField(max_length=1000)
    sender = ForeignKey(User)
    send_time = DateTimeField()


class UserProfile(Model):
    contacts = ManyToManyField(User)
    avatar = TextField()


class Room(Model):
    users = ManyToManyField(User)
    messages = ManyToManyField(Message)
    # active_users = ManyToManyField(User)

