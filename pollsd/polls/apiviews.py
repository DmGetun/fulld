from rest_framework import status
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from polls.serializers import ChooseSerializer, PollSerializer
from polls.serializers import QuestionSerializer
from polls.models import Poll
from polls.models import Question
from polls.models import Answer
from polls.models import Answer
import json
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

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
        p = Poll.objects.get(slug=slug) 
        return Response(PollSerializer(p).data)
    return Response({'error': 'Указанный опрос не найден'},status=HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def add_opros(request):
    serializer = PollSerializer(data=request.data,context={'request': request})
    if serializer.is_valid():
        poll = serializer.save() 
        print(poll)
        return Response(PollSerializer(poll).data,status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def add_user(request):
    print(request.data)


@api_view(["POST"])
def receive_poll(request):
    print(request.data)
    serializer = ChooseSerializer(data=request.data)
    if serializer.is_valid():
        choose = serializer.save()
        return Response(ChooseSerializer(choose).data)
    return Response(serializer.errors)
    

