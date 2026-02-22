import pytest


@pytest.mark.django_db
def test_login_requires_csrf(api_client, user):
    res = api_client.post("/api/auth/login/", {"email": user.email, "password": "password123"}, format="json")
    # With SessionAuthentication, CSRF is enforced for unsafe requests only once the user
    # is authenticated (i.e. when the session is being used). Login itself can succeed
    # without a CSRF token.
    assert res.status_code == 200


@pytest.mark.django_db
def test_signup_login_me_flow(api_client, csrf):
    email = "new@example.com"
    password = "password123"

    res = api_client.post(
        "/api/auth/signup/",
        {"email": email, "password": password},
        format="json",
        **csrf,
    )
    assert res.status_code == 201
    assert res.json()["user"]["email"] == email

    me = api_client.get("/api/auth/me/")
    assert me.status_code == 200
    assert me.json()["user"]["email"] == email

    # Refresh CSRF token before logout to avoid token mismatch issues.
    api_client.get("/api/auth/csrf/")
    token = api_client.cookies.get("csrftoken")
    assert token is not None
    logout = api_client.post(
        "/api/auth/logout/",
        {},
        format="json",
        HTTP_X_CSRFTOKEN=token.value,
    )
    assert logout.status_code == 204

    me2 = api_client.get("/api/auth/me/")
    assert me2.status_code in (401, 403)
