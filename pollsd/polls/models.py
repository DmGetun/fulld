from operator import mod
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager,User

class Poll(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=70,blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE,null=True)

    def __str__(self):
        return self.title
    

class Question(models.Model):
    title = models.CharField(max_length=255)
    order = models.IntegerField(default=1)
    poll = models.ForeignKey(Poll, related_name='questions',on_delete=models.CASCADE)

    class Meta:
        ordering=['order']

    def __str__(self):
        return self.title


class Answer(models.Model):
    title = models.CharField(max_length=255)
    order = models.IntegerField(default=1)
    question = models.ForeignKey(Question,related_name='answers',on_delete=models.CASCADE)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Choose(models.Model):
    username = models.CharField(max_length=255)
    poll = models.ForeignKey(Poll,related_name='poll',on_delete=models.CASCADE)
    question = models.ForeignKey(Question,related_name='question',on_delete=models.CASCADE)
    choose = models.IntegerField()

    

