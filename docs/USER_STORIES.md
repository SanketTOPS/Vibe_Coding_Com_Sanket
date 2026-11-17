# 📋 HomeServe — User Stories & Acceptance Criteria

> **Comprehensive Functional Specifications & Requirements Mapping**  
> Covers all 4 Role-Based Personas: **Customer**, **Service Provider**, **Technician**, and **Super Admin**.

---

## 1. Persona Overview

| Persona | Primary Goal | Key Workflows |
|---|---|---|
| 🧑‍💼 **Customer** | Effortlessly discover, schedule, and pay for reliable home repairs | Browse categories, select date/slot, Razorpay checkout, live status tracking, ratings |
| 🏢 **Service Provider** | Grow local service business, manage agency jobs, and assign staff | Accept/decline booking requests, assign technicians, track business earnings, KYC upload |
| 🔧 **Technician** | View daily assigned work orders, navigate to customer premises, and execute jobs | View scheduled itinerary, mark job in-progress, upload work completion proof, finish job |
| 🛡️ **Super Admin** | Maintain platform trust, onboard providers, resolve disputes, monitor finances | Platform KPIs, review KYC documentation, approve/suspend accounts, audit logs |

---

## 2. Customer User Stories

### US-C01: Browse & Discover Services
- **As a** Customer  
- **I want to** browse home service categories and search by keyword  
- **So that** I can find the exact maintenance service I need with transparent pricing.  
- **Acceptance Criteria**:
  - [x] Categories are displayed with intuitive Lucide icons.
  - [x] Search input filters services dynamically by title, description, or tags.
  - [x] Base price, estimated duration, and customer ratings are clearly visible on every card.

### US-C02: Schedule Service & Real-Time Booking
- **As a** Customer  
- **I want to** choose a date, enter my service address, and submit a booking  
- **So that** a qualified technician can visit at my convenience.  
- **Acceptance Criteria**:
  - [x] Address, city, and 6-digit pincode validation enforced.
  - [x] Date/time selection ensures bookings cannot be scheduled in the past.
  - [x] Unique booking number (e.g. `HS93021948`) generated instantly upon creation.

### US-C03: Secure Online Payment via Razorpay
- **As a** Customer  
- **I want to** pay for my booking online using UPI, Cards, or Net Banking  
- **So that** I don't have to worry about cash on delivery.  
- **Acceptance Criteria**:
  - [x] Official Razorpay checkout modal opens with order amount prefilled.
  - [x] Cryptographic HMAC-SHA256 signature verification performed on the backend.
  - [x] Instant payment success feedback with visual badge update to `Paid`.

### US-C04: Post-Service Rating & Feedback
- **As a** Customer  
- **I want to** submit a 1 to 5 star rating and written review after job completion  
- **So that** I can appreciate good craftsmanship and help other homeowners.  
- **Acceptance Criteria**:
  - [x] Review submission only allowed for bookings with status `completed`.
  - [x] System prevents duplicate reviews for the same booking ID.
  - [x] Provider profile cumulative rating updates automatically upon review submission.

---

## 3. Service Provider User Stories

### US-P01: Booking Request Management
- **As a** Service Provider  
- **I want to** view incoming customer booking requests in my dashboard  
- **So that** I can accept, reject, or assign available team members.  
- **Acceptance Criteria**:
  - [x] Dedicated Provider Dashboard displaying pending, active, and completed orders.
  - [x] Action buttons to accept or decline bookings with optional remarks.

### US-P02: Technician Dispatch & Assignment
- **As a** Service Provider  
- **I want to** delegate confirmed jobs to an employed technician  
- **So that** the customer receives prompt on-site service.  
- **Acceptance Criteria**:
  - [x] Dropdown to assign technician ID to an active booking.
  - [x] Assigned technician receives immediate notification in their portal.

---

## 4. Technician User Stories

### US-T01: Itinerary & Job Status Progression
- **As a** Field Technician  
- **I want to** see my daily assigned service appointments with customer address  
- **So that** I can plan my travel route and update job progress in real time.  
- **Acceptance Criteria**:
  - [x] Status transition controls: `Assigned` → `In Progress` → `Completed`.
  - [x] Customer phone number and street address clearly presented for field navigation.

---

## 5. Super Admin User Stories

### US-A01: Executive Analytics & Platform Governance
- **As a** Super Admin  
- **I want to** monitor platform revenue, total bookings, active users, and provider compliance  
- **So that** I have full operational visibility and governance over the ecosystem.  
- **Acceptance Criteria**:
  - [x] Real-time KPI summary cards: Total Users, Total Bookings, GMV Revenue, Active Providers.
  - [x] Table listing all users with role-filter and account deactivation capability.
  - [x] Audit log monitoring for security and compliance.
