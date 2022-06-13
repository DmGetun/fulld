from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from .models import Survey, Question, Option, Answer
from .utils import get_unique_slug
from .models import Key

class OptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    order = serializers.IntegerField(default=1)
    question = serializers.SlugRelatedField(slug_field='title',read_only=True)

    class Meta:
        model = Option
        fields = ['id','title','order','question']

    def create(self, validated_data):
        answer = Option.objects.create(
            title = validated_data['title'],
            order = validated_data['order'],
            question = self.context['question']
        )
        answer.save()

class QuestionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    survey = serializers.SlugRelatedField(slug_field='title',read_only=True)
    options = OptionSerializer(many=True)
    type = serializers.CharField(max_length=255)

    class Meta:
        model = Question
        fields = ['id','title','survey','options','type']

    def create(self,validated_data):
        answers = validated_data['options']
        survey = self.context['survey']

        question = Question.objects.create(
            title=validated_data['title'],
            survey=survey,
            type=validated_data['type']
        )

        a = OptionSerializer(data=answers,context={'question': question},many=True)
        if a.is_valid():
            a.create(validated_data=validated_data['options'])
        question.save()


class KeySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    survey = serializers.SlugRelatedField(slug_field='title',read_only=True)
    public_key = serializers.CharField(max_length=4096)
    public_exponent = serializers.CharField(max_length=4096)
    private_key = serializers.CharField(max_length=4096)
    private_exponent = serializers.CharField(max_length=4096)


    class Meta:
        model = Key
        fields = '__all__'
    
    def create(self,validated_data):
        print(validated_data)
        survey = self.context['survey']
        print(f'survey: {survey}')

        keys = Key.objects.create(
            survey=survey,
            public_key = validated_data['public_key'],
            public_exponent = validated_data['public_exponent'],
            private_key = validated_data['private_key'],
            private_exponent = validated_data['private_exponent'],
        )
        print(keys)
        keys.save()


class SurveySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    questions = QuestionSerializer(many=True)
    slug = serializers.SlugField(max_length=70)
    keys = KeySerializer(many=False)


    class Meta:
        model = Survey
        fields = ['id','title','questions','creator','slug','keys']

    def create(self, validated_data):
        questions = self.context['questions']
        creator = self.context['creator']
        keys = self.context['keys']
        survey = Survey.objects.create(
            title = validated_data.get('title', None),
            creator = creator,
            slug = validated_data.get('slug', None)
        )
        k = KeySerializer(data=keys,context={'survey': survey})
        if k.is_valid():
            k.create(validated_data=keys)
        q = QuestionSerializer(data=questions,context={'survey': survey},many=True)
        if q.is_valid():
            q.create(validated_data=questions)
        survey.save()
        return survey

        



class AnswerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    survey = serializers.SlugRelatedField(slug_field='title',read_only=True)
    question = serializers.SlugRelatedField(slug_field='title',read_only=True)
    answer = serializers.CharField(max_length=4096)

    class Meta:
        model = Answer
        fields = ['id','survey','question','answer']

    def create(self,validated_data):
        return Answer.objects.create(**validated_data)

    def save(self, *args, **kwargs):
        answer = self.data['answer']
        survey = self.context['survey']
        q = self.context['question']
        user = self.context['user']
        Answer.objects.create(user=user,question=q,answer=answer,survey=survey)

