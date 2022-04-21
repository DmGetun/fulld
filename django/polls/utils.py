import random
import string
from django.utils.text import slugify

def random_string_generator(size=10,chars=string.ascii_letters + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def get_unique_slug(instance):
    print('get slug')
    chars = random_string_generator(size=60)

    new_slug = f"{chars[:40]}_{chars[40:]}"
    slug_exists = instance.objects.filter(slug=new_slug).exists()
    if slug_exists:
        return get_unique_slug(instance)
    return new_slug