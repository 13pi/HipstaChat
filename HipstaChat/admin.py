from django.contrib import admin

from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.admin import UserAdmin

from chat.models import ContactList

from HipstaChat.models import HCUser


class CustomUserCreationForm(UserCreationForm):
    error_messages = {
        'duplicate_username': 'A user with that username already exists.',
        'duplicate_email': 'A user with that e-mail already exists.',
        'password_mismatch': 'The two password fields didn\'t match.',
    }
    password1 = forms.CharField(label='password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='password confirmation', widget=forms.PasswordInput)

    class Meta(UserCreationForm.Meta):
        model = HCUser
        fields = ('username', 'email',)

    def clean_email(self):
        email = self.cleaned_data['email']
        try:
            HCUser._default_manager.get(email=email)
        except HCUser.DoesNotExist:
            return email

        raise forms.ValidationError(self.error_messages['duplicate_email'])


    def clean_username(self):
        username = self.cleaned_data['username']
        # try:
        # HCUser._default_manager.get(username=username)
        # except HCUser.DoesNotExist:
        return username

    # raise forms.ValidationError(self.error_messages['duplicate_username'])
    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 == password2:
            return password2
        raise forms.ValidationError(self.error_messages['password_mismatch'])

    def save(self, commit=True):
        # create=HCUserManager()
        # username=self.cleaned_data['username']
        # email=self.cleaned_data['email']
        # password=self.cleaned_data.get("password")
        # a=HCUserManager.create_user(create,username,email)
        # user=HCUserManager.create_user(HCUserManager,username,email)
        user = super(UserCreationForm, self).save(commit=False)
        user.is_active = True
        user.set_password(self.cleaned_data['password1'])
        cl = ContactList(owner=user)
        cl.save()

        user.save()
        return user


class CustomUserChangeForm(UserChangeForm):
    password = ReadOnlyPasswordHashField(label='password',
                                         help_text="""You can change the password using <a href=\"password/\"> form </a>""")

    class Meta(UserChangeForm.Meta):
        model = HCUser
        fields = ('email', 'username', 'password', 'is_staff', 'is_superuser', 'is_active', 'user_permissions')

    def clean_password(self):
        return self.initial['password']


class AuthUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    list_display = ('email', 'username', 'is_staff', 'is_superuser', 'first_name', 'last_name', 'avatar')
    list_filter = ('is_superuser',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password', 'first_name', 'last_name', 'avatar',)}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active')}),
    )
    add_fieldsets = (
        (None,
         {'classes': ('wide',),
          'fields': ('email', 'username', 'password1', 'password2', 'is_staff', 'is_superuser')}
        ),)
    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')


admin.site.register(HCUser, AuthUserAdmin)