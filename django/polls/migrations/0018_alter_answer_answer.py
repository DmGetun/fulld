# Generated by Django 4.0.3 on 2022-06-10 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0017_question_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='answer',
            field=models.CharField(max_length=4096),
        ),
    ]
