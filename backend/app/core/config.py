"""
Application configuration management using Pydantic settings.
Loads environment variables from .env file.
"""
from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # OpenRouter API
    OPENROUTER_API_KEY: str
    AI_MODEL: str = "anthropic/claude-3.5-sonnet"
    
    # Database
    DATABASE_URL: str
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Platform OAuth Credentials
    # Meta (Facebook/Instagram)
    META_APP_ID: Optional[str] = None
    META_APP_SECRET: Optional[str] = None
    META_REDIRECT_URI: str = "http://localhost:8000/api/platforms/meta/callback"

    # Google Ads
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/platforms/google/callback"

    # TikTok for Business
    TIKTOK_APP_ID: Optional[str] = None
    TIKTOK_APP_SECRET: Optional[str] = None
    TIKTOK_REDIRECT_URI: str = "http://localhost:8000/api/platforms/tiktok/callback"

    # LinkedIn Marketing
    LINKEDIN_CLIENT_ID: Optional[str] = None
    LINKEDIN_CLIENT_SECRET: Optional[str] = None
    LINKEDIN_REDIRECT_URI: str = "http://localhost:8000/api/platforms/linkedin/callback"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
