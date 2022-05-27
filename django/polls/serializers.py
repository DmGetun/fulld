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

    class Meta:
        model = Question
        fields = ['id','title','survey','options']

    def create(self,validated_data):
        answers = validated_data['options']
        survey = self.context['survey']

        question = Question.objects.create(
            title=validated_data['title'],
            survey=survey
        )

        a = OptionSerializer(data=answers,context={'question': question},many=True)
        if a.is_valid():
            a.create(validated_data=validated_data['options'])
        question.save()


class KeySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    survey = serializers.SlugRelatedField(slug_field='title',read_only=True)
    pub_y = serializers.IntegerField(default=1)
    pub_n = serializers.IntegerField(default=1)
    sec_a = serializers.IntegerField(default=1)
    sec_x = serializers.IntegerField(default=1)


    class Meta:
        model = Key
        fields = '__all__'
    
    def create(self,validated_data):
        print(validated_data)
        survey = self.context['survey']
        print(f'survey: {survey}')

        keys = Key.objects.create(
            survey=survey,
            pub_y = validated_data['pub_y'],
            pub_n = validated_data['pub_n'],
            sec_a = validated_data['sec_a'],
            sec_x = validated_data['sec_x'],
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
        print(self.context)
        print('create obj')
        questions = self.context['questions']
        creator = self.context['creator']
        keys = self.context['keys']
        survey = Survey.objects.create(
            title = validated_data.get('title', None),
            creator = creator,
            slug = validated_data.get('slug', None)
        )
        k = KeySerializer(data={'keys':keys},context={'survey': survey})
        if k.is_valid():
            k.create(validated_data=keys)
        q = QuestionSerializer(data=questions,context={'survey': survey},many=True)
        if q.is_valid():
            q.create(validated_data=questions)
        survey.save()
        return survey

        



class AnswerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=255)
    Survey = serializers.IntegerField()
    chooses = serializers.DictField()

    class Meta:
        model = Answer
        fields = ['username','survey','chooses']

    def create(self,validated_data):
        return Answer.objects.create(**validated_data)

    def save(self, *args, **kwargs):
        Survey_id = self.data['survey']
        p = Survey.objects.get(id=Survey_id)
        user = self.data['username']
        for key in self.data['chooses']:
            q = Question.objects.get(pk=key)
            Answer.objects.create(Survey=p,username=user,question=q,choose=self.data['chooses'][key])

