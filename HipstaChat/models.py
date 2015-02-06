from django.contrib.auth.models import User, AbstractUser, BaseUserManager, AbstractBaseUser
from django.core.validators import RegexValidator
from django.db.models.fields import URLField, EmailField, CharField, DateTimeField, BooleanField


# class HCUserManager(BaseUserManager):
# def create_user(self, email, password=None, **kwargs):
# user = self.model(email=email, **kwargs)
#         user.set_password(password)
#         user.save()
#         return user
#
#     def create_superuser(self, email, password, **kwargs):
#         user = self.model(email=email, is_staff=True, is_superuser=True, **kwargs)
#         user.set_password(password)
#         user.save()
#         return user
#
#
# class HCUser(AbstractUser):
#     avatar = URLField()
#     objects = HCUserManager()
#
#     REQUIRED_FIELDS = []
#     USERNAME_FIELD = 'email'
#
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         email = EmailField(blank=False, unique=True)
#         email.contribute_to_class('email', self)
#
#


class HSUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        user = self.model(username=username, email=self.normalize_email(email), )
        user.is_active = True
        user.set_password(password)

        user.save()
        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(username=username, email=email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class HCUser(AbstractBaseUser):
    alphanumeric = RegexValidator(r'^[0-9a-zA-Z]*$', message='Only aphanumeric characters are allowed.')

    username = CharField(unique=False, max_length=20, validators=[alphanumeric])
    email = EmailField(unique=True, max_length=255, verbose_name='email address')
    first_name = CharField(max_length=30, blank=True, null=True)
    last_name = CharField(max_length=50, blank=True, null=True)
    date_joined = DateTimeField(auto_now_add=True)
    is_active = BooleanField(default=True, null=False)
    is_staff = BooleanField(default=False, null=False)

    avatar = URLField()
    # contact_list = OneToOneField('chat.ContactList')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = HSUserManager()

    def get_full_name(self):
        return self.first_name + self.last_name

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.email

    def __repr__(self):
        return self.email

    def serialize(self, extra_fields=None):
        obj = {
            "email": self.email,
            "nickName": self.username,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "avatarUrl": self.avatar
        }
        return obj

