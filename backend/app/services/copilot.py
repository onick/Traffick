"""
Campaign Copilot Service
Integrates with Claude 3.5 Sonnet via OpenRouter for intelligent campaign analysis.
"""
import httpx
from typing import Dict, List, Any, Optional
from datetime import datetime, date, timedelta
from app.core.config import settings


class CampaignCopilot:
    """
    AI-powered campaign analysis and recommendation engine.
    Uses Claude 3.5 Sonnet for intelligent insights.
    """
    
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.AI_MODEL
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        
    async def _call_claude(
        self, 
        messages: List[Dict[str, str]], 
        max_tokens: int = 2000
    ) -> str:
        """
        Make API call to Claude via OpenRouter.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            max_tokens: Maximum tokens in response
            
        Returns:
            Claude's response text
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://traffickerhub.com",
            "X-Title": "TraffickerHub Campaign Copilot"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                self.api_url,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
    
    def _get_system_prompt(self) -> str:
        """
        Get the system prompt that defines the copilot's behavior.
        This is the "brain" of the copilot.
        """
        return """Eres el asistente de campañas de una plataforma SaaS llamada TraffickerHub.

Tienes acceso a datos de campañas de marketing digital en formato estructurado (JSON y tablas):
- Brands (clientes)
- Campaigns (nombre, plataforma, objetivo, presupuesto, fechas, estado)
- Metrics por campaña y por día (spend, impressions, clicks, leads, conversions, revenue)
- Creatives (copys, tipo, estado)
- Campaign changes (cambios de presupuesto, estado, creatividades, fechas)

Tu trabajo es:
1. Explicar con claridad qué está pasando en las campañas, usando solo los datos proporcionados.
2. Detectar cambios importantes (subida de CPL, caída de leads, cambios de presupuesto, etc.).
3. Generar insights accionables para traffickers y clientes:
   - Qué campañas están funcionando mejor.
   - Qué campañas son candidatas a pausar o ajustar.
   - Dónde convendría subir o bajar presupuesto.
4. Proponer hipótesis razonables, dejando claro que son hipótesis ("es probable que…", "puede deberse a…"), nunca afirmaciones sin soporte.
5. Responder siempre en español, de forma profesional pero clara, sin tecnicismos innecesarios cuando hablas con un cliente, y con más detalle técnico cuando hablas con un trafficker.

Formato de tus respuestas:
- Empieza con un resumen breve (2–3 líneas).
- Luego da detalles en viñetas o secciones: 
  - Datos clave
  - Cambios detectados
  - Recomendaciones
- Si no hay suficientes datos, dilo claramente y explica qué faltaría para un mejor análisis.

Mantén un tono profesional pero accesible. Eres un experto que ayuda a tomar mejores decisiones basadas en datos."""

    async def analyze_campaign(
        self,
        campaign_data: Dict[str, Any],
        metrics: List[Dict[str, Any]],
        changes: List[Dict[str, Any]],
        question: Optional[str] = None
    ) -> str:
        """
        Analyze a campaign and provide insights.
        
        Args:
            campaign_data: Campaign details (name, platform, budget, etc.)
            metrics: List of daily metrics
            changes: List of recent changes to the campaign
            question: Optional specific question from user
            
        Returns:
            AI-generated analysis and recommendations
        """
        # Build context for Claude
        context = {
            "campaign": campaign_data,
            "metrics_last_14_days": metrics,
            "changes_last_14_days": changes
        }
        
        # Default question if none provided
        if not question:
            question = f"¿Qué está pasando con la campaña '{campaign_data.get('name')}' en los últimos 7 días y qué me recomiendas hacer?"
        
        # Prepare messages for Claude
        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {
                "role": "user",
                "content": f"Contexto de datos:\n```json\n{context}\n```\n\nPregunta: {question}"
            }
        ]
        
        # Call Claude and return response
        return await self._call_claude(messages)
    
    async def generate_daily_summary(
        self,
        brand_data: Dict[str, Any],
        campaigns: List[Dict[str, Any]],
        yesterday_metrics: List[Dict[str, Any]]
    ) -> str:
        """
        Generate a daily performance summary for a brand.
        
        Args:
            brand_data: Brand information
            campaigns: List of active campaigns
            yesterday_metrics: Metrics from yesterday
            
        Returns:
            Daily summary with key insights
        """
        context = {
            "brand": brand_data,
            "active_campaigns": campaigns,
            "yesterday_performance": yesterday_metrics
        }
        
        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {
                "role": "user",
                "content": f"Contexto de datos:\n```json\n{context}\n```\n\nGenera un resumen diario de rendimiento para la marca {brand_data.get('name')}. Incluye:\n- Resumen ejecutivo del día anterior\n- Campañas destacadas (mejor y peor performance)\n- Alertas si hay algo crítico\n- 2-3 recomendaciones accionables"
            }
        ]
        
        return await self._call_claude(messages)
    
    async def detect_anomalies(
        self,
        campaign_data: Dict[str, Any],
        current_metrics: Dict[str, Any],
        historical_avg: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """
        Detect anomalies in campaign performance.
        
        Args:
            campaign_data: Campaign details
            current_metrics: Latest metrics
            historical_avg: Historical average for comparison
            
        Returns:
            Anomaly detection result with severity and description, or None
        """
        # Calculate deviations
        cpl_deviation = None
        if historical_avg.get('cpl') and current_metrics.get('cpl'):
            cpl_deviation = ((current_metrics['cpl'] - historical_avg['cpl']) / historical_avg['cpl']) * 100
        
        leads_deviation = None
        if historical_avg.get('leads') and current_metrics.get('leads'):
            leads_deviation = ((current_metrics['leads'] - historical_avg['leads']) / historical_avg['leads']) * 100
        
        # Check for critical anomalies
        anomalies = []
        
        if cpl_deviation and abs(cpl_deviation) > 50:
            anomalies.append({
                "metric": "CPL",
                "deviation": f"{cpl_deviation:+.1f}%",
                "severity": "critical" if cpl_deviation > 0 else "warning"
            })
        
        if leads_deviation and leads_deviation < -40:
            anomalies.append({
                "metric": "Leads",
                "deviation": f"{leads_deviation:+.1f}%",
                "severity": "critical"
            })
        
        if current_metrics.get('spend', 0) > 0 and current_metrics.get('leads', 0) == 0:
            anomalies.append({
                "metric": "Zero Leads",
                "deviation": "No leads with active spend",
                "severity": "critical"
            })
        
        if not anomalies:
            return None
        
        # Ask Claude to explain the anomalies
        context = {
            "campaign": campaign_data,
            "current_metrics": current_metrics,
            "historical_avg": historical_avg,
            "anomalies_detected": anomalies
        }
        
        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {
                "role": "user",
                "content": f"Contexto:\n```json\n{context}\n```\n\nSe han detectado anomalías en esta campaña. Explica brevemente qué está pasando y sugiere 2-3 acciones para resolver el problema."
            }
        ]
        
        explanation = await self._call_claude(messages, max_tokens=500)
        
        return {
            "anomalies": anomalies,
            "explanation": explanation,
            "severity": max(a["severity"] for a in anomalies),
            "detected_at": datetime.now().isoformat()
        }
    
    async def chat(
        self,
        conversation_history: List[Dict[str, str]],
        new_message: str,
        context_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Handle conversational chat with context.
        
        Args:
            conversation_history: Previous messages in the conversation
            new_message: User's new message
            context_data: Optional additional context (campaigns, metrics, etc.)
            
        Returns:
            Copilot's response
        """
        messages = [{"role": "system", "content": self._get_system_prompt()}]
        
        # Add conversation history
        messages.extend(conversation_history)
        
        # Add context if provided
        if context_data:
            context_message = f"\n\n[Contexto de datos disponibles:\n```json\n{context_data}\n```]"
            new_message = new_message + context_message
        
        # Add new user message
        messages.append({"role": "user", "content": new_message})
        
        # Get response from Claude
        return await self._call_claude(messages)


# Global copilot instance
copilot = CampaignCopilot()
