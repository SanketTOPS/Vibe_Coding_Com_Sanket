import uuid
import pytest
from app.models.user import User, UserRole
from app.models.service_category import ServiceCategory
from app.models.provider_profile import ProviderProfile
from app.models.service import Service
from app.core.security import get_password_hash, create_access_token


@pytest.fixture
def test_seed(db):
    uid = uuid.uuid4().hex[:6]
    # Customer
    customer = User(
        email=f"cust_{uid}@example.com",
        full_name="Test Customer",
        hashed_password=get_password_hash("Secret@123"),
        role=UserRole.customer,
        is_active=True,
        city="Mumbai"
    )
    # Provider
    provider_user = User(
        email=f"prov_{uid}@example.com",
        full_name="Test Provider User",
        hashed_password=get_password_hash("Secret@123"),
        role=UserRole.provider,
        is_active=True,
        city="Mumbai"
    )
    # Admin
    admin_user = User(
        email=f"admin_{uid}@example.com",
        full_name="Test Admin",
        hashed_password=get_password_hash("Secret@123"),
        role=UserRole.super_admin,
        is_active=True
    )
    db.add_all([customer, provider_user, admin_user])
    db.commit()

    # Category
    category = ServiceCategory(
        name=f"Electrical Work {uid}",
        slug=f"electrical-work-{uid}",
        icon_name="Zap",
        is_active=True
    )
    db.add(category)
    db.commit()

    # Provider profile
    provider_profile = ProviderProfile(
        user_id=provider_user.id,
        business_name=f"Spark Solutions {uid}",
        is_verified=True,
        is_available=True,
        rating=4.9
    )
    db.add(provider_profile)
    db.commit()

    # Service
    service = Service(
        provider_id=provider_profile.id,
        category_id=category.id,
        name=f"Fan Installation {uid}",
        description="Ceiling fan mounting and testing",
        base_price=350.00,
        price_unit="per unit",
        duration_hours=1.0,
        is_active=True
    )
    db.add(service)
    db.commit()

    return {
        "customer": customer,
        "provider_user": provider_user,
        "admin_user": admin_user,
        "category": category,
        "provider_profile": provider_profile,
        "service": service,
    }


def test_list_services(client, test_seed):
    response = client.get("/api/v1/services/")
    assert response.status_code == 200
    services = response.json()
    assert len(services) >= 1
    assert any("Fan Installation" in s["name"] for s in services)


def test_get_service_detail(client, test_seed):
    service_id = test_seed["service"].id
    response = client.get(f"/api/v1/services/{service_id}")
    assert response.status_code == 200
    data = response.json()
    assert "Fan Installation" in data["name"]
    assert data["provider"] is not None
    assert "Spark Solutions" in data["provider"]["business_name"]
    assert data["category"] is not None
    assert "Electrical Work" in data["category"]["name"]


def test_create_and_manage_booking(client, test_seed):
    customer = test_seed["customer"]
    service = test_seed["service"]
    token = create_access_token({"sub": customer.email, "role": customer.role.value})

    booking_payload = {
        "service_id": service.id,
        "scheduled_date": "2026-11-10T14:00:00",
        "address": "Flat 101, Marine Drive",
        "city": "Mumbai",
        "pincode": "400020",
        "notes": "Call 15 minutes before reaching"
    }

    # 1. Create booking
    res = client.post(
        "/api/v1/bookings/",
        json=booking_payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 201
    booking_data = res.json()
    assert booking_data["status"] == "pending"
    assert booking_data["booking_number"].startswith("HS")
    booking_id = booking_data["id"]

    # 2. Get my bookings as customer
    my_res = client.get(
        "/api/v1/bookings/my",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert my_res.status_code == 200
    assert any(b["id"] == booking_id for b in my_res.json())

    # 3. Provider accepts booking
    prov_user = test_seed["provider_user"]
    prov_token = create_access_token({"sub": prov_user.email, "role": prov_user.role.value})

    status_res = client.put(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "confirmed"},
        headers={"Authorization": f"Bearer {prov_token}"}
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "confirmed"


def test_admin_stats(client, test_seed):
    admin = test_seed["admin_user"]
    admin_token = create_access_token({"sub": admin.email, "role": admin.role.value})

    res = client.get(
        "/api/v1/admin/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    stats = res.json()
    assert "total_users" in stats
    assert "total_bookings" in stats
    assert "total_revenue" in stats
