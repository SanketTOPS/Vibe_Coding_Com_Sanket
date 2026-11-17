# 🏗️ HomeServe — System Architecture & Technical Design

> **On-Demand Home Services Booking SaaS Platform**  
> Scalable, Multi-Tenant, Role-Based Micro-Architecture built with **FastAPI**, **React 18**, and **Relational Database Management System (SQLite / Cloud MySQL)**.

---

## 1. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Frontend)"]
        UI_Customer["Customer Web Portal\n(React 18 + Vite + Tailwind)"]
        UI_Provider["Service Provider Portal\n(Order Management & Earnings)"]
        UI_Tech["Technician Portal\n(Job Tracking & Field Ops)"]
        UI_Admin["Super Admin Console\n(Analytics, KYC & Control)"]
    end

    subgraph CDN_Edge ["Edge & CDN Layer"]
        VercelEdge["Vercel Global CDN Edge\n(SSL, Gzip/Brotli, Static Caching)"]
        OG_Tags["Open Graph (OG) Engine\n(Social Sharing WhatsApp/Twitter)"]
    end

    subgraph GatewayLayer ["API & Security Gateway"]
        CORS["Strict CORS & Security Headers"]
        JWT_Auth["JWT HS256 Token Auth & RBAC Guard"]
        RateLimit["Rate Limiting & Request Sanitizer"]
    end

    subgraph ServiceLayer ["FastAPI Application Services (v1)"]
        AuthSvc["Auth & Session Service\n(/api/v1/auth)"]
        UserSvc["User & Profile Service\n(/api/v1/users)"]
        CatSvc["Catalog & Service Engine\n(/api/v1/categories, /services)"]
        BookSvc["Booking & Dispatch Engine\n(/api/v1/bookings)"]
        PaySvc["Payment & Escrow Service\n(/api/v1/payments)"]
        ReviewSvc["Review & Rating Aggregator\n(/api/v1/reviews)"]
        AdminSvc["Admin Stats & Audit Engine\n(/api/v1/admin)"]
        UploadSvc["Media & KYC Document Service\n(/api/v1/uploads)"]
    end

    subgraph ThirdPartyIntegrations ["Third-Party External Services"]
        RazorpayGateway["Razorpay Payment Gateway\n(Orders API + HMAC SHA256 Webhooks)"]
        CloudinaryCDN["Cloudinary Media CDN\n(Service Images, Avatars, KYC)"]
    end

    subgraph DatabaseLayer ["Data Persistence & Storage Layer"]
        Alembic["Alembic Migrations\n(21 Relational Tables)"]
        SQLAlchemy["SQLAlchemy 2.0 ORM Engine"]
        CloudDB["Cloud MySQL / SQLite Engine\n(ACID Compliant Storage)"]
        StaticDisk["Local Disk Fallback Storage\n(/static/uploads)"]
    end

    %% Connections
    UI_Customer --> VercelEdge
    UI_Provider --> VercelEdge
    UI_Tech --> VercelEdge
    UI_Admin --> VercelEdge
    VercelEdge --> CORS

    CORS --> JWT_Auth
    JWT_Auth --> RateLimit

    RateLimit --> AuthSvc
    RateLimit --> UserSvc
    RateLimit --> CatSvc
    RateLimit --> BookSvc
    RateLimit --> PaySvc
    RateLimit --> ReviewSvc
    RateLimit --> AdminSvc
    RateLimit --> UploadSvc

    PaySvc <--> RazorpayGateway
    UploadSvc <--> CloudinaryCDN
    UploadSvc -.-> StaticDisk

    AuthSvc & UserSvc & CatSvc & BookSvc & PaySvc & ReviewSvc & AdminSvc --> SQLAlchemy
    SQLAlchemy --> Alembic
    Alembic --> CloudDB
```

---

## 2. Core Architectural Pillars

### A. Frontend Architecture (React 18 + Vite + Tailwind CSS)
- **Role-Based Routing**: Strict route guarding using `ProtectedRoute` enforcing granular role permissions (`customer`, `provider`, `technician`, `super_admin`).
- **State Management**: Reactive `AuthContext` maintaining token lifecycle, user session synchronization, and automatic logout upon expiry.
- **Micro-Interactions**: Lucide icons, responsive modal dialogs, real-time dynamic toast notifications, and animated service badges.
- **Payment Modal**: Seamless integration with the official Razorpay Checkout SDK via client-side injection with prefill user profiles.

### B. Backend Architecture (FastAPI v1)
- **Asynchronous Execution**: High-throughput asynchronous routing powered by Starlette and Uvicorn.
- **Dependency Injection**: Declarative `Depends(get_db)`, `Depends(get_current_user)`, and `Depends(require_role(...))` enforcing separation of concerns.
- **Pydantic v2 Serialization**: Comprehensive bidirectional data contracts preventing input poisoning, SQL injection, and invalid payloads.
- **HMAC Signature Cryptography**: Bank-grade webhook verification for Razorpay payment captures with timing-safe comparison.

### C. Enterprise Data Architecture
- **21 Normalized Relational Entities**: Covering the end-to-end service lifecycle from customer booking, multi-item line tasks, payment ledger, technician slot dispatch, provider payouts, support tickets, to system audit logs.
- **Alembic Database Versioning**: Declarative migration scripts enabling zero-downtime upgrades and multi-cloud DB portability (SQLite ↔ Cloud MySQL).

---

## 3. Security & Compliance Matrix

| Security Layer | Implementation Details |
|---|---|
| **Authentication** | JSON Web Tokens (JWT) signed with HS256, strictly sourced `SECRET_KEY`, 24h expiration |
| **Password Hashing** | Passlib Bcrypt with automated length sanitation (prevents bcrypt 72-byte buffer errors) |
| **CORS Policy** | Explicit domain whitelist (No wildcard `*` with credentials), rejecting unauthorized cross-origin pre-flights |
| **Authorization (RBAC)** | 4-tier hierarchy: Super Admin > Provider > Technician > Customer |
| **Payment Integrity** | HMAC-SHA256 signature verification comparing `order_id` + `payment_id` against merchant secret |
| **Audit Trail** | Dedicated `audit_logs` table tracking sensitive system events, actor user ID, action, and IP address |

