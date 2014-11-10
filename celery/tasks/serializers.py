from marshmallow import Serializer, fields as f
from mongoengine.fields import ObjectId


class ObjectIdField(f.String):

    def format(self, value):
        return ObjectId(value)


class NestedUser(Serializer):
    id = ObjectIdField(required=True)
    name = f.String(attribute='displayName', required=True)


class NestedClassroom(Serializer):
    id = ObjectIdField(required=True)
    name = f.String(required=True)


class User(Serializer):
    id = ObjectIdField(required=True)
    name = f.String(attribute='displayName', required=True)
    email = f.String(required=True)


class Classroom(Serializer):
    id = ObjectIdField()
    name = f.String(required=True)
    students = f.List(f.Nested(NestedUser, required=True), required=True)
    professor = f.Nested(NestedUser, required=True)


class Question(Serializer):
    id = ObjectIdField()
    text = f.String(required=True)
    answers = f.List(f.String(required=True), required=True)
    rightAnswer = f.Integer(required=True)
    professor = f.Nested(NestedUser, required=True)


class StundentAnswer(Serializer):
    student = f.Nested(NestedUser, required=True)
    answer = f.Integer(required=True)


class KnowledgeTest(Serializer):
    id = ObjectIdField()
    question = f.Nested(Question, required=True)
    professor = f.Nested(NestedUser, required=True)
    classroom = f.Nested(NestedClassroom, required=True)
    start = f.DateTime(format='%Y-%m-%d %H:%M:%S.%f%z', required=True)
    end = f.DateTime(format='%Y-%m-%d %H:%M:%S.%f%z', required=True)
    answers = f.List(f.Nested(StundentAnswer, required=True))


class KnowledgeTestAnswer(Serializer):
    knowledge_test = ObjectIdField(required=True)
    answer = f.Integer(required=True)