from pip import main
from polls import serializers
from polls.utils import get_unique_slug
from rest_framework import status
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_404_NOT_FOUND,
)
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from polls.serializers import AnswerSerializer, SurveySerializer
from polls.serializers import QuestionSerializer
from polls.models import Survey
from polls.models import Question
from polls.models import Option
from polls.models import Answer
import json
from django.core import serializers
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
import jwt
from .models import Key, Results, User
from .dmodule import SurveyEncryptor
from .models import Navigate

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(["GET"])
def login(request):
    print(request.data)
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Пожалуйста, укажите имя пользователя и пароль'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Неверные учетные данные'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},
                    status=HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated,])
def get_opros(request,slug = None):
    import couchdb
    c = couchdb.Server('http://admin:7776@localhost:5984')
    db = c['test1']
    n = Navigate.objects.filter(slug=slug)
    id = n.values('db_id')[0]['db_id']
    slug = n.values('slug')[0]['slug']
    doc = db[id]
    doc['slug'] = slug
    return Response(doc,status=HTTP_200_OK)
    if slug is None:
        p = Survey.objects.all()[0]
    else:
        p = get_object_or_404(Survey,slug=slug)
        print(SurveySerializer(p).data)
        return Response(SurveySerializer(p).data)
    return Response({'error': 'Указанный опрос не найден'},status=HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def add_opros(request):
    import couchdb
    c = couchdb.Server('http://admin:7776@localhost:5984')
    db = c['test1']
    id,rev = db.save(request.data)
    print(request.data)
    user = User.objects.get(id=request.user.id)

    context = request.data['questions']
    slug = get_unique_slug(Survey)
    request.data['slug'] = slug
    Navigate.objects.create(slug=slug,db_id=id)
    keys = request.data['keys']
    print(request.data)
    serializer = SurveySerializer(data=request.data,context={'questions': context, 'creator': user, 'keys':keys})
    print(serializer.is_valid())
    print(serializer.errors)
    if serializer.is_valid():
        survey = serializer.create(validated_data=request.data)
        return Response(SurveySerializer(survey).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def receive_survey(request):
    import couchdb
    c = couchdb.Server('http://admin:7776@localhost:5984')
    db = c['results']
    del request.data['_id']
    del request.data['_rev']
    id,rev = db.save(request.data)
    Results.objects.create(slug=request.data['slug'],db_id=id)
    return Response(db[id],status=HTTP_200_OK)


    # print(request.data)
    # user = User.objects.get(id=request.user.id)
    # survey_id = request.data['survey']
    # survey = Survey.objects.get(id=survey_id)
    # print(survey)
    # for question,answer in request.data['answers'].items():
    #     q = Question.objects.get(id=question)
    #     data = {'question': q, 'answer':answer,'survey':survey}
    #     serializer = AnswerSerializer(data=data,context={'user':user,'question': q,'survey':survey})
    #     if not serializer.is_valid():
    #         return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    #     serializer.save()
    # return Response(status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def get_surveys_on_id(request):
    user_id = request.user.id
    p = Survey.objects.filter(creator=user_id)
    answers = Answer.objects.filter(survey__in=p)
    for answer in answers:
        print(AnswerSerializer(data=answer).is_valid())
    answers = AnswerSerializer(data=answers,many=True)
    serializer = SurveySerializer(p, many=True)
    data = json.dumps(serializer.data)
    dmodule = SurveyEncryptor(encrypted=True)
    
    return Response(json.dumps(serializer.data),status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def get_result(request,slug=None):
    user_id = request.user.id
    p = Survey.objects.get(slug=slug)
    q = Question.objects.filter(survey=p)
    key = Key.objects.get(survey=p)
    pub_key = json.loads(serializers.serialize('json',[key,]))[0]['fields']['public_key']
    dict_ = []
    for question in q:
        a = Answer.objects.filter(question=question)
        res = json.loads(serializers.serialize('json',a))
        answers = []
        for item in res:
            answers.append(item['fields']['answer'])
        if len(answers) == 0: continue
        sum = SurveyEncryptor.get_sum(answers,pub_key)
        q_id = QuestionSerializer(question).data['title']
        options = QuestionSerializer(question).data['options']
        dict_.append({'title':q_id, 'options':options ,'sum':hex(sum)[2:]})
    
    title = SurveySerializer(p).data['title']
    message = {
        'title': title,
        'questions': dict_
    }
    return Response(json.dumps(message),status=status.HTTP_200_OK)
    

