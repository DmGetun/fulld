from django.shortcuts import render
from django.http import HttpResponse
from polls.serializers import PollSerializer
from polls.serializers import QuestionSerializer
from polls.models import Survey
from polls.models import Question
from polls.models import Answer
from polls.models import Answer
from django.core import serializers
from rest_framework_simplejwt.authentication import JWTAuthentication


def index(request):
    p = Survey.objects.all()[0]
    q = Question.objects.filter(poll=p)

    questions = [QuestionSerializer(question).data for question in q]
    data = {'poll_title': p.title}
    temp_ = {}
    for dict_ in questions:
        for key,value in dict_.items():
            temp_[key] = value
    data['questions'] = questions

    return render(request,'polls/poll_view.html',context=data)


def create(request):
    return render(request,'polls/poll_create.html')