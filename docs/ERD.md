# 🗄️ HomeServe — Entity Relationship Diagram (ERD)

> **Complete 21-Table Relational Schema Architecture**  
> Managed with **SQLAlchemy 2.0** and version-controlled via **Alembic Migrations**.

---

## 1. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PROVIDER_PROFILES : "has"
    USERS ||--o{ TECHNICIAN_PROFILES : "has"
    USERS ||--o{ BOOKINGS : "places as customer"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ DOCUMENTS : "uploads KYC"
    USERS ||--o{ ADDRESSES : "saves"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "triggers"
    USERS ||--o{ SUPPORT_TICKETS : "opens"
    USERS ||--o{ TICKET_MESSAGES : "sends"

    SERVICE_CATEGORIES ||--o{ SERVICES : "categorizes"
    PROVIDER_PROFILES ||--o{ SERVICES : "offers"
    PROVIDER_PROFILES ||--o{ TECHNICIAN_PROFILES : "employs"
    PROVIDER_PROFILES ||--o{ PROVIDER_PAYOUTS : "receives"
    TECHNICIAN_PROFILES ||--o{ TECHNICIAN_SCHEDULES : "has"

    SERVICES ||--o{ BOOKINGS : "booked in"
    PROVIDER_PROFILES ||--o{ BOOKINGS : "assigned to"
    TECHNICIAN_PROFILES ||--o{ BOOKINGS : "dispatched for"

    BOOKINGS ||--|| PAYMENTS : "generates"
    BOOKINGS ||--o| REVIEWS : "receives"
    BOOKINGS ||--o{ BOOKING_ITEMS : "contains"
    BOOKINGS ||--o{ SUPPORT_TICKETS : "referenced in"

    SUPPORT_TICKETS ||--o{ TICKET_MESSAGES : "contains thread"

    USERS {
        int id PK
        string email UK
        string phone UK
        string full_name
        string hashed_password
        enum role
        bool is_active
        bool is_verified
        string city
        string pincode
        datetime created_at
    }

    SERVICE_CATEGORIES {
        int id PK
        string name UK
        string slug UK
        string description
        string icon_name
        bool is_active
        int display_order
    }

    SERVICES {
        int id PK
        int provider_id FK
        int category_id FK
        string name
        decimal base_price
        string price_unit
        float duration_hours
        bool is_active
    }

    PROVIDER_PROFILES {
        int id PK
        int user_id FK
        string business_name
        string bio
        float rating
        int total_reviews
        bool is_verified
        bool is_available
    }

    TECHNICIAN_PROFILES {
        int id PK
        int user_id FK
        int provider_id FK
        string specialization
        int experience_years
        float rating
        bool is_available
    }

    BOOKINGS {
        int id PK
        string booking_number UK
        int customer_id FK
        int service_id FK
        int provider_id FK
        int technician_id FK
        enum status
        datetime scheduled_date
        string address
        string city
        string pincode
        decimal amount
        bool is_paid
    }

    PAYMENTS {
        int id PK
        int booking_id FK,UK
        string razorpay_order_id UK
        string razorpay_payment_id
        string razorpay_signature
        decimal amount
        enum status
    }

    REVIEWS {
        int id PK
        int booking_id FK,UK
        int customer_id FK
        int provider_id FK
        int technician_id FK
        float rating
        text comment
        bool is_published
    }

    DOCUMENTS {
        int id PK
        int user_id FK
        enum document_type
        string file_url
        enum status
    }

    COUPONS {
        int id PK
        string code UK
        enum discount_type
        decimal discount_value
        decimal min_order_amount
        decimal max_discount_amount
        int usage_limit
        bool is_active
    }

    BOOKING_ITEMS {
        int id PK
        int booking_id FK
        string item_name
        int quantity
        decimal unit_price
        decimal total_price
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK
        string title
        text message
        enum notification_type
        bool is_read
    }

    AUDIT_LOGS {
        int id PK
        int user_id FK
        string action
        string resource_type
        string resource_id
        string ip_address
        text details
    }

    ADDRESSES {
        int id PK
        int user_id FK
        string title
        string street_address
        string city
        string state
        string pincode
        bool is_default
    }

    SERVICE_AREAS {
        int id PK
        string city
        string state
        string pincode UK
        string area_name
        bool is_serviceable
    }

    TECHNICIAN_SCHEDULES {
        int id PK
        int technician_id FK
        int day_of_week
        string start_time
        string end_time
        bool is_available
    }

    PROVIDER_PAYOUTS {
        int id PK
        int provider_id FK
        decimal amount
        decimal commission_deducted
        decimal net_payout
        enum status
        string transaction_reference UK
    }

    SUPPORT_TICKETS {
        int id PK
        string ticket_number UK
        int user_id FK
        int booking_id FK
        string subject
        enum priority
        enum status
    }

    TICKET_MESSAGES {
        int id PK
        int ticket_id FK
        int sender_id FK
        text message
    }

    FAQS {
        int id PK
        string category
        string question
        text answer
        int display_order
        bool is_active
    }

    MEMBERSHIP_PLANS {
        int id PK
        string name UK
        string slug UK
        decimal price
        int duration_months
        decimal discount_percentage
        int free_service_visits
        bool priority_support
        bool is_active
    }
```

---

## 2. Relational Schema Data Dictionary

| # | Entity / Table Name | Primary Role & Description | Foreign Keys / Dependencies |
|---|---|---|---|
| 1 | `users` | Unified authentication & identity repository for all 4 roles | Self-contained |
| 2 | `service_categories` | Hierarchical taxonomy of home maintenance offerings | Self-contained |
| 3 | `services` | Specific bookable catalog services with baseline rates | `provider_id`, `category_id` |
| 4 | `provider_profiles` | Extended commercial & compliance profile for agencies | `user_id` |
| 5 | `technician_profiles` | Field operative skill set, certifications, and agency link | `user_id`, `provider_id` |
| 6 | `bookings` | Core transaction entity recording order lifecycle & schedule | `customer_id`, `service_id`, `provider_id`, `technician_id` |
| 7 | `payments` | Cryptographically signed Razorpay transactions & escrow ledger | `booking_id` |
| 8 | `reviews` | Customer feedback, 5-star ratings, and provider reputation score | `booking_id`, `customer_id`, `provider_id`, `technician_id` |
| 9 | `documents` | Identity verification, police clearance, and trade license records | `user_id` |
| 10 | `coupons` | Promotional vouchers with percentage/flat discount rules & caps | Self-contained |
| 11 | `booking_items` | Granular line items, spare parts, and add-on services | `booking_id` |
| 12 | `notifications` | In-app alerts, order updates, and promotional broadcasts | `user_id` |
| 13 | `audit_logs` | Immutable audit trail for security, authentication, and admin events | `user_id` |
| 14 | `addresses` | Customer saved address book with landmarks and geo-coordinates | `user_id` |
| 15 | `service_areas` | Operational coverage zones, city boundaries, and active pincodes | Self-contained |
| 16 | `technician_schedules` | Weekly shift availability and working hours per technician | `technician_id` |
| 17 | `provider_payouts` | Net revenue settlement, agency payouts, and commission accounting | `provider_id` |
| 18 | `support_tickets` | Customer service issue management and resolution tracker | `user_id`, `booking_id` |
| 19 | `ticket_messages` | Threaded conversation messages between customer and helpdesk | `ticket_id`, `sender_id` |
| 20 | `faqs` | Frequently Asked Questions and self-serve knowledge base | Self-contained |
| 21 | `membership_plans` | SaaS recurring subscription membership tiers (HomeServe VIP) | Self-contained |

