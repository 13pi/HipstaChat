import datetime
from django.contrib.auth.models import User, AbstractUser, BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.db.models.fields import URLField, EmailField, CharField, DateTimeField, BooleanField, TextField
from django.db import models
from django.utils import timezone

from chat.models import ContactList


class HCUserManager(BaseUserManager):
    # def __init__(self):
    # user = self.model()
    # def create_user(self, username, email, password=None):
    def create_user(self, username='a', email='b', password=None):
        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.is_active = True
        user.set_password(password)

        user.save()
        #
        cl = ContactList(owner=user)
        cl.save()

        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(username=username, email=email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class HCUser(AbstractBaseUser, PermissionsMixin):
    alphanumeric = RegexValidator(r'^[0-9a-zA-Z_@.-]*$', message='Only aphanumeric characters are allowed.')

    username = CharField(unique=False, max_length=20, validators=[alphanumeric])
    email = EmailField(unique=True, max_length=255, verbose_name='email address')
    first_name = CharField(max_length=30, blank=True)
    last_name = CharField(max_length=50, blank=True)
    date_joined = DateTimeField(auto_now_add=True)
    is_active = BooleanField(default=True, null=False)
    is_staff = BooleanField(default=False, null=False)
    settings = TextField(null=True, blank=True)
    last_action = DateTimeField(default=timezone.now)

    avatar = URLField(blank=True)
    # contact_list = OneToOneField('chat.ContactList')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = HCUserManager()

    def get_full_name(self):
        return "%s %s" % (self.first_name, self.last_name)

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.email

    def __repr__(self):
        return self.email

    def serialize(self, fields=None):
        _ = lambda field, check: field if check in fields else None

        obj = {
            'id' : self.pk,
            "email": self.email,
            "nickName": self.username,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "avatarUrl": self.avatar,
            'createdDate': self.date_joined.timestamp(),
            'lastOnlineDate': self.last_action.timestamp(),
            'emailVerified': True,
            'online': datetime.datetime.now().replace(tzinfo=None) - self.last_action.replace(tzinfo=None) < datetime.timedelta(minutes=15)
        }

        if fields:
            obj = {k:v for k,v in obj.items() if k in fields}
        if not fields or "contactListsEmails" in fields:
            obj["contactListsEmails"] = [user.email for user in self.contact_owner_id.contacts.all()]

        return obj

