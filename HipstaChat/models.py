from django.contrib.auth.models import User
from django.db.models import Model, CharField, ForeignKey


class Message(Model):
    text = CharField(max_length=1000)
    sender = ForeignKey(User)
