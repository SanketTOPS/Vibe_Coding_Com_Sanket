# 🏠 HomeServe — On-Demand Home Services Booking SaaS Platform

![Tests](https://img.shields.io/badge/Tests-25%20Passing-brightgreen?style=for-the-badge&logo=pytest)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20v1-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Database](https://img.shields.io/badge/Database-21%20Tables%20(Alembic)-blue?style=for-the-badge&logo=sqlite)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20HMAC-0C2340?style=for-the-badge)

A modern, production-grade full-stack SaaS platform connecting customers with verified professional home service providers (electricians, plumbers, AC technicians, house cleaners, painters, carpenters, appliance repair technicians, and pest control specialists).

---

## 🌐 Live Production Deployments

- **🚀 Live Frontend (Vercel)**: [https://homeserve-app-sanket.vercel.app/](https://homeserve-app-sanket.vercel.app/)
- **⚡ Live Backend API & Swagger UI (Render)**: [https://vibe-coding-com-sanket-mdmm.onrender.com/docs](https://vibe-coding-com-sanket-mdmm.onrender.com/docs)
- **📦 GitHub Repository**: [https://github.com/SanketTOPS/Vibe_Coding_Com_Sanket](https://github.com/SanketTOPS/Vibe_Coding_Com_Sanket)

---

## 📚 Project Documentation & Architectural Assets

Comprehensive documentation covering system design, database architecture, user personas, presentation slides, and prompt engineering logs:

| Documentation File | Description & Contents |
| :--- | :--- |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | **Full System Architecture Diagram** (Mermaid), Client/Edge/Gateway/Service layers, and security topology. |
| **[docs/ERD.md](docs/ERD.md)** | **Entity-Relationship Diagram** (Mermaid) covering all **21 relational tables**, foreign keys, and data dictionary. |
| **[docs/USER_STORIES.md](docs/USER_STORIES.md)** | Comprehensive **User Stories & Acceptance Criteria** across all 4 personas (Customer, Provider, Technician, Admin). |
| **[docs/PRESENTATION.md](docs/PRESENTATION.md)** | **Slide-by-Slide Presentation Deck** for evaluation, project pitch, and technical demo. |
| **[VIBE_CODING_PROMPT_LOG.md](VIBE_CODING_PROMPT_LOG.md)** | **Complete Vibe Coding History**, prompt sequences, debugging iterations, and engineering decisions. |

---

## 🚀 Key Features & Capabilities

- **4 Role-Based Portals**:
  - **Super Admin**: System overview, platform revenue metrics, user management (activate/deactivate), service category configuration, provider verification, and security audit logs.
  - **Customer**: Browse services by category or search query, view upfront transparent rates, schedule appointments, track real-time booking statuses, pay securely via Razorpay, and submit verified reviews & ratings.
  - **Service Provider**: Manage agency business profile, list and price services, hire and assign technicians, review incoming customer bookings, and accept/reject requests.
  - **Technician**: Dedicated job queue showing scheduled jobs, customer location, service notes, and one-click "Start Work" and "Complete Job" status lifecycle.
- **Booking Lifecycle**: `Pending` ➔ `Confirmed` ➔ `In Progress` ➔ `Completed` / `Cancelled`.
- **Payment Processing**: Integrated Razorpay (test mode) with authentic order generation, checkout modal, and bank-grade HMAC-SHA256 signature verification.
- **Media & Document Uploads**: Cloudinary integration for KYC certificates and service imagery with fallback local storage.
- **Hardened Security**:
  - JWT Authentication (Access + Refresh tokens) strictly sourced from environment variables.
  - Passlib Bcrypt with 72-byte buffer overflow protection.
  - Explicit CORS whitelist (rejects insecure wildcard `*` credential pairing).
  - Cryptographic HMAC-SHA256 signature validation on payment callbacks.

---

## 🗄️ Database Architecture (21 Relational Tables)

The database schema is fully managed with **SQLAlchemy 2.0** and version-controlled via **Alembic Migrations** (`backend/alembic/versions/`):

1. `users` — Authentication & identity for all 4 roles
2. `service_categories` — Taxonomy of home services
3. `services` — Bookable catalog offerings with pricing
4. `provider_profiles` — Commercial agency profile & reputation
5. `technician_profiles` — Field technician skill sets & agency link
6. `bookings` — Core transaction entity recording order lifecycle
7. `payments` — Cryptographically signed Razorpay transactions
8. `reviews` — Customer feedback and 5-star ratings
9. `documents` — KYC & compliance records
10. `coupons` — Promotional discount vouchers & caps
11. `booking_items` — Line items, spare parts & add-ons
12. `notifications` — In-app user notifications & alerts
13. `audit_logs` — Immutable security & administrative audit trail
14. `addresses` — Customer saved address book
15. `service_areas` — Operational city coverage & serviceable pincodes
16. `technician_schedules` — Weekly availability shifts
17. `provider_payouts` — Net revenue settlement & agency earnings
18. `support_tickets` — Customer helpdesk tickets
19. `ticket_messages` — Threaded support conversation messages
20. `faqs` — Knowledge base & self-serve help articles
21. `membership_plans` — Recurring SaaS subscription packages (HomeServe VIP)

---

## 🔑 Demonstration Credentials

The seed script (`python seed.py`) auto-populates the following pre-configured demonstration accounts:

| Role | Email | Password | Access / Purpose |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@homeserve.com` | `Admin@123` | Platform oversight, analytics, user & provider controls |
| **Customer** | `customer@homeserve.com` | `Customer@123` | Booking creation, payment testing, review submissions |
| **Service Provider** | `provider@homeserve.com` | `Provider@123` | Service catalog management, technician dispatch |
| **Technician** | `technician@homeserve.com` | `Tech@12345` | Job execution queue, start/complete actions |

---

## 🧪 Automated Testing (25/25 Tests Passing)

The project includes an exhaustive automated test suite covering authentication, security, RBAC, bookings, payments, and enterprise models:

```bash
cd backend
python -m pytest -v
```

```text
======================= 25 passed in 20.00s =======================
backend/tests/test_auth.py: 4 tests
backend/tests/test_auth_advanced.py: 5 tests
backend/tests/test_bookings_and_reviews.py: 3 tests
backend/tests/test_coupons_and_support.py: 6 tests
backend/tests/test_enterprise_models.py: 1 test
backend/tests/test_payments_and_security.py: 2 tests
backend/tests/test_services_and_bookings.py: 4 tests
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ (Node 20 recommended)
- Cloud MySQL or SQLite (SQLite used by default for zero-configuration setup)

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment (optional)
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux / macOS

# Install dependencies
pip install -r requirements.txt

# Run migrations and seed data
alembic upgrade head
python seed.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- Swagger API Docs: `http://localhost:8000/docs`
- Redoc Documentation: `http://localhost:8000/redoc`

### 3. Frontend Setup
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🏢 Contact & Corporate Office

**HomeServe Platform Headquarters**  
📍 101 Aditya Complex, University Road, Above SBI Bank, Rajkot - 360005, Gujarat, India  
📞 Phone / WhatsApp: +91 97247 99469  
🌐 Web: [https://homeserve-app-sanket.vercel.app/](https://homeserve-app-sanket.vercel.app/)
