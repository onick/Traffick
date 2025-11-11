"""
Meta Marketing API integration service.
Handles OAuth flow and campaign synchronization for Facebook/Instagram Ads.

Documentation: https://developers.facebook.com/docs/marketing-apis
"""
import httpx
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from app.core.config import settings


class MetaIntegrationService:
    """Service for integrating with Meta Marketing API."""

    BASE_URL = "https://graph.facebook.com/v18.0"
    AUTH_URL = "https://www.facebook.com/v18.0/dialog/oauth"
    TOKEN_URL = "https://graph.facebook.com/v18.0/oauth/access_token"

    # Required permissions for Meta Marketing API
    REQUIRED_SCOPES = [
        "ads_management",
        "ads_read",
        "business_management",
        "pages_read_engagement",
        "pages_show_list"
    ]

    def __init__(self):
        self.app_id = settings.META_APP_ID
        self.app_secret = settings.META_APP_SECRET
        self.redirect_uri = settings.META_REDIRECT_URI

    def get_authorization_url(self, state: str) -> str:
        """
        Generate OAuth authorization URL for user to authenticate.

        Args:
            state: Random string to prevent CSRF attacks

        Returns:
            Authorization URL to redirect user to
        """
        scopes = ",".join(self.REQUIRED_SCOPES)
        params = {
            "client_id": self.app_id,
            "redirect_uri": self.redirect_uri,
            "state": state,
            "scope": scopes,
            "response_type": "code",
        }

        param_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{self.AUTH_URL}?{param_string}"

    async def exchange_code_for_token(self, code: str) -> Dict:
        """
        Exchange authorization code for access token.

        Args:
            code: Authorization code from OAuth callback

        Returns:
            Dictionary with access_token, token_type, expires_in

        Raises:
            httpx.HTTPError: If API request fails
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.TOKEN_URL,
                params={
                    "client_id": self.app_id,
                    "client_secret": self.app_secret,
                    "redirect_uri": self.redirect_uri,
                    "code": code,
                }
            )
            response.raise_for_status()
            return response.json()

    async def get_long_lived_token(self, short_lived_token: str) -> Dict:
        """
        Exchange short-lived token for long-lived token (60 days).

        Args:
            short_lived_token: Short-lived access token from initial OAuth

        Returns:
            Dictionary with access_token, token_type, expires_in
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/oauth/access_token",
                params={
                    "grant_type": "fb_exchange_token",
                    "client_id": self.app_id,
                    "client_secret": self.app_secret,
                    "fb_exchange_token": short_lived_token,
                }
            )
            response.raise_for_status()
            return response.json()

    async def get_ad_accounts(self, access_token: str) -> List[Dict]:
        """
        Fetch all ad accounts accessible to the user.

        Args:
            access_token: User's access token

        Returns:
            List of ad account dictionaries
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/me/adaccounts",
                params={
                    "access_token": access_token,
                    "fields": "id,name,account_status,currency,timezone_name"
                }
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])

    async def get_campaigns(
        self,
        access_token: str,
        ad_account_id: str,
        limit: int = 100
    ) -> List[Dict]:
        """
        Fetch campaigns from a specific ad account.

        Args:
            access_token: User's access token
            ad_account_id: Ad account ID (format: act_XXXXX)
            limit: Maximum number of campaigns to fetch

        Returns:
            List of campaign dictionaries
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/{ad_account_id}/campaigns",
                params={
                    "access_token": access_token,
                    "fields": ",".join([
                        "id",
                        "name",
                        "objective",
                        "status",
                        "daily_budget",
                        "lifetime_budget",
                        "start_time",
                        "stop_time",
                        "created_time",
                        "updated_time",
                    ]),
                    "limit": limit,
                }
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])

    async def get_campaign_insights(
        self,
        access_token: str,
        campaign_id: str,
        date_preset: str = "last_30d"
    ) -> Dict:
        """
        Fetch performance insights for a specific campaign.

        Args:
            access_token: User's access token
            campaign_id: Campaign ID
            date_preset: Date range preset (e.g., 'last_7d', 'last_30d', 'lifetime')

        Returns:
            Dictionary with campaign insights
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/{campaign_id}/insights",
                params={
                    "access_token": access_token,
                    "date_preset": date_preset,
                    "fields": ",".join([
                        "impressions",
                        "clicks",
                        "spend",
                        "actions",  # Contains conversions
                        "ctr",
                        "cpc",
                        "cpp",
                        "cpm",
                        "frequency",
                        "reach",
                    ]),
                }
            )
            response.raise_for_status()
            data = response.json()
            insights = data.get("data", [])
            return insights[0] if insights else {}

    async def validate_token(self, access_token: str) -> Dict:
        """
        Validate access token and get token info.

        Args:
            access_token: Token to validate

        Returns:
            Dictionary with token info (app_id, is_valid, expires_at, etc.)
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/debug_token",
                params={
                    "input_token": access_token,
                    "access_token": f"{self.app_id}|{self.app_secret}",
                }
            )
            response.raise_for_status()
            return response.json().get("data", {})

    def parse_campaign_data(self, meta_campaign: Dict, insights: Dict = None) -> Dict:
        """
        Parse Meta campaign data into our internal format.

        Args:
            meta_campaign: Campaign data from Meta API
            insights: Optional insights data

        Returns:
            Dictionary with standardized campaign data
        """
        # Parse budget (Meta returns in cents)
        daily_budget = meta_campaign.get("daily_budget")
        lifetime_budget = meta_campaign.get("lifetime_budget")

        # Parse dates
        start_date = None
        end_date = None
        if meta_campaign.get("start_time"):
            start_date = datetime.fromisoformat(meta_campaign["start_time"].replace("Z", "+00:00"))
        if meta_campaign.get("stop_time"):
            end_date = datetime.fromisoformat(meta_campaign["stop_time"].replace("Z", "+00:00"))

        # Base campaign data
        campaign_data = {
            "platform_campaign_id": meta_campaign["id"],
            "name": meta_campaign.get("name", ""),
            "platform": "meta",
            "objective": meta_campaign.get("objective", "").lower(),
            "status": self._map_status(meta_campaign.get("status", "")),
            "daily_budget": int(daily_budget) if daily_budget else None,
            "total_budget": int(lifetime_budget) if lifetime_budget else None,
            "start_date": start_date,
            "end_date": end_date,
        }

        # Add insights if provided
        if insights:
            # Parse actions to get conversions/leads
            actions = insights.get("actions", [])
            leads = sum(
                int(action.get("value", 0))
                for action in actions
                if action.get("action_type") in ["lead", "submit_application", "complete_registration"]
            )

            conversions = sum(
                int(action.get("value", 0))
                for action in actions
                if action.get("action_type") in ["purchase", "add_to_cart", "initiate_checkout"]
            )

            campaign_data.update({
                "impressions": int(insights.get("impressions", 0)),
                "clicks": int(insights.get("clicks", 0)),
                "spent": int(float(insights.get("spend", 0)) * 100),  # Convert to cents
                "leads": leads,
                "conversions": conversions,
            })

        return campaign_data

    def _map_status(self, meta_status: str) -> str:
        """Map Meta campaign status to our internal status."""
        status_map = {
            "ACTIVE": "active",
            "PAUSED": "paused",
            "DELETED": "archived",
            "ARCHIVED": "archived",
        }
        return status_map.get(meta_status.upper(), "paused")
