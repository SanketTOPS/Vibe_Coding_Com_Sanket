import hmac
import hashlib
import uuid
from datetime import datetime
import pytest
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus
from app.models.payment import Payment, PaymentStatus
from app.core.security import get_password_hash, create_access_token
from app.core.config import settings


def test_root_and_health_endpoints(client):
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "HomeServe API is running" in res_root.json()["message"]

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_payment_verification_hmac_valid_and_invalid(client, db):
    # Setup test customer and booking
    uid = uuid.uuid4().hex[:6]
    cust = User(
        email=f"pay_test_{uid}@example.com",
        full_name="Payment Cust",
        hashed_password=get_password_hash("Pass@123"),
        role=UserRole.customer,
        is_active=True
    )
    db.add(cust)
    db.commit()

    booking = Booking(
        booking_number=f"HS_PAY_{uid}",
        customer_id=cust.id,
        status=BookingStatus.confirmed,
        scheduled_date=datetime(2026, 11, 25, 10, 0, 0),
        address="101 Aditya Complex",
        city="Rajkot",
        pincode="360005",
        amount=500.00,
        is_paid=False
    )
    db.add(booking)
    db.commit()

    order_id = f"order_{uid}"
    payment = Payment(
        booking_id=booking.id,
        amount=500.00,
        razorpay_order_id=order_id,
        status=PaymentStatus.created
    )
    db.add(payment)
    db.commit()

    token = create_access_token({"sub": cust.email, "role": "customer"})

    # 1. Invalid signature should fail
    fail_res = client.post(
        "/api/v1/payments/verify",
        json={
            "razorpay_order_id": order_id,
            "razorpay_payment_id": f"pay_{uid}",
            "razorpay_signature": "invalid_fake_signature_99999"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert fail_res.status_code == 400
    assert "invalid" in fail_res.json()["detail"].lower()

    # 2. Test valid signature in testing mode
    prev_env = settings.ENVIRONMENT
    settings.ENVIRONMENT = "testing"
    try:
        success_res = client.post(
            "/api/v1/payments/verify",
            json={
                "razorpay_order_id": order_id,
                "razorpay_payment_id": f"pay_{uid}",
                "razorpay_signature": "test_verified_sig_123"
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert success_res.status_code == 200
        assert "verified successfully" in success_res.json()["message"]

        # Confirm booking is now marked paid in DB
        db.refresh(booking)
        assert booking.is_paid is True
    finally:
        settings.ENVIRONMENT = prev_env
