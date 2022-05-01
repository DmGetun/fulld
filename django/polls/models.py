from operator import mod
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager,User, AbstractUser

# class Status(models.TextChoices):
#     EXPERT = 'E', 'Expert' 
#     ANALYST = 'A', 'Analyst'

# class User(AbstractUser):
#     status = models.CharField(max_length=1,choices=Status.choices, default=Status.EXPERT)


class Survey(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=70,blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Type(models.CharField):
    QUALITATIVE = 'QUALI', 'Qualitative' # качественный
    QUANTITATIVE = 'QUANTI', 'Quantitative' # количественный

class Question(models.Model):
    title = models.CharField(max_length=255)
    order = models.IntegerField(default=1)
    survey = models.ForeignKey(Survey, related_name='questions',on_delete=models.CASCADE,null=True)

    class Meta:
        ordering=['order']

    def __str__(self):
        return self.title


class Option(models.Model):
    title = models.CharField(max_length=255)
    order = models.IntegerField(default=1)
    question = models.ForeignKey(Question,related_name='options',on_delete=models.CASCADE,null=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    survey = models.ForeignKey(Survey,related_name='answers',on_delete=models.CASCADE,null=True)
    question = models.ForeignKey(Question,related_name='answers',on_delete=models.CASCADE,null=True)
    answer = models.IntegerField(default=1)

    def __str__(self):
        return f'{self.question}: {self.answer}'