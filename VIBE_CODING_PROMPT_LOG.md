# 🤖 HomeServe — Vibe Coding & Prompt Engineering Log

> **Complete Record of AI Prompt Engineering, Architectural Iterations, and Vibe Coding Evolution**  
> Documenting prompts, strategies, debugging steps, and system refinements.

---

## 1. Executive Summary & Vibe Coding Philosophy
HomeServe was developed using the **Vibe Coding** paradigm — leveraging high-level conversational directives, rapid rapid code synthesis, autonomous test verification, and iterative feedback loops with state-of-the-art AI foundation models (Gemini & Claude).

This document serves as the audit trail for all prompt sequences, architectural directives, troubleshooting interventions, and post-evaluation remediation.

---

## 2. Chronological Prompt Engineering Log

### Phase 1: Conceptualization & Domain Requirements Planning
#### Prompt 1.1: Project Vision & Multi-Tenant Persona Definition
```text
Act as a Principal SaaS Solutions Architect. Design an On-Demand Home Services Booking 
platform named 'HomeServe'. The platform must connect four distinct personas:
1. Customers (booking, payment, review)
2. Service Providers (agency business management, order acceptance, revenue)
3. Field Technicians (service dispatch, job status updates)
4. Super Admin (platform KPIs, KYC approvals, dispute management)

Provide the core technical specifications, API contracts, and an enterprise 
relational database design.
```
- **Outcome**: Established the 4-role hierarchy, modular REST structure, and initial data schemas.

---

### Phase 2: Full-Stack Architecture & Scaffolding
#### Prompt 2.1: FastAPI Backend Architecture
```text
Create a modular FastAPI v1 backend with SQLAlchemy 2.0 ORM, JWT authentication (HS256), 
role-based access control (RBAC), and dependency injection. Structure the code into:
- app/core/ (config, database, security, dependencies)
- app/models/ (SQLAlchemy models)
- app/schemas/ (Pydantic v2 schemas)
- app/api/v1/ (routers for auth, users, categories, services, bookings, payments, reviews, admin, uploads)
- seed.py (realistic demonstration data with ready demo accounts)
```
- **Outcome**: Produced a robust, clean FastAPI application with standard RESTful conventions.

#### Prompt 2.2: Modern Frontend Design System
```text
Build a modern, high-converting React 18 single-page application using Vite and Tailwind CSS.
Color palette: Professional Red and Warm White gradient aesthetic.
Features:
- Animated Hero section with floating verified service badges
- Category pill selector with Lucide React icons
- Role-based protected routes for Customer, Provider, Technician, and Admin dashboards
- Service Detail Page with date/slot picker and instant booking modal
- Official Razorpay checkout modal integration
- Interactive feedback toasts and responsive mobile navigation
```
- **Outcome**: Generated dynamic UI components, responsive layout, and streamlined UX.

---

### Phase 3: Payment Gateway & Cryptographic Security
#### Prompt 3.1: Razorpay Order Creation & Webhook Verification
```text
Integrate Razorpay Orders API in FastAPI:
1. Endpoint POST /api/v1/payments/create-order: Calculates booking amount in paise, 
   calls razorpay client.order.create(), and links the order to the booking record.
2. Endpoint POST /api/v1/payments/verify: Validates razorpay_order_id, razorpay_payment_id, 
   and cryptographic razorpay_signature using HMAC-SHA256 with timing-safe comparison.
3. Automatically mark booking as is_paid=True upon verified signature.
```
- **Outcome**: Bank-grade payment capture with zero unauthorized status tampering.

---

### Phase 4: Production Deployment & Cloud Orchestration
#### Prompt 4.1: Render Backend & Vercel Frontend Wiring
```text
Deploy the full-stack HomeServe application:
- Frontend on Vercel: Configure vite.config.js, environment variables (VITE_API_URL, VITE_RAZORPAY_KEY_ID),
  and client-side SPA rewrite rules in vercel.json.
- Backend on Render: Python 3.11 pinning, Procfile with Uvicorn worker, startup auto-migration/seeding,
  and environment variables for DATABASE_URL and Razorpay credentials.
```
- **Outcome**: Both tiers deployed live with HTTPS and full frontend-backend API integration.

#### Prompt 4.2: Social Media Open Graph (OG) Meta Tags
```text
Make the platform social-media friendly for WhatsApp, Twitter, and Facebook link sharing:
Add Open Graph (og:title, og:description, og:image, og:url) and Twitter card meta tags in index.html.
Generate a high-resolution 1200x630 og-image.png with brand badge and tagline.
```
- **Outcome**: Rich link previews across WhatsApp, LinkedIn, and Twitter.

---

### Phase 5: Post-Audit & Evaluation Report Remediation
#### Prompt 5.1: Database Expansion to 21 Relational Tables
```text
Evaluation Report Audit Observation: 'Only 9 tables are created against the 20 required.'
Expand the database schema to 21 production-grade relational entities:
Add: coupons, booking_items, notifications, audit_logs, addresses, service_areas,
technician_schedules, provider_payouts, support_tickets, ticket_messages, faqs, membership_plans.
Setup Alembic migrations with an initial autogenerated migration revision.
Update seed.py to populate realistic demonstration data across all 21 tables.
```
- **Outcome**: Database increased from 9 to 21 tables, supported by Alembic migrations.

#### Prompt 5.2: Security Hardening & Strict CORS
```text
Evaluation Report Audit Observation: 'SECRET_KEY hardcoded, CORS uses wildcard with allow_credentials=True, 
and payment verification has test bypass.'
Fixes required:
1. Read SECRET_KEY strictly from environment variable with secure fallback.
2. Remove wildcard '*' from CORS origins; use explicit whitelist of allowed origins.
3. Restrict payment test bypass strictly to automated pytest runs (ENVIRONMENT == 'testing').
4. Sanitize passwords to prevent bcrypt 72-byte buffer overflow errors.
```
- **Outcome**: Hardened security posture, eliminating audit vulnerabilities.

#### Prompt 5.3: Automated Testing & Test Suite Expansion
```text
Evaluation Report Audit Observation: 'Project has only 8 test cases and fails on bcrypt error.'
Expand automated pytest test suite to 25 comprehensive test cases covering:
- Authentication & Duplicate registration prevention
- Bcrypt 72+ character password handling
- Role-based RBAC endpoint protection (403 Forbidden)
- Booking lifecycle and cancellation flow
- Cryptographic payment verification (HMAC signature matching & rejection)
- Review rating calculation and duplicate prevention
- Enterprise model CRUD (coupons, FAQs, service areas, membership plans, support tickets)
```
- **Outcome**: 25/25 automated tests passing with zero failures.

---

## 3. Lessons Learned & Vibe Coding Best Practices
1. **Always Isolate Environment in Testing**: Detaching or re-wrapping `sys.stdout` for Windows UTF-8 compatibility must check for test runner presence (`hasattr(sys.stdout, 'reconfigure')`) to avoid `ValueError: I/O operation on closed file`.
2. **Strict CORS Compliance**: The W3C CORS specification strictly prohibits `Access-Control-Allow-Origin: *` when `Access-Control-Allow-Credentials: true`. Always supply an explicit list of origins.
3. **Bcrypt 72-Byte Boundary**: Passlib with bcrypt >= 4.0 throws an unhandled exception if passwords exceed 72 bytes. Sanitizing input with `password[:72]` guarantees seamless compatibility.
4. **Declarative Database Versioning**: Alembic ensures smooth migrations when adding tables, allowing zero disruption to existing production instances.

