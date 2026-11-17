import uuid
import pytest
from app.models.coupon import Coupon, DiscountType
from app.models.faq import FAQ
from app.models.service_area import ServiceArea
from app.models.membership_plan import MembershipPlan
from app.models.notification import Notification, NotificationType
from app.models.audit_log import AuditLog
from app.models.user import User, UserRole
from app.core.security import get_password_hash


def test_enterprise_tables_and_crud(db):
    uid = uuid.uuid4().hex[:6]

    # 1. Coupon test
    coupon = Coupon(
        code=f"TEST{uid}",
        description="Test coupon",
        discount_type=DiscountType.flat,
        discount_value=150.00,
        min_order_amount=500.00
    )
    db.add(coupon)
    db.commit()
    assert coupon.id is not None
    assert coupon.discount_value == 150.00

    # 2. FAQ test
    faq = FAQ(
        category="General",
        question=f"Test Question {uid}?",
        answer="Test Answer description"
    )
    db.add(faq)
    db.commit()
    assert faq.id is not None
    assert faq.is_active is True

    # 3. Service Area test
    area = ServiceArea(
        city="Rajkot",
        state="Gujarat",
        pincode=f"36{uid[:4]}",
        area_name="Raiya Road"
    )
    db.add(area)
    db.commit()
    assert area.id is not None

    # 4. Membership Plan test
    plan = MembershipPlan(
        name=f"Gold Plan {uid}",
        slug=f"gold-plan-{uid}",
        price=1499.00,
        duration_months=12,
        discount_percentage=15.00
    )
    db.add(plan)
    db.commit()
    assert plan.id is not None
    assert plan.free_service_visits == 2

    # 5. Audit Log & Notification test
    user = User(
        email=f"audit_user_{uid}@example.com",
        full_name="Audit User",
        hashed_password=get_password_hash("Pass@123"),
        role=UserRole.customer
    )
    db.add(user)
    db.commit()

    log = AuditLog(
        user_id=user.id,
        action="TEST_ACTION",
        resource_type="TestResource",
        details="Sample audit description"
    )
    noti = Notification(
        user_id=user.id,
        title="Welcome",
        message="Welcome to HomeServe platform",
        notification_type=NotificationType.system
    )
    db.add_all([log, noti])
    db.commit()

    assert log.id is not None
    assert noti.id is not None
    assert noti.is_read is False

