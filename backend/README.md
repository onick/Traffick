# TraffickerHub Backend API

FastAPI backend with Campaign Copilot powered by Claude 3.5 Sonnet via OpenRouter.

## Features

- 🤖 **AI Campaign Copilot** - Intelligent campaign analysis and recommendations
- 💬 **Conversational Chat** - Context-aware conversations about campaigns
- 📊 **Performance Analysis** - Automated insights and anomaly detection
- 🚨 **Smart Alerts** - Proactive notifications for critical issues
- 📈 **Daily Summaries** - Automated performance reports

## Tech Stack

- **Framework**: FastAPI 0.109
- **Database**: PostgreSQL (via SQLAlchemy async)
- **AI Model**: Claude 3.5 Sonnet (via OpenRouter)
- **Python**: 3.11+

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp ../.env.example .env
```

Edit `.env` with your credentials:
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `DATABASE_URL` - PostgreSQL connection string
### 4. Run the Backend

```bash
# Activate virtual environment
source venv/bin/activate

# Start server (development mode with auto-reload)
cd /Users/marcelinofranciscomartinez/Documents/TraffickerNodo/backend
python3 -m uvicorn app.main:app --reload --port 8000
```

Server will start at: `http://localhost:8000`

## API Documentation

Once the server is running:
- **Interactive Docs (Swagger)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc

## Endpoints

### Copilot Endpoints

**POST `/api/copilot/chat`**
- Chat with Campaign Copilot
- Request body:
```json
{
  "message": "¿Cómo está funcionando mi campaña de Black Friday?",
  "brand_id": "optional-brand-uuid",
  "campaign_id": "optional-campaign-uuid"
}
```

**POST `/api/copilot/analyze-campaign`**
- Analyze campaign performance
- Request body:
```json
{
  "campaign_id": "campaign-uuid",
  "question": "¿Por qué subió el CPL?",
  "days": 7
}
```

**GET `/api/copilot/health`**
- Health check for copilot service

## Quick Test

Test the copilot with curl:

```bash
curl -X POST http://localhost:8000/api/copilot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, necesito ayuda con mis campañas"}'
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── core/
│   │   ├── config.py        # Configuration management
│   │   └── database.py      # Database connections
│   ├── api/
│   │   └── copilot.py       # Copilot API endpoints
│   ├── models/
│   │   └── copilot.py       # Pydantic models
│   └── services/
│       └── copilot.py       # Campaign Copilot service (Claude 3.5)
├── venv/                    # Virtual environment
├── requirements.txt         # Python dependencies
└── .env                     # Environment variables (SECRET!)
```

## Features

### Campaign Copilot

The AI assistant can:
- Answer questions about campaign performance
- Analyze metrics and detect anomalies
- Correlate changes with performance shifts
- Generate daily summaries
- Provide actionable recommendations

### Example Conversations

```
User: "¿Qué está pasando con mi campaña de Meta?"

Copilot: "Tu campaña de Meta tuvo un buen rendimiento esta semana:
- Spend: $697 en los últimos 3 días
- Leads: 69 leads generados
- CPL promedio: $10.10

Sin embargo, detecto que después del aumento de presupuesto del 1 de noviembre,
el CPL subió un 37%. Esto puede deberse a:
1. Saturación de audiencia (frecuencia ya en 4.3)
2. Fatiga creativa

Recomiendo:
- Testear 2-3 nuevos creativos
- Expandir la audiencia objetivo
- Considerar reducir el presupuesto un 10-15% para controlar la frecuencia"
```

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
```

## Deployment

For production deployment:

1. Set `ENVIRONMENT=production` in `.env`
2. Use a production-grade ASGI server:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

3. Set up PostgreSQL database (or Supabase)
4. Configure proper CORS origins
5. Use HTTPS

## Next Steps

- [ ] Connect to real database (PostgreSQL/Supabase)
- [ ] Implement authentication & authorization
- [ ] Add database queries for campaigns/metrics
- [ ] Implement recommendation storage
- [ ] Add conversation history persistence
- [ ] Connect frontend chat UI
- [ ] Add platform API integrations (Meta, Google, TikTok)

## Support

For issues or questions, check the main project README or API documentation.
