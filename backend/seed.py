"""Seed the database with initial realistic demonstration data for HomeServe."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Ensure utf-8 output on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from datetime import datetime, timedelta
from app.core.database import SessionLocal, engine, Base
from app.core.config import settings

# Import all models to ensure registration
from app.models import (
    User, UserRole,
    ServiceCategory, Service, ProviderProfile, 
    TechnicianProfile, Booking, BookingStatus,
    Payment, PaymentStatus, Review, Document
)
from app.core.security import get_password_hash


def seed():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        if db.query(User).count() > 0:
            print("Database already contains data. Skipping initial seeding...")
            return
        
        print("🌱 Seeding HomeServe database with initial data...")
        
        # 1. Super Admin
        admin = User(
            email="admin@homeserve.com",
            full_name="Super Admin",
            phone="+919876543210",
            hashed_password=get_password_hash("Admin@123"),
            role=UserRole.super_admin,
            is_active=True,
            is_verified=True,
            city="Mumbai",
            state="Maharashtra"
        )
        db.add(admin)
        
        # 2. Customers
        customer1 = User(
            email="customer@homeserve.com",
            full_name="Rahul Sharma",
            phone="+919876543211",
            hashed_password=get_password_hash("Customer@123"),
            role=UserRole.customer,
            is_active=True,
            is_verified=True,
            address="A-402, Sea Green Heights, Worli",
            city="Mumbai",
            state="Maharashtra",
            pincode="400018"
        )
        customer2 = User(
            email="priya.patel@example.com",
            full_name="Priya Patel",
            phone="+919876543212",
            hashed_password=get_password_hash("Customer@123"),
            role=UserRole.customer,
            is_active=True,
            is_verified=True,
            address="B-12, Green Park Avenue, Andheri West",
            city="Mumbai",
            state="Maharashtra",
            pincode="400053"
        )
        db.add_all([customer1, customer2])
        
        # 3. Providers
        provider1_user = User(
            email="provider@homeserve.com",
            full_name="Sharma Electricals & Services",
            phone="+919876543213",
            hashed_password=get_password_hash("Provider@123"),
            role=UserRole.provider,
            is_active=True,
            is_verified=True,
            address="Shop 4, Market Road, Bandra",
            city="Mumbai",
            state="Maharashtra",
            pincode="400050"
        )
        provider2_user = User(
            email="purecare@homeserve.com",
            full_name="PureCare Home & Facility Care",
            phone="+919876543214",
            hashed_password=get_password_hash("Provider@123"),
            role=UserRole.provider,
            is_active=True,
            is_verified=True,
            address="Office 102, Tech Park, Powai",
            city="Mumbai",
            state="Maharashtra",
            pincode="400076"
        )
        db.add_all([provider1_user, provider2_user])
        db.flush()
        
        # Provider Profiles
        p1_profile = ProviderProfile(
            user_id=provider1_user.id,
            business_name="Sharma Electricals & Tech Services",
            business_description="Top-rated electrical repair, installations, appliance troubleshooting with 10+ years of certified service in Mumbai.",
            years_experience=12,
            service_area="Mumbai, Thane, Navi Mumbai",
            is_verified=True,
            is_available=True,
            rating=4.8,
            total_reviews=42,
            total_bookings=120,
            gst_number="27AAACH1234F1Z5"
        )
        p2_profile = ProviderProfile(
            user_id=provider2_user.id,
            business_name="PureCare Cleaning & Pest Experts",
            business_description="Comprehensive residential deep cleaning, sofa sanitization, painting, and eco-friendly pest prevention solutions.",
            years_experience=8,
            service_area="Mumbai, Western Suburbs",
            is_verified=True,
            is_available=True,
            rating=4.7,
            total_reviews=35,
            total_bookings=95,
            gst_number="27BBBPG5678K1Z3"
        )
        db.add_all([p1_profile, p2_profile])
        db.flush()
        
        # 4. Technicians
        tech1_user = User(
            email="technician@homeserve.com",
            full_name="Ravi Kumar",
            phone="+919876543215",
            hashed_password=get_password_hash("Tech@12345"),
            role=UserRole.technician,
            is_active=True,
            is_verified=True,
            city="Mumbai"
        )
        tech2_user = User(
            email="amit.verma@homeserve.com",
            full_name="Amit Verma",
            phone="+919876543216",
            hashed_password=get_password_hash("Tech@12345"),
            role=UserRole.technician,
            is_active=True,
            is_verified=True,
            city="Mumbai"
        )
        db.add_all([tech1_user, tech2_user])
        db.flush()
        
        tech1_profile = TechnicianProfile(
            user_id=tech1_user.id,
            provider_id=p1_profile.id,
            specialization="Master Electrician & Wiring Expert",
            bio="Certified high-voltage and domestic inverter/switchgear specialist with 7 years on-field experience.",
            is_available=True,
            rating=4.9,
            total_jobs=64
        )
        tech2_profile = TechnicianProfile(
            user_id=tech2_user.id,
            provider_id=p2_profile.id,
            specialization="Sanitization & Pest Management Specialist",
            bio="Trained in deep chemical sanitation and German pest control techniques.",
            is_available=True,
            rating=4.6,
            total_jobs=48
        )
        db.add_all([tech1_profile, tech2_profile])
        db.flush()
        
        # 5. Service Categories (8 core home service verticals)
        categories_data = [
            {"name": "Electrician", "slug": "electrician", "icon_name": "Zap", "display_order": 1, "description": "Wiring, short-circuit fixes, switches, MCBs and appliances"},
            {"name": "Plumber", "slug": "plumber", "icon_name": "Droplets", "display_order": 2, "description": "Leakage repairs, pipe fittings, tap replacements, and drainage"},
            {"name": "AC Technician", "slug": "ac-technician", "icon_name": "Wind", "display_order": 3, "description": "AC servicing, gas refilling, filter deep cleaning & uninstallation"},
            {"name": "Home Cleaner", "slug": "home-cleaner", "icon_name": "Sparkles", "display_order": 4, "description": "Full home deep cleaning, kitchen & bathroom sanitization"},
            {"name": "Painter", "slug": "painter", "icon_name": "Paintbrush", "display_order": 5, "description": "Interior & exterior wall painting, waterproofing, touch-ups"},
            {"name": "Carpenter", "slug": "carpenter", "icon_name": "Hammer", "display_order": 6, "description": "Furniture assembly, door lock fixing, custom carpentry repairs"},
            {"name": "Appliance Repair", "slug": "appliance-repair", "icon_name": "Settings", "display_order": 7, "description": "Washing machine, refrigerator, microwave, and geyser repair"},
            {"name": "Pest Control", "slug": "pest-control", "icon_name": "Bug", "display_order": 8, "description": "Herbal cockroach, anti-termite, bedbug & mosquito control"},
        ]
        
        cat_map = {}
        for cdata in categories_data:
            cat = ServiceCategory(**cdata, is_active=True)
            db.add(cat)
            db.flush()
            cat_map[cdata["slug"]] = cat
        
        # 6. Sample Services
        services_data = [
            {
                "provider_id": p1_profile.id,
                "category_id": cat_map["electrician"].id,
                "name": "Complete Home Wiring & Load Inspection",
                "description": "Comprehensive electrical audit, checking MCB tripping, loose wire insulation, and earth leakages.",
                "base_price": 599.00,
                "price_unit": "per visit",
                "duration_hours": 1.5,
                "tags": "wiring,safety,mcb,electrician",
                "is_active": True
            },
            {
                "provider_id": p1_profile.id,
                "category_id": cat_map["electrician"].id,
                "name": "Ceiling Fan & Chandelier Installation",
                "description": "Professional mounting, balance calibration, hook testing and regulator wiring.",
                "base_price": 299.00,
                "price_unit": "per appliance",
                "duration_hours": 1.0,
                "tags": "fan,installation,fixture",
                "is_active": True
            },
            {
                "provider_id": p1_profile.id,
                "category_id": cat_map["ac-technician"].id,
                "name": "Split AC Jet Pump Deep Servicing",
                "description": "High-pressure indoor and outdoor unit jet cleaning, cooling coil wash, filter refresh & pressure check.",
                "base_price": 799.00,
                "price_unit": "per unit",
                "duration_hours": 1.5,
                "tags": "ac,cooling,jet-pump,servicing",
                "is_active": True
            },
            {
                "provider_id": p2_profile.id,
                "category_id": cat_map["home-cleaner"].id,
                "name": "Full House Deep Cleaning (2 BHK)",
                "description": "Floor scrubbing with single-disc machine, window degreasing, bathroom descaling and dry vacuuming.",
                "base_price": 2499.00,
                "price_unit": "per 2 BHK",
                "duration_hours": 4.0,
                "tags": "cleaning,deep-clean,housekeeping",
                "is_active": True
            },
            {
                "provider_id": p2_profile.id,
                "category_id": cat_map["pest-control"].id,
                "name": "Advanced Herbal Cockroach Control",
                "description": "Odorless herbal gel application in cupboards, cabinets, wall seams + spray treatment for drains.",
                "base_price": 999.00,
                "price_unit": "per treatment",
                "duration_hours": 1.0,
                "tags": "pest,cockroach,herbal,safe",
                "is_active": True
            },
        ]
        
        created_services = []
        for sdata in services_data:
            svc = Service(**sdata)
            db.add(svc)
            db.flush()
            created_services.append(svc)
            
        # 7. Seed Bookings with real lifecycle states
        now = datetime.utcnow()
        
        # Booking 1: Completed with Payment & Review
        b1 = Booking(
            booking_number="HS82910411",
            customer_id=customer1.id,
            service_id=created_services[0].id,
            provider_id=p1_profile.id,
            technician_id=tech1_profile.id,
            status=BookingStatus.completed,
            scheduled_date=now - timedelta(days=2),
            address=customer1.address,
            city=customer1.city,
            pincode=customer1.pincode,
            notes="Please bring extra 16A modular sockets.",
            amount=created_services[0].base_price,
            is_paid=True,
            completed_at=now - timedelta(days=2, hours=3)
        )
        db.add(b1)
        db.flush()
        
        pay1 = Payment(
            booking_id=b1.id,
            razorpay_order_id="order_demo_101",
            razorpay_payment_id="pay_demo_101",
            razorpay_signature="sig_demo_101_verified",
            amount=b1.amount,
            currency="INR",
            status=PaymentStatus.paid
        )
        rev1 = Review(
            booking_id=b1.id,
            customer_id=customer1.id,
            provider_id=p1_profile.id,
            technician_id=tech1_profile.id,
            rating=5.0,
            comment="Ravi arrived promptly and fixed the tripping MCB in under 45 minutes. Super courteous!",
            is_published=True
        )
        db.add_all([pay1, rev1])
        
        # Booking 2: In-progress
        b2 = Booking(
            booking_number="HS58291044",
            customer_id=customer2.id,
            service_id=created_services[2].id,
            provider_id=p1_profile.id,
            technician_id=tech1_profile.id,
            status=BookingStatus.in_progress,
            scheduled_date=now,
            address=customer2.address,
            city=customer2.city,
            pincode=customer2.pincode,
            notes="Master bedroom AC needs coil cleaning.",
            amount=created_services[2].base_price,
            is_paid=True
        )
        db.add(b2)
        db.flush()
        
        pay2 = Payment(
            booking_id=b2.id,
            razorpay_order_id="order_demo_102",
            razorpay_payment_id="pay_demo_102",
            razorpay_signature="sig_demo_102_verified",
            amount=b2.amount,
            currency="INR",
            status=PaymentStatus.paid
        )
        db.add(pay2)
        
        # Booking 3: Pending confirmation
        b3 = Booking(
            booking_number="HS93021948",
            customer_id=customer1.id,
            service_id=created_services[3].id,
            provider_id=p2_profile.id,
            status=BookingStatus.pending,
            scheduled_date=now + timedelta(days=1),
            address=customer1.address,
            city=customer1.city,
            pincode=customer1.pincode,
            notes="Please make sure technicians carry shoe covers.",
            amount=created_services[3].base_price,
            is_paid=False
        )
        db.add(b3)
        
        db.commit()
        print("✅ HomeServe database seeded successfully!")
        print("\n=======================================================")
        print("🎉 Ready-to-use Demo Accounts (Password for all accounts):")
        print("  Super Admin:   admin@homeserve.com      / Admin@123")
        print("  Customer:      customer@homeserve.com   / Customer@123")
        print("  Provider:      provider@homeserve.com   / Provider@123")
        print("  Technician:    technician@homeserve.com / Tech@12345")
        print("=======================================================\n")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()

