from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, NoteViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"notes", NoteViewSet, basename="note")

urlpatterns = [
    path("", include(router.urls)),
]
