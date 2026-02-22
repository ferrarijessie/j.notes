import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model


@pytest.fixture
def api_client():
    return APIClient(enforce_csrf_checks=True)


@pytest.fixture
def user(db):
    User = get_user_model()
    return User.objects.create_user(email="user@example.com", password="password123")


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


def csrf_headers(client: APIClient):
    client.get("/api/auth/csrf/")
    token = client.cookies.get("csrftoken")
    assert token is not None
    return {"HTTP_X_CSRFTOKEN": token.value}


@pytest.fixture
def csrf(api_client):
    return csrf_headers(api_client)


@pytest.fixture
def auth_csrf(auth_client):
    return csrf_headers(auth_client)
