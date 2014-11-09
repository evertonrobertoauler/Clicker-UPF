import mongoengine as me


class Document(me.Document):
    meta = dict(abstract=True, ordering=['-id'])


class User(me.Document):
    firstName = me.StringField()
    lastName = me.StringField()
    displayName = me.StringField()
    email = me.EmailField()
    password = me.StringField()
    salt = me.StringField()
    provider = me.StringField()
    providerData = me.DynamicField()
    additionalProvidersData = me.DynamicField()
    roles = me.ListField(me.StringField())
    updated = me.DateTimeField()
    created = me.DateTimeField()
    resetPasswordToken = me.StringField()
    resetPasswordExpires = me.DateTimeField()
    search = me.StringField()

    meta = dict(ordering=['search'], collection='users')


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
    triedAnswers = me.ListField(me.IntField())


class KnowledgeTest(Document):
    professor = me.DictField(required=True)
    classroom = me.DictField(required=True)
    question = me.DictField(required=True)
    start = me.DateTimeField(required=True)
    end = me.DateTimeField(required=True)
    answers = me.ListField(me.EmbeddedDocumentField(StundentAnswer))
