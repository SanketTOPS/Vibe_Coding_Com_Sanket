import uuid
import pytest
from app.models.coupon import Coupon, DiscountType
from app.models.faq import FAQ
from app.models.service_area import ServiceArea
from app.models.membership_plan import MembershipPlan
from app.models.support_ticket import SupportTicket, TicketStatus, TicketPriority
from app.models.ticket_message import TicketMessage
from app.models.user import User, UserRole
from app.core.security import get_password_hash


def test_coupon_discount_calculation(db):
    c = Coupon(
        code=f"DISC{uuid.uuid4().hex[:4]}",
        discount_type=DiscountType.percentage,
        discount_value=20.00,
        min_order_amount=500.00,
        max_discount_amount=200.00,
        is_active=True
    )
    db.add(c)
    db.commit()

    order_amount = 800.00
    assert order_amount >= float(c.min_order_amount)
    calc_discount = (order_amount * float(c.discount_value)) / 100.0
    final_discount = min(calc_discount, float(c.max_discount_amount))
    assert final_discount == 160.00


def test_faq_retrieval_by_category(db):
    cat_name = f"Billing_{uuid.uuid4().hex[:4]}"
    f1 = FAQ(category=cat_name, question="Can I get an invoice?", answer="Yes, downloadable from orders page.")
    f2 = FAQ(category=cat_name, question="Are taxes included in pricing?", answer="All taxes are shown during checkout.")
    db.add_all([f1, f2])
    db.commit()

    results = db.query(FAQ).filter(FAQ.category == cat_name).all()
    assert len(results) == 2


def test_service_area_coverage_check(db):
    pincode = f"36{uuid.uuid4().hex[:4]}"
    area = ServiceArea(city="Rajkot", state="Gujarat", pincode=pincode, area_name="Speedwell Party Plot Road", is_serviceable=True)
    db.add(area)
    db.commit()

    covered = db.query(ServiceArea).filter(ServiceArea.pincode == pincode, ServiceArea.is_serviceable == True).first()
    assert covered is not None
    assert covered.city == "Rajkot"


def test_membership_plan_attributes(db):
    plan = MembershipPlan(
        name=f"Platinum_{uuid.uuid4().hex[:4]}",
        slug=f"platinum-{uuid.uuid4().hex[:4]}",
        price=2499.00,
        discount_percentage=25.00,
        free_service_visits=5,
        priority_support=True
    )
    db.add(plan)
    db.commit()

    assert plan.price == 2499.00
    assert plan.priority_support is True


def test_support_ticket_and_messaging_thread(db):
    uid = uuid.uuid4().hex[:6]
    user = User(
        email=f"supp_{uid}@example.com",
        full_name="Support Test User",
        hashed_password=get_password_hash("Pass@123"),
        role=UserRole.customer
    )
    db.add(user)
    db.commit()

    ticket = SupportTicket(
        ticket_number=f"TKT-{uid}",
        user_id=user.id,
        subject="AC Cooling issue after repair",
        category="Service Issue",
        priority=TicketPriority.high,
        status=TicketStatus.open
    )
    db.add(ticket)
    db.commit()

    msg = TicketMessage(
        ticket_id=ticket.id,
        sender_id=user.id,
        message="The technician visited yesterday but cooling has not improved."
    )
    db.add(msg)
    db.commit()

    assert ticket.id is not None
    assert len(ticket.messages) == 1
    assert ticket.priority == TicketPriority.high


def test_service_categories_api(client):
    res = client.get("/api/v1/categories/")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
