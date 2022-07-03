from django.contrib import admin

from .models import Survey
from .models import Question
from .models import Option
from .models import Answer
from .models import Key
from .models import Navigate
from .models import Results

admin.site.register(Survey)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(Answer)
admin.site.register(Key)
admin.site.register(Navigate)
admin.site.register(Results)

# Register your models here.
