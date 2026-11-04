# HomeServe - On-Demand Home Services Booking SaaS Platform

A modern, production-ready full-stack SaaS platform connecting customers with verified professional home service providers (electricians, plumbers, AC technicians, house cleaners, painters, carpenters, appliance repair technicians, and pest control specialists).

---

## 🚀 Key Features & Capabilities

- **4 Role-Based Portals**:
  - **Super Admin**: System overview, platform revenue metrics, user management (activate/deactivate), service category configuration, and provider verification.
  - **Customer**: Browse services by category or search query, view upfront transparent rates, schedule appointments, track real-time booking statuses, pay via Razorpay, and submit reviews & ratings.
  - **Service Provider**: Manage business profile, list and price services, hire and assign technicians, review incoming customer bookings, and accept/reject requests.
  - **Technician**: Dedicated job queue showing scheduled jobs, customer location, service notes, and one-click "Start Work" and "Complete Job" status lifecycle.
- **Booking Lifecycle**: `Pending` ➔ `Confirmed` ➔ `In Progress` ➔ `Completed` / `Cancelled`.
- **Payment Processing**: Integrated Razorpay (test mode) with order generation, checkout modal, and HMAC signature verification.
- **Media & Document Uploads**: Cloudinary integration for verification certificates and service imagery with fallback dev storage.
- **Security**: JWT Authentication (Access + Refresh tokens), bcrypt password hashing, input validation via Pydantic & React hooks, and strict Role-Based Access Control (RBAC).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React, Recharts, React Hot Toast |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2, PyMySQL, Python-JOSE, Passlib, Uvicorn |
| **Database** | MySQL (Production on Cloud Provider) / SQLite (Local Dev Fallback) |
| **Payments** | Razorpay Test Mode API & Checkout.js |
| **Media** | Cloudinary API |
| **Testing** | Pytest (Backend API & Integration Tests), Playwright ready |
| **Deployment** | Vercel (Frontend SPA), Render (Backend FastAPI Web Service) |

---

## 🔐 Demonstration Credentials

The seed script creates the following pre-configured demonstration accounts:

| Role | Email | Password | Access / Purpose |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@homeserve.com` | `Admin@123` | Platform oversight, analytics, user & provider controls |
| **Customer** | `customer@homeserve.com` | `Customer@123` | Booking creation, payment testing, review submissions |
| **Service Provider** | `provider@homeserve.com` | `Provider@123` | Service catalog management, technician dispatch |
| **Technician** | `technician@homeserve.com` | `Tech@12345` | Job execution queue, start/complete actions |

---

## 💻 Local Development Setup

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ (Node 20 recommended)
- MySQL Server (optional for dev; SQLite fallback is supported)

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment (optional)
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux / macOS

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and adjust variables as needed:
cp .env.example .env

# Populate database with initial schema and realistic seed data
python seed.py

# Start FastAPI development server
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

## 🧪 Running Automated Tests

Run the backend Pytest test suite:
```bash
cd backend
pytest -v
```

---

## 🌐 Deployment Configuration

### Frontend (Vercel)
- Configured with `vercel.json` for SPA URL rewrites.
- Set Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_URL=https://your-backend.onrender.com/api/v1`
  - `VITE_RAZORPAY_KEY_ID=your_razorpay_key`

### Backend (Render)
- Configured via `render.yaml` and `Procfile`.
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment Variables:
  - `DATABASE_URL=mysql+pymysql://<user>:<password>@<host>:3306/<database>`
  - `SECRET_KEY=<your-production-secret-key>`
  - `ENVIRONMENT=production`
  - `FRONTEND_URL=https://your-frontend.vercel.app`
  - `RAZORPAY_KEY_ID=<your-razorpay-key>`
  - `RAZORPAY_KEY_SECRET=<your-razorpay-secret>`
  - `CLOUDINARY_CLOUD_NAME=<your-cloud-name>`
  - `CLOUDINARY_API_KEY=<your-api-key>`
  - `CLOUDINARY_API_SECRET=<your-api-secret>`

