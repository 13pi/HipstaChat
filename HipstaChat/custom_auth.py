#
# def create_hc_user(sender, instance, created, **kwargs):
# if created:
#         values = {}
#         for field in sender._meta.local_fields:
#             values[field.attname] = getattr(instance, field.attname)
#         user = HCUser(**values)
#         user.save()
#
#
# class HCUserModelBackend(ModelBackend):
#
#     def authenticate(self, email=None, password=None, **kwargs):
#         # def authenticate(self, username=None, password=None):
#         # """ Authenticate a user based on email address as the user name. """
#         try:
#             user = HCUser.objects.get(email=email)
#             if user.check_password(password):
#                 return user
#         except HCUser.DoesNotExist:
#             return None
#
#     def get_user(self, user_id):
#         """ Get a User object from the user_id. """
#         try:
#             return HCUser.objects.get(pk=user_id)
#         except HCUser.DoesNotExist:
#             return None
#
# post_save.connect(create_hc_user, User)