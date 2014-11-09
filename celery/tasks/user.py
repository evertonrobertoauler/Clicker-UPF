from .models import User
from .helpers import obj_search_string


def update(user_id):
    user = User.objects(id=user_id).first()
    if user:
        user.search = obj_search_string(user, ['displayName', 'email'])
        user.save()