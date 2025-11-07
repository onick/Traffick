"""
Copilot API endpoints.
Provides chat, analysis, and recommendation features.
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from datetime import datetime, timedelta
from typing import List

from app.core.database import get_db
from app.services.copilot import copilot
from app.models.copilot import (
    ChatRequest,
    ChatResponse,
    CampaignAnalysisRequest,
    CampaignAnalysisResponse,
    DailySummaryRequest,
    DailySummaryResponse,
    AnomalyDetectionResponse,
    RecommendationResponse
)

router = APIRouter(prefix="/copilot", tags=["copilot"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_copilot(request: ChatRequest):
    """
    Chat with the Campaign Copilot.
    Supports contextual conversations about campaigns and brands.
    """
    try:
        # Get context data if brand_id or campaign_id provided
        context_data = None
        
        # For now, we'll use a simple chat without DB queries
        # In production, you'd query campaigns, metrics, etc.
        
        # Convert conversation history to proper format
        history = [
            {"role": msg.role, "content": msg.content}
            for msg in request.conversation_history
        ]
        
        # Call copilot
        response_text = await copilot.chat(
            conversation_history=history,
            new_message=request.message,
            context_data=context_data
        )
        
        # Generate conversation ID if not provided
        conversation_id = request.conversation_id or f"conv_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return ChatResponse(
            response=response_text,
            conversation_id=conversation_id
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@router.post("/analyze-campaign", response_model=CampaignAnalysisResponse)
async def analyze_campaign(request: CampaignAnalysisRequest):
    """
    Analyze a specific campaign and provide insights.
    """
    try:
        # Mock data for now - in production, query from database
        campaign_data = {
            "id": request.campaign_id,
            "name": "Black Friday - Meta Awareness",
            "platform": "meta",
            "status": "active"
        }
        
        metrics = [
            {"date": "2025-11-06", "spend": 235, "leads": 24, "cpl": 9.79, "roas": 5.96},
            {"date": "2025-11-05", "spend": 232, "leads": 23, "cpl": 10.09, "roas": 5.69},
            {"date": "2025-11-04", "spend": 230, "leads": 22, "cpl": 10.45, "roas": 5.39}
        ]
        
        changes = [
            {
                "date": "2025-11-01",
                "type": "budget_update",
                "description": "Increased daily budget by 50% for Black Friday push"
            }
        ]
        
        # Call copilot for analysis
        analysis = await copilot.analyze_campaign(
            campaign_data=campaign_data,
            metrics=metrics,
            changes=changes,
            question=request.question
        )
        
        return CampaignAnalysisResponse(
            campaign_id=request.campaign_id,
            campaign_name=campaign_data["name"],
            analysis=analysis,
            metrics_summary={"total_spend": 697, "total_leads": 69, "avg_cpl": 10.10}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing campaign: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "campaign-copilot"}
