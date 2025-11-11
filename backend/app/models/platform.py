"""
Platform integration models for storing OAuth tokens and connection data.
Supports Meta, Google, TikTok, and LinkedIn advertising platforms.
"""
from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class PlatformConnection(Base):
    """
    Stores OAuth connections to advertising platforms.
    Each user can have multiple connections to the same platform (e.g., multiple Meta ad accounts).
    """
    __tablename__ = "platform_connections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # FK to users table

    # Platform information
    platform = Column(String(50), nullable=False, index=True)  # 'meta', 'google', 'tiktok', 'linkedin'
    platform_account_id = Column(String(255), nullable=False)  # External account ID from platform
    platform_account_name = Column(String(255), nullable=True)  # Account name for display

    # OAuth tokens
    access_token = Column(Text, nullable=False)  # Encrypted in production
    refresh_token = Column(Text, nullable=True)  # Some platforms don't provide refresh tokens
    token_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Connection metadata
    scopes = Column(JSON, nullable=True)  # List of granted OAuth scopes
    connection_metadata = Column(JSON, nullable=True)  # Additional platform-specific data

    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    sync_status = Column(String(50), default='pending')  # 'pending', 'syncing', 'completed', 'failed'
    sync_error = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<PlatformConnection {self.platform} - {self.platform_account_name}>"


class Campaign(Base):
    """
    Stores campaign data synced from advertising platforms.
    """
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    connection_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # FK to platform_connections
    brand_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # FK to brands table

    # Campaign identification
    platform_campaign_id = Column(String(255), nullable=False, unique=True)  # External ID from platform
    name = Column(String(500), nullable=False)

    # Campaign details
    platform = Column(String(50), nullable=False, index=True)
    objective = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, index=True)  # 'active', 'paused', 'completed', 'archived'

    # Budget
    daily_budget = Column(Integer, nullable=True)  # Stored in cents
    total_budget = Column(Integer, nullable=True)  # Stored in cents
    spent = Column(Integer, default=0, nullable=False)  # Stored in cents

    # Performance metrics
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    leads = Column(Integer, default=0)

    # Dates
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)

    # Additional data
    target_audience = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    campaign_metadata = Column(JSON, nullable=True)  # Platform-specific data

    # Sync info
    last_synced_at = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Campaign {self.name} ({self.platform})>"


class Brand(Base):
    """
    Stores brand information that campaigns belong to.
    """
    __tablename__ = "brands"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # FK to users table

    # Brand details
    name = Column(String(255), nullable=False)
    industry = Column(String(100), nullable=True)
    website = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)

    # Brand metadata
    logo_url = Column(String(500), nullable=True)
    brand_metadata = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Brand {self.name}>"


class User(Base):
    """
    User account information.
    """
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # User details
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)

    # Profile
    avatar_url = Column(String(500), nullable=True)
    company_name = Column(String(255), nullable=True)

    # Account status
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<User {self.email}>"
