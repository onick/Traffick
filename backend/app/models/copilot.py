"""
Pydantic models for Copilot API endpoints.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class ChatMessage(BaseModel):
    """Single chat message."""
    role: str = Field(..., description="Message role: user, assistant, or system")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Request for chat endpoint."""
    message: str = Field(..., description="User's message")
    conversation_id: Optional[str] = Field(None, description="Existing conversation ID")
    brand_id: Optional[str] = Field(None, description="Brand context")
    campaign_id: Optional[str] = Field(None, description="Campaign context")
    conversation_history: Optional[List[ChatMessage]] = Field(default_factory=list)


class ChatResponse(BaseModel):
    """Response from chat endpoint."""
    response: str = Field(..., description="Copilot's response")
    conversation_id: str = Field(..., description="Conversation ID for continuity")
    timestamp: datetime = Field(default_factory=datetime.now)


class CampaignAnalysisRequest(BaseModel):
    """Request for campaign analysis."""
    campaign_id: str = Field(..., description="Campaign UUID")
    question: Optional[str] = Field(None, description="Specific question about campaign")
    days: int = Field(7, description="Number of days to analyze", ge=1, le=90)


class CampaignAnalysisResponse(BaseModel):
    """Response with campaign analysis."""
    campaign_id: str
    campaign_name: str
    analysis: str = Field(..., description="AI-generated analysis")
    metrics_summary: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class DailySummaryRequest(BaseModel):
    """Request for daily summary."""
    brand_id: str = Field(..., description="Brand UUID")
    date: Optional[str] = Field(None, description="Date for summary (YYYY-MM-DD), defaults to yesterday")


class DailySummaryResponse(BaseModel):
    """Response with daily summary."""
    brand_id: str
    brand_name: str
    date: str
    summary: str = Field(..., description="AI-generated daily summary")
    timestamp: datetime = Field(default_factory=datetime.now)


class AnomalyDetectionResponse(BaseModel):
    """Response for anomaly detection."""
    campaign_id: str
    campaign_name: str
    has_anomalies: bool
    anomalies: Optional[List[Dict[str, Any]]] = None
    explanation: Optional[str] = None
    severity: Optional[str] = None
    detected_at: datetime = Field(default_factory=datetime.now)


class RecommendationResponse(BaseModel):
    """AI-generated recommendation."""
    id: str
    title: str
    detail: str
    type: str
    severity: str
    action_items: Optional[List[Dict[str, Any]]] = None
    campaign_id: Optional[str] = None
    generated_at: datetime
