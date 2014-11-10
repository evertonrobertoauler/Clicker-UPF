from tasks.models import Question, User
from tasks.serializers import NestedUser


def insert(question):
    professor = User.objects(id=question['professor']).first()

    if professor:
        question['professor'] = NestedUser(professor).data
        Question(**question).save()


def update(data):
    professor = User.objects(id=data['professor']).first()
    question = Question.objects(id=data['id']).first()

    if question and professor:
        question.text = data['text']
        question.answers = data['answers']
        question.rightAnswer = data['rightAnswer']
        question.professor = NestedUser(professor).data
        question.save()


def delete(question):
    Question(**question).delete()