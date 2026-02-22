import pytest
from django.contrib.auth import get_user_model

from notes.models import Category, Note


@pytest.mark.django_db
def test_categories_scoped_to_user(auth_client, user):
    Category.objects.create(user=user, name="Mine", color="#111111")
    other = get_user_model().objects.create_user(email="other@example.com", password="password123")
    Category.objects.create(user=other, name="Theirs", color="#222222")

    res = auth_client.get("/api/categories/")
    assert res.status_code == 200
    names = [c["name"] for c in res.json()]
    assert "Mine" in names
    assert "Theirs" not in names


@pytest.mark.django_db
def test_notes_scoped_to_user(auth_client, user):
    cat = Category.objects.create(user=user, name="Mine", color="#111111")
    Note.objects.create(user=user, title="A", content="", category=cat)

    other = get_user_model().objects.create_user(email="other2@example.com", password="password123")
    other_cat = Category.objects.create(user=other, name="Other", color="#222222")
    Note.objects.create(user=other, title="B", content="", category=other_cat)

    res = auth_client.get("/api/notes/")
    assert res.status_code == 200
    titles = [n["title"] for n in res.json()]
    assert titles == ["A"]
