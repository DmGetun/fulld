from django.contrib import admin

from .models import Poll
from .models import Question
from .models import Answer
from .models import Choose

admin.site.register(Poll)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Choose)

# Register your models here.
