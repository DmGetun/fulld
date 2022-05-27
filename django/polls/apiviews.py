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
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
import jwt
from .models import User
from .dmodule.module import Module

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
    user = User.objects.get(id=request.user.id)
    module = Module()
    keys = module.generate_key()

    context = request.data['questions']
    request.data['slug'] = get_unique_slug(Survey)
    request.data['keys'] = keys

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
    print(request.data)
    serializer = AnswerSerializer(data=request.data)
    if serializer.is_valid():
        choose = serializer.save()
        return Response(AnswerSerializer(choose).data,status.HTTP_200_OK)
    return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def get_surveys_on_id(request):
    user_id = request.user.id
    p = Survey.objects.filter(creator=user_id)
    print(p)
    serializer = SurveySerializer(p, many=True)
    return Response(json.dumps(serializer.data),status=status.HTTP_200_OK)
    

