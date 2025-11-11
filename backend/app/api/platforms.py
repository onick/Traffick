"""
Platform integration endpoints for OAuth and campaign synchronization.
Handles Meta, Google, TikTok, and LinkedIn advertising platforms.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import secrets
import uuid

from app.core.database import get_db
from app.models.platform import PlatformConnection, Campaign
from app.services.meta_integration import MetaIntegrationService
from pydantic import BaseModel


router = APIRouter(prefix="/platforms", tags=["platforms"])

# Store OAuth states temporarily (in production, use Redis or database)
oauth_states: Dict[str, Dict] = {}


# Request/Response models
class PlatformConnectionResponse(BaseModel):
    id: str
    platform: str
    platform_account_id: str
    platform_account_name: Optional[str]
    is_active: bool
    last_sync_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class CampaignResponse(BaseModel):
    id: str
    name: str
    platform: str
    status: str
    daily_budget: Optional[int]
    total_budget: Optional[int]
    spent: int
    impressions: int
    clicks: int
    conversions: int
    leads: int
    start_date: Optional[datetime]
    end_date: Optional[datetime]

    class Config:
        from_attributes = True


# ============================================================================
# META (Facebook/Instagram) ENDPOINTS
# ============================================================================

@router.get("/meta/connect")
async def meta_connect(user_id: str = Query(..., description="User ID to connect")):
    """
    Initiate Meta OAuth flow.
    Redirects user to Facebook login page.

    Args:
        user_id: ID of the user connecting their account

    Returns:
        Redirect to Meta OAuth authorization page
    """
    meta_service = MetaIntegrationService()

    # Generate random state for CSRF protection
    state = secrets.token_urlsafe(32)

    # Store state with user_id (expires in 10 minutes)
    oauth_states[state] = {
        "user_id": user_id,
        "platform": "meta",
        "created_at": datetime.utcnow()
    }

    # Generate authorization URL
    auth_url = meta_service.get_authorization_url(state)

    return RedirectResponse(url=auth_url)


@router.get("/meta/callback")
async def meta_callback(
    code: str = Query(..., description="Authorization code"),
    state: str = Query(..., description="State parameter"),
    db: AsyncSession = Depends(get_db)
):
    """
    OAuth callback endpoint for Meta.
    Exchanges authorization code for access token and saves connection.

    Args:
        code: Authorization code from Meta
        state: State parameter for CSRF validation
        db: Database session

    Returns:
        Redirect to frontend with success/error status
    """
    # Validate state
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid or expired state")

    state_data = oauth_states.pop(state)
    user_id = state_data["user_id"]

    # Check if state is expired (10 minutes)
    if datetime.utcnow() - state_data["created_at"] > timedelta(minutes=10):
        raise HTTPException(status_code=400, detail="State expired")

    try:
        meta_service = MetaIntegrationService()

        # Exchange code for token
        token_data = await meta_service.exchange_code_for_token(code)
        short_lived_token = token_data["access_token"]

        # Get long-lived token (60 days)
        long_lived_data = await meta_service.get_long_lived_token(short_lived_token)
        access_token = long_lived_data["access_token"]
        expires_in = long_lived_data.get("expires_in", 5184000)  # Default 60 days

        # Get ad accounts
        ad_accounts = await meta_service.get_ad_accounts(access_token)

        if not ad_accounts:
            return RedirectResponse(
                url=f"http://localhost:3000/dashboard/integrations?status=error&message=No ad accounts found"
            )

        # Save first ad account (in production, let user choose)
        ad_account = ad_accounts[0]

        # Create platform connection
        connection = PlatformConnection(
            id=uuid.uuid4(),
            user_id=uuid.UUID(user_id),
            platform="meta",
            platform_account_id=ad_account["id"],
            platform_account_name=ad_account.get("name", ""),
            access_token=access_token,  # Should be encrypted in production
            token_expires_at=datetime.utcnow() + timedelta(seconds=expires_in),
            connection_metadata={
                "currency": ad_account.get("currency"),
                "timezone": ad_account.get("timezone_name"),
                "account_status": ad_account.get("account_status")
            },
            is_active=True,
            sync_status="pending"
        )

        db.add(connection)
        await db.commit()

        return RedirectResponse(
            url=f"http://localhost:3000/dashboard/integrations?status=success&platform=meta"
        )

    except Exception as e:
        return RedirectResponse(
            url=f"http://localhost:3000/dashboard/integrations?status=error&message={str(e)}"
        )


@router.post("/meta/{connection_id}/sync")
async def sync_meta_campaigns(
    connection_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Synchronize campaigns from Meta ad account.

    Args:
        connection_id: Platform connection ID
        db: Database session

    Returns:
        Number of campaigns synced
    """
    # Get connection
    result = await db.execute(
        select(PlatformConnection).where(
            PlatformConnection.id == uuid.UUID(connection_id),
            PlatformConnection.platform == "meta"
        )
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")

    if not connection.is_active:
        raise HTTPException(status_code=400, detail="Connection is not active")

    try:
        meta_service = MetaIntegrationService()

        # Update sync status
        connection.sync_status = "syncing"
        await db.commit()

        # Fetch campaigns
        campaigns = await meta_service.get_campaigns(
            connection.access_token,
            connection.platform_account_id
        )

        synced_count = 0

        for meta_campaign in campaigns:
            # Get insights for each campaign
            insights = await meta_service.get_campaign_insights(
                connection.access_token,
                meta_campaign["id"]
            )

            # Parse campaign data
            campaign_data = meta_service.parse_campaign_data(meta_campaign, insights)

            # Check if campaign exists
            result = await db.execute(
                select(Campaign).where(
                    Campaign.platform_campaign_id == campaign_data["platform_campaign_id"]
                )
            )
            existing_campaign = result.scalar_one_or_none()

            if existing_campaign:
                # Update existing campaign
                for key, value in campaign_data.items():
                    setattr(existing_campaign, key, value)
                existing_campaign.last_synced_at = datetime.utcnow()
            else:
                # Create new campaign
                new_campaign = Campaign(
                    id=uuid.uuid4(),
                    connection_id=connection.id,
                    last_synced_at=datetime.utcnow(),
                    **campaign_data
                )
                db.add(new_campaign)

            synced_count += 1

        # Update connection sync status
        connection.sync_status = "completed"
        connection.last_sync_at = datetime.utcnow()
        await db.commit()

        return {
            "success": True,
            "campaigns_synced": synced_count,
            "last_sync_at": connection.last_sync_at
        }

    except Exception as e:
        connection.sync_status = "failed"
        connection.sync_error = str(e)
        await db.commit()
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


# ============================================================================
# GENERAL PLATFORM ENDPOINTS
# ============================================================================

@router.get("/connections", response_model=List[PlatformConnectionResponse])
async def get_connections(
    user_id: str = Query(..., description="User ID"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all platform connections for a user.

    Args:
        user_id: User ID
        db: Database session

    Returns:
        List of platform connections
    """
    result = await db.execute(
        select(PlatformConnection)
        .where(PlatformConnection.user_id == uuid.UUID(user_id))
        .order_by(PlatformConnection.created_at.desc())
    )
    connections = result.scalars().all()

    return [
        PlatformConnectionResponse(
            id=str(conn.id),
            platform=conn.platform,
            platform_account_id=conn.platform_account_id,
            platform_account_name=conn.platform_account_name,
            is_active=conn.is_active,
            last_sync_at=conn.last_sync_at,
            created_at=conn.created_at
        )
        for conn in connections
    ]


@router.delete("/connections/{connection_id}")
async def disconnect_platform(
    connection_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Disconnect a platform connection.

    Args:
        connection_id: Platform connection ID
        db: Database session

    Returns:
        Success message
    """
    result = await db.execute(
        select(PlatformConnection).where(
            PlatformConnection.id == uuid.UUID(connection_id)
        )
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")

    connection.is_active = False
    await db.commit()

    return {"success": True, "message": "Platform disconnected"}


@router.get("/campaigns", response_model=List[CampaignResponse])
async def get_campaigns(
    user_id: str = Query(..., description="User ID"),
    platform: Optional[str] = Query(None, description="Filter by platform"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all campaigns for a user across all connected platforms.

    Args:
        user_id: User ID
        platform: Optional platform filter
        db: Database session

    Returns:
        List of campaigns
    """
    # Get user's connections
    conn_result = await db.execute(
        select(PlatformConnection.id)
        .where(
            PlatformConnection.user_id == uuid.UUID(user_id),
            PlatformConnection.is_active == True
        )
    )
    connection_ids = [row[0] for row in conn_result.all()]

    if not connection_ids:
        return []

    # Build query
    query = select(Campaign).where(Campaign.connection_id.in_(connection_ids))

    if platform:
        query = query.where(Campaign.platform == platform)

    query = query.order_by(Campaign.created_at.desc())

    result = await db.execute(query)
    campaigns = result.scalars().all()

    return [
        CampaignResponse(
            id=str(c.id),
            name=c.name,
            platform=c.platform,
            status=c.status,
            daily_budget=c.daily_budget,
            total_budget=c.total_budget,
            spent=c.spent,
            impressions=c.impressions,
            clicks=c.clicks,
            conversions=c.conversions,
            leads=c.leads,
            start_date=c.start_date,
            end_date=c.end_date
        )
        for c in campaigns
    ]
