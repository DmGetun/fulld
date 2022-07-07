from os import urandom
from ssl import CertificateError
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
from .dmodule import BlingGost34102012
from pygost.gost3410 import prv_unmarshal
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

@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def sign_message(request):
    print(request.data)
    r_value = int(request.data['r'],16)
    k = (3).to_bytes(2,byteorder='little')
    prv = (3).to_bytes(2,byteorder='little')
    gost3410 = BlingGost34102012()
    s = gost3410.calculate_s(k,prv,r_value)
    return Response(dict(s=hex(s)[2:]),status=HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated,])
def get_opros(request,slug = None):
    import couchdb

    gost3410 = BlingGost34102012()
    #k = urandom(64)
    k = (3).to_bytes(2,byteorder='little')
    prv = (3).to_bytes(2,byteorder='little')
    #print(gost3410.get_certificate(1,2))
    Q = gost3410.public_key(prv)
    C = gost3410.generate_C(k)
    cirf = gost3410.get_certificate(Q,C)

    c = couchdb.Server('http://admin:7776@localhost:5984')
    db = c['test1']
    n = Navigate.objects.filter(slug=slug)
    id = n.values('db_id')[0]['db_id']
    slug = n.values('slug')[0]['slug']
    doc = db[id]
    doc['slug'] = slug
    doc['gost3410param'] = cirf
    return Response(doc,status=HTTP_200_OK)


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
    Navigate.objects.create(creator=user,slug=slug,db_id=id)
    return Response(db[id],status=HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def receive_survey(request):
    import couchdb
    c = couchdb.Server('http://admin:7776@localhost:5984')
    db = c['results']
    del request.data['_id']
    del request.data['_rev']
    sign = request.data['sign']
    del request.data['sign']

    gost3410 = BlingGost34102012()
    #k = urandom(64)
    k = (3).to_bytes(2,byteorder='little')
    prv = (3).to_bytes(2,byteorder='little')
    #print(gost3410.get_certificate(1,2))
    Q = gost3410.public_key(prv)
    hash = 2
    result = gost3410.check_sign(sign,hash,Q)
    id,rev = db.save(request.data)
    Results.objects.create(slug=request.data['slug'],db_id=id)
    return Response(db[id],status=HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def get_surveys_on_id(request):
    user = User.objects.get(id=request.user.id)
    results = Navigate.objects.filter(creator=user).values_list('slug','db_id')
    print(f'{results=}')
    import couchdb
    c = couchdb.Server('http://admin:7776@localhost:5984')
    db = c['test1']
    docs = []
    for slug in results:
        print(slug[0])
        doc = db[slug[1]]
        doc['slug'] = slug[0]
        
        docs.append(doc)

    return Response(json.dumps(docs),status=HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def get_result(request,slug=None):
    user_id = request.user.id

    results = Results.objects.filter(slug=slug).values_list('db_id')
    import couchdb
    c = couchdb.Server('http://admin:7776@localhost:5984')
    db = c['results']
    docs = []
    for result in results:
        print(result)
        docs.append(db[result[0]])

    return Response(json.dumps(docs),status=HTTP_200_OK)
    

