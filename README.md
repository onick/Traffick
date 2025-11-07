# TraffickerHub

**Professional Campaign Management & AI Copilot Platform**

TraffickerHub is a comprehensive SaaS platform for managing paid media campaigns across multiple platforms (Meta, Google, TikTok, LinkedIn) with an intelligent AI copilot powered by Claude 3.5 Sonnet.

## 🚀 Features

- **📊 Real-time Dashboard** - Beautiful Next.js dashboard with live metrics and charts
- **🤖 AI Campaign Copilot** - Intelligent assistant powered by Claude 3.5 Sonnet
- **📈 Performance Analytics** - Track KPIs, detect anomalies, get actionable insights
- **🔔 Smart Alerts** - Proactive notifications for campaign issues
- **📝 Campaign Management** - Manage campaigns, creatives, and budgets in one place
- **🎯 Multi-platform Support** - Meta, Google Ads, TikTok, LinkedIn integrations ready

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Port**: http://localhost:3000

### Backend API
- **Framework**: FastAPI (Python 3.9+)
- **AI**: Claude 3.5 Sonnet via OpenRouter
- **Database**: PostgreSQL (Supabase-ready)
- **ORM**: SQLAlchemy (async)
- **Port**: http://localhost:8000

### Database
- **Type**: PostgreSQL 15+
- **Schema**: 11 tables with Row Level Security
- **Features**: Audit logs, AI insights storage, conversation history

## 📁 Project Structure

```
TraffickerHub/
├── app/                    # Next.js frontend
│   ├── dashboard/
│   └── components/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── services/      # Business logic (Copilot)
│   │   ├── models/        # Pydantic models
│   │   └── core/          # Config & database
│   └── requirements.txt
├── database/              # SQL schemas and seeds
│   ├── schema.sql
│   └── seeds/
├── components/            # React components
└── README.md
```

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL (optional, for full functionality)
- OpenRouter API key

### 1. Clone & Install

```bash
git clone https://github.com/onick/Traffick.git
cd Traffick

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
OPENROUTER_API_KEY=your-key-here
DATABASE_URL=postgresql://user:pass@localhost:5432/traffickerhub
```

### 3. Run the Application

**Terminal 1 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate
python3 -m uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

### 4. Access the Platform

- **Dashboard**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health

## 🤖 AI Copilot Usage

### Chat with the Copilot

```bash
curl -X POST http://localhost:8000/api/copilot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cómo están funcionando mis campañas?"}'
```

### Analyze a Campaign

```bash
curl -X POST http://localhost:8000/api/copilot/analyze-campaign \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": "campaign-uuid",
    "question": "¿Por qué subió el CPL?",
    "days": 7
  }'
```

## 📊 Database Setup

### Using Supabase (Recommended)

1. Create a Supabase project at https://supabase.com
2. Run the schema:
```bash
psql $DATABASE_URL -f database/schema.sql
```
3. Seed with sample data:
```bash
psql $DATABASE_URL -f database/seeds/01_seed_data.sql
```

### Local PostgreSQL

```bash
createdb traffickerhub_dev
psql traffickerhub_dev -f database/schema.sql
psql traffickerhub_dev -f database/seeds/01_seed_data.sql
```

## 🎯 Key Capabilities

### Campaign Copilot Can:

- ✅ Answer questions about campaign performance in Spanish
- ✅ Analyze metrics and detect anomalies (high CPL, low leads, etc.)
- ✅ Correlate campaign changes with performance shifts
- ✅ Generate daily performance summaries
- ✅ Provide actionable recommendations
- ✅ Suggest budget adjustments and optimizations

### Example Conversation:

**User**: "¿Qué está pasando con mi campaña de Meta?"

**Copilot**: "Tu campaña de Meta tuvo un buen rendimiento esta semana con $697 invertidos y 69 leads (CPL de $10.10). Sin embargo, después del aumento de presupuesto del 1 de noviembre, el CPL subió un 37%. Esto puede deberse a saturación de audiencia (frecuencia en 4.3). Recomiendo: 1) Testear nuevos creativos, 2) Expandir audiencia, 3) Reducir presupuesto 10-15%."

## 🔐 Security

- ✅ API keys stored in `.env` (never committed)
- ✅ Row Level Security (RLS) on database
- ✅ CORS configured
- ✅ Pydantic validation on all endpoints
- ✅ `.gitignore` properly configured

## 📚 Documentation

- **Database Schema**: [database/README.md](database/README.md)
- **Backend API**: [backend/README.md](backend/README.md)
- **API Documentation**: http://localhost:8000/docs (when running)
- **Roadmap**: [ROADMAP.md](ROADMAP.md)

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

**Backend:**
- FastAPI
- SQLAlchemy
- Pydantic
- httpx

**AI:**
- Claude 3.5 Sonnet (via OpenRouter)
- Conversation memory
- Context-aware responses

**Database:**
- PostgreSQL 15+
- Supabase (optional)
- Row Level Security

## 🚀 Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Railway/Render)
```bash
# See backend/README.md for deployment instructions
```

### Database (Supabase)
Already cloud-hosted and managed!

## 📈 What's Next?

See [ROADMAP.md](ROADMAP.md) for upcoming features and improvements.

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please read CONTRIBUTING.md first.

## 💬 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ using Claude 3.5 Sonnet**

🔗 **Repository**: https://github.com/onick/Traffick
