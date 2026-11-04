def test_register_customer(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "test_unique_customer@example.com",
        "full_name": "Test Customer",
        "password": "Password@123",
        "role": "customer"
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test_unique_customer@example.com"
    assert data["user"]["role"] == "customer"


def test_login(client):
    client.post("/api/v1/auth/register", json={
        "email": "login_user@example.com",
        "full_name": "Login User",
        "password": "Password@123",
        "role": "customer"
    })
    response = client.post("/api/v1/auth/login", json={
        "email": "login_user@example.com",
        "password": "Password@123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_password(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "login_user@example.com",
        "password": "WrongPassword999"
    })
    assert response.status_code == 401


def test_get_me(client):
    reg = client.post("/api/v1/auth/register", json={
        "email": "me_test@example.com",
        "full_name": "Me User",
        "password": "Password@123",
        "role": "customer"
    })
    token = reg.json()["access_token"]
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "me_test@example.com"

