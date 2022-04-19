from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from .models import Poll, Question, Answer, Choose
from .utils import get_unique_slug

class AnswerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    order = serializers.IntegerField(default=1)

    class Meta:
        model = Answer
        fields = ['id','title','order']

    def create(self, validated_data):
        return Answer.objects.create(**validated_data)

class QuestionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    poll = serializers.StringRelatedField()
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id','title','poll','answers']

    def create(self, validated_data):
        return Question.objects.create(**validated_data)

    def save(self, *args, **kwargs):
        print(self.data)
        title = self.data['title']
        poll = kwargs['poll']
        q = Question.objects.create(title=title,poll=poll)
        for answer in self.data['answers']:
            a = AnswerSerializer(data=answer)
            if a.is_valid():
                a.save(question=q)

class PollSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    questions = QuestionSerializer(many=True)


    class Meta:
        model = Poll
        fields = ['id','title','questions']


    def create(self, validated_data):
        return Poll.objects.create(**validated_data)


    def save(self, *args, **kwargs):
        slug = get_unique_slug(Poll,self.data['title'])
        p = Poll.objects.create(title=self.data['title'],slug=slug)
        for q in self.data['questions']:
            q = QuestionSerializer(data=q)
            if q.is_valid():
                q.save(poll=p)

class ChooseSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=255)
    poll = serializers.IntegerField()
    chooses = serializers.DictField()

    class Meta:
        model = Choose
        fields = ['username','poll','chooses']

    def create(self,validated_data):
        return Choose.objects.create(**validated_data)

    def save(self, *args, **kwargs):
        poll_id = self.data['poll']
        p = Poll.objects.get(id=poll_id)
        print(p)
        user = self.data['username']
        for key in self.data['chooses']:
            q = Question.objects.get(pk=key)
            Choose.objects.create(poll=p,username=user,question=q,choose=self.data['chooses'][key])

