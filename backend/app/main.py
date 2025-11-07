"""
TraffickerHub Backend API
FastAPI application with Campaign Copilot powered by Claude 3.5 Sonnet
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.copilot import router as copilot_router

# Create FastAPI app
app = FastAPI(
    title="TraffickerHub API",
    description="Campaign Management & AI Copilot Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(copilot_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "TraffickerHub API",
        "version": "1.0.0",
        "docs": "/docs",
        "copilot_health": "/api/copilot/health"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )
