from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from .models import Survey, Question, Option, Answer
from .utils import get_unique_slug

class OptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    order = serializers.IntegerField(default=1)

    class Meta:
        model = Option
        fields = ['id','title','order']

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
    Survey = serializers.SlugRelatedField(slug_field='title',read_only=True)
    answers = OptionSerializer(many=True,read_only=True)

    class Meta:
        model = Question
        fields = ['id','title','Survey','answers']

    def create(self,validated_data):
        answers = validated_data['answers']
        survey = self.context['survey']

        question = Question.objects.create(
            title=validated_data['title'],
            survey=survey
        )

        a = OptionSerializer(data=answers,context={'question': question},many=True)
        if a.is_valid():
            a.create(validated_data=validated_data['answers'])
        question.save()


class SurveySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    questions = QuestionSerializer(many=True)
    slug = serializers.SlugField(max_length=70)


    class Meta:
        model = Survey
        fields = ['id','title','questions','creator','slug']

    def create(self, validated_data):
        questions = self.context['questions']
        creator = self.context['creator']
        survey = Survey.objects.create(
            title = validated_data.get('title', None),
            creator = creator,
            slug = validated_data.get('slug', None)
        )
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

