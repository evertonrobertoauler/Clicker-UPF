import sys
from os.path import dirname as d

sys.path.insert(0, d(__file__))

from celery import Celery
import mongoengine as me
from tasks import user


me.connect('openpi-dev')

celery = Celery('openpi')

celery.conf.update(
    CELERY_TASK_SERIALIZER='json',
    CELERY_ACCEPT_CONTENT=['json'],
    CELERY_RESULT_SERIALIZER='json',
    CELERY_TIMEZONE='America/Sao_Paulo',
    CELERY_ENABLE_UTC=True,
)


@celery.task(name='tasks.update_user')
def update_user(user_id):
    user.update(user_id)