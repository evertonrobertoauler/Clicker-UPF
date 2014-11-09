import mongoengine as me
from .helpers import obj_search_string


class Document(me.Document):
    meta = dict(abstract=True, ordering=['-id'])


class User(me.Document):
    full_name = me.StringField()
    short_name = me.StringField()
    email = me.EmailField()
    search = me.StringField()
    token = me.StringField()
    groups = me.ListField(me.StringField())

    meta = dict(ordering=['search'], indexes=['token'])

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.search = obj_search_string(document, ['full_name', 'email'])

me.signals.pre_save.connect(User.pre_save, sender=User)


class Classroom(Document):
    name = me.StringField(required=True)
    students = me.ListField(me.DictField(required=True))
    professor = me.DictField(required=True)


class Question(Document):
    text = me.StringField(required=True)
    answers = me.ListField(me.StringField(required=True))
    rightAnswer = me.IntField(required=True)
    professor = me.DictField(required=True)


class StundentAnswer(me.EmbeddedDocument):
    student = me.DictField(required=True)
    answer = me.IntField(required=True)
    old_answers = me.ListField(me.IntField())


class KnowledgeTest(Document):
    professor = me.DictField(required=True)
    classroom = me.DictField(required=True)
    question = me.DictField(required=True)
    start = me.DateTimeField(required=True)
    end = me.DateTimeField(required=True)
    answers = me.ListField(me.EmbeddedDocumentField(StundentAnswer))
