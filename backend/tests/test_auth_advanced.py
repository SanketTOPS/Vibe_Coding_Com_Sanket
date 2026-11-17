import uuid
import pytest
from app.models.user import User, UserRole
from app.core.security import get_password_hash, create_access_token


def test_duplicate_registration_fails(client):
    email = f"dup_{uuid.uuid4().hex[:6]}@example.com"
    payload = {
        "email": email,
        "full_name": "Duplicate Test",
        "password": "Password@123",
        "role": "customer"
    }
    # First registration
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    # Second registration with same email
    res2 = client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already registered" in res2.json()["detail"].lower()


def test_long_password_bcrypt_handling(client):
    """Test that passwords longer than 72 bytes do not crash bcrypt."""
    email = f"longpass_{uuid.uuid4().hex[:6]}@example.com"
    long_pass = "VeryLongPasswordExceedingSeventyTwoBytesLimit1234567890!@#$%^&*()_+" * 2
    res = client.post("/api/v1/auth/register", json={
        "email": email,
        "full_name": "Long Password User",
        "password": long_pass,
        "role": "customer"
    })
    assert res.status_code == 201

    # Login with the long password
    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": long_pass
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()


def test_role_enforcement_forbidden(client, db):
    """Customer cannot access super admin endpoints."""
    email = f"role_cust_{uuid.uuid4().hex[:6]}@example.com"
    cust = User(
        email=email,
        full_name="Role Customer",
        hashed_password=get_password_hash("Pass@123"),
        role=UserRole.customer,
        is_active=True
    )
    db.add(cust)
    db.commit()

    cust_token = create_access_token({"sub": cust.email, "role": "customer"})
    res = client.get(
        "/api/v1/admin/stats",
        headers={"Authorization": f"Bearer {cust_token}"}
    )
    assert res.status_code == 403


def test_missing_or_invalid_auth_token(client):
    # Missing token returns 401 or 403 (unauthorized/forbidden)
    res1 = client.get("/api/v1/auth/me")
    assert res1.status_code in [401, 403]

    # Invalid token returns 401 or 403
    res2 = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid_jwt_token_12345"})
    assert res2.status_code in [401, 403]


def test_update_user_profile(client, db):
    email = f"prof_{uuid.uuid4().hex[:6]}@example.com"
    user = User(
        email=email,
        full_name="Original Name",
        hashed_password=get_password_hash("Pass@123"),
        role=UserRole.customer,
        is_active=True,
        city="Rajkot"
    )
    db.add(user)
    db.commit()

    token = create_access_token({"sub": email, "role": "customer"})
    res = client.put(
        f"/api/v1/users/{user.id}",
        json={"full_name": "Updated Name", "city": "Ahmedabad", "pincode": "380015"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    assert res.json()["full_name"] == "Updated Name"
    assert res.json()["city"] == "Ahmedabad"
