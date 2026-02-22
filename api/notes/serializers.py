from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, Note

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "color", "user"]


class NoteSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), allow_null=True, required=False)
    category_name = serializers.CharField(source="category.name", read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "content", "category", "category_name", "user", "created_at", "updated_at"]
