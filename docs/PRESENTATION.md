# 🎯 HomeServe SaaS — Project Presentation & Pitch Deck

> **Slide-by-Slide Walkthrough for Project Evaluation, Investor Pitch & Technical Showcase**

---

## Slide 1: Title & Executive Summary
- **Project**: HomeServe — Next-Gen On-Demand Home Services SaaS Platform
- **Tagline**: Connecting homeowners with verified technicians in minutes.
- **Presenter**: Sanket (Vibe Coding Project)
- **Live URLs**:
  - Frontend: `https://homeserve-app-sanket.vercel.app/`
  - Backend API: `https://vibe-coding-com-sanket-mdmm.onrender.com/docs`
  - GitHub: `https://github.com/SanketTOPS/Vibe_Coding_Com_Sanket`

---

## Slide 2: The Problem Statement
- **Fragmented Market**: Finding trusted plumbers, electricians, or cleaners locally is difficult, unregulated, and opaque.
- **Unreliable Pricing**: Customers face arbitrary pricing with no quality guarantee or standard warranties.
- **Operational Chaos for Providers**: Independent technicians lack CRM tools, scheduling software, and digital payment collection.

---

## Slide 3: The HomeServe Solution
- **Unified 4-Sided SaaS Ecosystem**:
  1. **Customer**: Transparent pricing, 1-click booking, Razorpay checkout, live tracking.
  2. **Service Provider**: Multi-service catalog, team dispatch, business revenue dashboard.
  3. **Technician**: Clean field itinerary, real-time status transitions (`In Progress` → `Done`).
  4. **Super Admin**: Central governance, KYC approval, platform GMV analytics, security audit logs.

---

## Slide 4: Full-Stack Architecture & Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6.
- **Backend**: Python 3.11, FastAPI v1, Starlette, Uvicorn, Pydantic v2.
- **Database & ORM**: SQLAlchemy 2.0, Alembic Migrations, SQLite / Cloud MySQL support with 21 relational tables.
- **Payment & Security**: Razorpay Checkout SDK, HMAC-SHA256 signature verification, JWT HS256 auth, RBAC.
- **Cloud Infrastructure**: Vercel Global Edge (Frontend) + Render Cloud Engine (Backend).

---

## Slide 5: Database Engineering (21 Enterprise Tables)
- Complete relational architecture with zero data loss risk:
  - `users`, `service_categories`, `services`, `provider_profiles`, `technician_profiles`
  - `bookings`, `payments`, `reviews`, `documents`, `coupons`, `booking_items`
  - `notifications`, `audit_logs`, `addresses`, `service_areas`, `technician_schedules`
  - `provider_payouts`, `support_tickets`, `ticket_messages`, `faqs`, `membership_plans`
- Zero-downtime database evolution with automated **Alembic** migrations.

---

## Slide 6: Live Product Demonstration Flow
1. **Explore**: Customer lands on animated hero section with red-accent branding.
2. **Select**: Chooses "AC Master Service" (₹499) and selects preferred booking slot.
3. **Pay**: Triggers official Razorpay test checkout modal (UPI/Card/NetBanking).
4. **Fulfill**: Provider accepts booking; technician receives task on mobile-responsive portal.
5. **Review**: Customer marks service complete and provides a verified 5-star review.

---

## Slide 7: Security & Quality Assurance
- **25 Comprehensive Test Cases**: 100% passing automated test suite (`pytest`).
- **Security Hardening**:
  - Passwords hashed with Bcrypt (72-byte buffer sanitized).
  - Explicit CORS whitelist (rejects insecure wildcard credential pairing).
  - Cryptographic HMAC-SHA256 signature verification for payments.
  - Role-based authorization guard on all private API endpoints.

---

## Slide 8: Future Roadmap & Growth
- [ ] Mobile Applications (React Native / Flutter for Field Technicians).
- [ ] Real-time Geo-Tracking via WebSocket and Google Maps API.
- [ ] AI-Powered Smart Dispatch Engine using technician proximity and rating.
- [ ] Enterprise Corporate Facility Maintenance Subscriptions.

---

**Thank You!**  
*Contact: 101 Aditya Complex, University Road, Above SBI Bank, Rajkot - 360005 | +91 97247 99469 | https://homeserve-app-sanket.vercel.app*

