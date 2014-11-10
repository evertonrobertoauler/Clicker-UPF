import sys
from os.path import dirname as d

sys.path.insert(0, d(__file__))

from celery import Celery
import mongoengine as me
from tasks import user, question


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


@celery.task(name='tasks.question.insert')
def question_insert(data):
    question.insert(data)


@celery.task(name='tasks.question.update')
def question_update(data):
    question.update(data)


@celery.task(name='tasks.question.delete')
def question_delete(data):
    question.delete(data)
