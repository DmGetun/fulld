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
        print(validated_data)
        answer = Answer.objects.create(
            title = validated_data['title'],
            order = validated_data['order'],
            question = self.context['question']
        )
        answer.save()

class QuestionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    poll = serializers.SlugRelatedField(slug_field='title',read_only=True)
    answers = AnswerSerializer(many=True,read_only=True)

    class Meta:
        model = Question
        fields = ['id','title','poll','answers']

    def create(self,validated_data):
        answers = validated_data['answers']
        poll = self.context['poll']

        question = Question.objects.create(
            title=validated_data['title'],
            poll=poll
        )

        a = AnswerSerializer(data=answers,context={'question': question},many=True)
        print(a.is_valid())
        if a.is_valid():
            a.create(validated_data=validated_data['answers'])
        question.save()


class PollSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    questions = QuestionSerializer(many=True)
    creator = serializers.IntegerField()
    slug = serializers.SlugField(max_length=70)


    class Meta:
        model = Poll
        fields = ['id','title','questions','creator','slug']

    def create(self, validated_data):
        questions = self.context['questions']
        poll = Poll.objects.create(
            title = validated_data.get('title', None),
            creator = validated_data.get('creator', None),
            slug = validated_data.get('slug', None)
        )
        q = QuestionSerializer(data=questions,context={'poll': poll},many=True)
        if q.is_valid():
            q.create(validated_data=questions)
        poll.save()

        



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

