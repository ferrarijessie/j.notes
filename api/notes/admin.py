from django.contrib import admin

from .models import Category, Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "user", "category", "created_at", "updated_at")
    search_fields = ("title",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "color", "user")
    search_fields = ("name",)
