import uuid
import pytest
from app.models.user import User, UserRole
from app.models.service_category import ServiceCategory
from app.models.provider_profile import ProviderProfile
from app.models.service import Service
from app.models.booking import Booking, BookingStatus
from app.core.security import get_password_hash, create_access_token


@pytest.fixture
def booking_seed(db):
    uid = uuid.uuid4().hex[:6]
    cust = User(
        email=f"cust_br_{uid}@example.com",
        full_name="Booking Review Cust",
        hashed_password=get_password_hash("Pass@123"),
        role=UserRole.customer,
        is_active=True,
        city="Rajkot"
    )
    prov = User(
        email=f"prov_br_{uid}@example.com",
        full_name="Booking Review Prov",
        hashed_password=get_password_hash("Pass@123"),
        role=UserRole.provider,
        is_active=True
    )
    db.add_all([cust, prov])
    db.commit()

    cat = ServiceCategory(
        name=f"Plumbing Pro {uid}",
        slug=f"plumbing-pro-{uid}",
        icon_name="Wrench"
    )
    db.add(cat)
    db.commit()

    p_profile = ProviderProfile(
        user_id=prov.id,
        business_name=f"Rajkot Plumbers {uid}",
        is_verified=True,
        is_available=True
    )
    db.add(p_profile)
    db.commit()

    srv = Service(
        provider_id=p_profile.id,
        category_id=cat.id,
        name=f"Tap Repair Service {uid}",
        base_price=299.00,
        is_active=True
    )
    db.add(srv)
    db.commit()

    return {
        "customer": cust,
        "provider": prov,
        "provider_profile": p_profile,
        "service": srv,
        "category": cat
    }


def test_service_search_and_filters(client, booking_seed):
    srv_name = booking_seed["service"].name
    # Search by query
    res = client.get("/api/v1/services/?q=Tap Repair")
    assert res.status_code == 200
    assert any(srv_name in s["name"] for s in res.json())

    # Search by category
    cat_id = booking_seed["category"].id
    res_cat = client.get(f"/api/v1/services/?category_id={cat_id}")
    assert res_cat.status_code == 200
    assert any(s["id"] == booking_seed["service"].id for s in res_cat.json())


def test_booking_cancel_flow(client, booking_seed):
    cust = booking_seed["customer"]
    srv = booking_seed["service"]
    token = create_access_token({"sub": cust.email, "role": cust.role.value})

    # Create booking
    create_res = client.post(
        "/api/v1/bookings/",
        json={
            "service_id": srv.id,
            "scheduled_date": "2026-11-20T10:00:00",
            "address": "101 Aditya Complex, University Road",
            "city": "Rajkot",
            "pincode": "360005"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_res.status_code == 201
    b_id = create_res.json()["id"]

    # Cancel booking via status endpoint
    cancel_res = client.put(
        f"/api/v1/bookings/{b_id}/status",
        json={"status": "cancelled", "cancellation_reason": "Change of plans"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "cancelled"


def test_review_submission(client, booking_seed, db):
    cust = booking_seed["customer"]
    srv = booking_seed["service"]
    p_prof = booking_seed["provider_profile"]

    # Create and complete booking
    token = create_access_token({"sub": cust.email, "role": cust.role.value})
    create_res = client.post(
        "/api/v1/bookings/",
        json={
            "service_id": srv.id,
            "scheduled_date": "2026-11-20T10:00:00",
            "address": "101 Aditya Complex, University Road",
            "city": "Rajkot",
            "pincode": "360005"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_res.status_code == 201
    b_id = create_res.json()["id"]

    # Mark completed
    prov = booking_seed["provider"]
    prov_token = create_access_token({"sub": prov.email, "role": prov.role.value})
    client.put(
        f"/api/v1/bookings/{b_id}/status",
        json={"status": "completed"},
        headers={"Authorization": f"Bearer {prov_token}"}
    )

    review_res = client.post(
        "/api/v1/reviews/",
        json={
            "booking_id": b_id,
            "rating": 5,
            "comment": "Excellent and prompt work!"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert review_res.status_code == 201
    assert review_res.json()["rating"] == 5
    assert "Excellent" in review_res.json()["comment"]
