from django.db.models.signals import post_save
from django.dispatch import receiver

from notes.models import Category
from .models import User


DEFAULT_CATEGORIES = [
    ("Random Thoughts", "#EF9C66"),
    ("School", "#FCDC94"),
    ("Personal", "#78ABA8"),
]


@receiver(post_save, sender=User)
def create_default_categories(sender, instance: User, created: bool, **kwargs):
    if not created:
        return

    existing_names = set(Category.objects.filter(user=instance).values_list("name", flat=True))
    to_create = [
        Category(user=instance, name=name, color=color)
        for name, color in DEFAULT_CATEGORIES
        if name not in existing_names
    ]
    if to_create:
        Category.objects.bulk_create(to_create)
