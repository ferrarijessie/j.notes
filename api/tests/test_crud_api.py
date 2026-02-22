import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from notes.models import Category, Note


@pytest.mark.django_db
def test_category_crud(auth_client, auth_csrf, user):
    create = auth_client.post(
        "/api/categories/",
        {"name": "Work", "color": "#123456"},
        format="json",
        **auth_csrf,
    )
    assert create.status_code == 201, getattr(create, "data", None)
    cid = create.json()["id"]

    obj = Category.objects.get(id=cid)
    assert obj.user == user
    assert obj.name == "Work"

    patch = auth_client.patch(
        f"/api/categories/{cid}/",
        {"name": "Work2"},
        format="json",
        **auth_csrf,
    )
    assert patch.status_code == 200
    assert patch.json()["name"] == "Work2"

    delete = auth_client.delete(f"/api/categories/{cid}/", **auth_csrf)
    assert delete.status_code == 204
    assert Category.objects.filter(id=cid).count() == 0


@pytest.mark.django_db
def test_note_crud_and_object_isolation(auth_client, auth_csrf, user):
    cat = Category.objects.create(user=user, name="Mine", color="#111111")

    create = auth_client.post(
        "/api/notes/",
        {"title": "T", "content": "C", "category": cat.id},
        format="json",
        **auth_csrf,
    )
    assert create.status_code == 201
    nid = create.json()["id"]

    obj = Note.objects.get(id=nid)
    assert obj.user == user
    assert obj.category_id == cat.id

    patch = auth_client.patch(
        f"/api/notes/{nid}/",
        {"content": "C2"},
        format="json",
        **auth_csrf,
    )
    assert patch.status_code == 200
    assert patch.json()["content"] == "C2"

    # another user cannot access this note because queryset is user-scoped
    other = get_user_model().objects.create_user(email="iso@example.com", password="password123")
    other_client = APIClient(enforce_csrf_checks=True)
    other_client.force_authenticate(user=other)

    get_other = other_client.get(f"/api/notes/{nid}/")
    assert get_other.status_code == 404

    del_other = other_client.delete(f"/api/notes/{nid}/")
    assert del_other.status_code == 404

    delete = auth_client.delete(f"/api/notes/{nid}/", **auth_csrf)
    assert delete.status_code == 204
    assert Note.objects.filter(id=nid).count() == 0
