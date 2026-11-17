import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1 import auth, users, categories, services, bookings, payments, reviews, providers, admin, uploads

app = FastAPI(
    title="HomeServe API",
    description="Home Services Booking SaaS Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Secure CORS configuration (Never pair wildcard '*' with allow_credentials=True)
cors_origins = [
    settings.FRONTEND_URL.rstrip("/"),
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://homeserve-app-sanket.vercel.app",
    "https://vibe-coding-com-sanket.vercel.app",
]
extra_origins = os.getenv("ALLOWED_ORIGINS", "")
if extra_origins:
    cors_origins.extend([o.strip().rstrip("/") for o in extra_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(services.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(payments.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(providers.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(uploads.router, prefix="/api/v1")


@app.on_event("startup")
def startup_event():
    """Ensure database tables exist and auto-seed initial data on deployment startup."""
    try:
        from app.core.database import engine, Base
        import app.models  # ensure models are registered
        Base.metadata.create_all(bind=engine)
        
        # Auto seed if empty
        import seed
        seed.seed()
    except Exception as e:
        print(f"Startup warning during table creation/seeding: {e}")


# Static files for local uploads
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
def root():
    return {"message": "HomeServe API is running", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

