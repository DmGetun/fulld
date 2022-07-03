from operator import mod
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager,User, AbstractUser

# class Status(models.TextChoices):
#     EXPERT = 'E', 'Expert' 
#     ANALYST = 'A', 'Analyst'

# class User(AbstractUser):
#     status = models.CharField(max_length=1,choices=Status.choices, default=Status.EXPERT)

class Navigate(models.Model):
    slug = models.SlugField(max_length=70,blank=True)
    db_id = models.CharField(max_length=256)

class Survey(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=70,blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Key(models.Model):
    survey = models.OneToOneField(Survey,on_delete=models.CASCADE,related_name='keys',null=True)
    public_key = models.CharField(max_length=4096)
    public_exponent = models.CharField(max_length=4096)
    private_key = models.CharField(max_length=4096)
    private_exponent = models.CharField(max_length=4096)


class Type(models.CharField):
    QUALITATIVE = 'QUALI', 'Qualitative' # качественный
    QUANTITATIVE = 'QUANTI', 'Quantitative' # количественный

class Question(models.Model):
    title = models.CharField(max_length=255)
    order = models.IntegerField(default=1)
    survey = models.ForeignKey(Survey, related_name='questions',on_delete=models.CASCADE,null=True)
    type = models.CharField(max_length=255)

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
    answer = models.CharField(max_length=4096)

    def __str__(self):
        return self.answer