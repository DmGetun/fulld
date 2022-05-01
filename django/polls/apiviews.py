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
from polls.serializers import AnswerSerializer, PollSerializer
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
    user = request.user
    if slug is None:
        p = Poll.objects.all()[0]
    else:
        p = get_object_or_404(Survey,slug=slug)
        return Response(PollSerializer(p).data)
    return Response({'error': 'Указанный опрос не найден'},status=HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def add_opros(request):
    print(request.user)
    context = request.data['questions']
    request.data['slug'] = get_unique_slug(Survey)
    serializer = PollSerializer(data=request.data,context={'questions': context})
    if serializer.is_valid():
        poll = serializer.create(validated_data=request.data)
        return Response(PollSerializer(poll).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def receive_poll(request):
    print(request.data)
    serializer = ChooseSerializer(data=request.data)
    if serializer.is_valid():
        choose = serializer.save()
        return Response(ChooseSerializer(choose).data,status.HTTP_200_OK)
    return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def get_polls_on_id(request):
    user_id = request.user.id
    p = Survey.objects.filter(creator=user_id)
    print(p)
    serializer = PollSerializer(p, many=True)
    return Response(json.dumps(serializer.data),status=status.HTTP_200_OK)
    

