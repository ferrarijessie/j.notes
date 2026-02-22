from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=7, default="#f4a26a")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="categories")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "name"], name="unique_category_name_per_user"),
        ]

    def __str__(self) -> str:
        return self.name


class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="notes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title
