# TraffickerHub Database Documentation

## Overview

TraffickerHub uses PostgreSQL as its primary database, designed for a multi-tenant SaaS platform managing paid media campaigns with an AI-powered copilot assistant.

## Architecture

- **Database**: PostgreSQL 15+
- **ORM Compatible**: Supabase, Prisma, SQLAlchemy
- **Auth**: Supabase Auth (handled via auth.users table)
- **Security**: Row Level Security (RLS) enabled on all tables

## Core Entities

### 1. Users & Authentication

**`user_profiles`**
- Extends Supabase auth.users with additional profile data
- Roles: admin, trafficker, client, viewer
- Links to company/organization

### 2. Brands (Clients)

**`brands`**
- Represents clients or customer accounts
- Each brand has multiple campaigns
- Tracks ownership and status
- Supports multi-tenant access control

### 3. Campaigns

**`campaigns`**
- Core entity for advertising campaigns
- Links to brands and platforms (Meta, Google, TikTok, LinkedIn)
- Tracks objectives, budget, dates, and status
- External IDs for platform integrations

### 4. Creatives

**`creatives`**
- Ad creatives linked to campaigns
- Types: image, video, carousel, text, story
- Stores copy, headlines, CTAs, and asset URLs
- Status tracking for A/B testing

### 5. Metrics (Daily Performance)

**`metrics`**
- Daily aggregated performance data per campaign
- Comprehensive KPIs:
  - Spend, impressions, reach, frequency
  - Clicks, CTR, CPC
  - Leads, conversions, CPL, CPA
  - Revenue, ROAS
  - Engagement (likes, shares, comments, saves)
  - Video metrics (views, watch time)
- Unique constraint on (campaign_id, date)

### 6. Campaign Changes (Audit Log)

**`campaign_changes`**
- Tracks all modifications to campaigns
- Change types: budget_update, status_change, creative_update, targeting_update, bid_update
- Stores old_value and new_value as JSONB for flexibility
- Critical for AI Copilot to correlate changes with performance

### 7. AI Copilot Tables

**`recommendations`**
- AI-generated insights and suggestions
- Types: daily_summary, alert, optimization_tip, budget_recommendation, performance_warning, opportunity, anomaly_detection
- Severity levels: info, warning, critical
- Includes action_items as JSONB array
- Status tracking: active, dismissed, applied, expired

**`copilot_conversations`**
- Chat sessions between users and AI copilot
- Links to brand/campaign context
- Tracks conversation history

**`copilot_messages`**
- Individual messages in conversations
- Role: user, assistant, system
- Stores context snapshot for reproducibility
- Tracks token usage and model info

### 8. Project Management

**`tasks`**
- Campaign-related tasks and todos
- Priority levels: low, medium, high, urgent
- Status: pending, in_progress, completed, cancelled
- Assignment tracking and due dates

**`reports`**
- Generated performance reports
- Types: weekly, monthly, quarterly, custom, campaign_review
- Stores report data as JSONB
- Optional file export (PDF/Excel)

## Key Features

### 1. Audit Trail

All campaign modifications are logged in `campaign_changes`:
- Budget adjustments
- Status changes
- Creative updates
- Targeting modifications
- Bid strategy changes

This enables the AI Copilot to provide context-aware insights like:

> "Your CPL increased 37% after the budget increase on Nov 1st. This may be due to audience saturation."

### 2. Performance Views

**`campaign_performance_summary`**
- Aggregated campaign metrics with calculated KPIs
- Real-time performance snapshot
- Pre-calculated CTR, CPC, CPL, ROAS

**`daily_brand_performance`**
- Daily rollup by brand
- Multi-campaign aggregation
- Trend analysis ready

### 3. Row Level Security (RLS)

All tables have RLS enabled for multi-tenant security:
- Users see only their assigned brands/campaigns
- Role-based access control (admin, trafficker, client, viewer)
- Policies customizable per business requirements

### 4. Automated Timestamps

- `created_at`: Set automatically on insert
- `updated_at`: Auto-updated via triggers
- Ensures data integrity and audit capability

## Database Schema Diagram

```
┌─────────────────┐
│  user_profiles  │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
┌────────▼────────┐    │
│     brands      │    │
└────────┬────────┘    │
         │             │
         │             │
┌────────▼────────┐    ┌─────────────────┐
│   campaigns     │───▶│   creatives     │
└────────┬────────┘    └─────────────────┘
         │
         ├─────────────────┬──────────────────┬───────────────────┐
         │                 │                  │                   │
┌────────▼────────┐ ┌──────▼───────┐ ┌───────▼──────────┐ ┌─────▼──────┐
│    metrics      │ │campaign_     │ │recommendations   │ │   tasks    │
│   (daily)       │ │ changes      │ │  (AI insights)   │ │            │
└─────────────────┘ └──────────────┘ └──────────────────┘ └────────────┘

┌─────────────────┐ ┌──────────────────┐
│   copilot_      │ │  copilot_        │
│ conversations   ├─▶│   messages       │
└─────────────────┘ └──────────────────┘

┌─────────────────┐
│    reports      │
└─────────────────┘
```

## Setup Instructions

### 1. Using Supabase (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase project
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Seed data
psql $DATABASE_URL -f database/seeds/01_seed_data.sql
```

### 2. Using Local PostgreSQL

```bash
# Create database
createdb traffickerhub_dev

# Run schema
psql traffickerhub_dev -f database/schema.sql

# Seed data
psql traffickerhub_dev -f database/seeds/01_seed_data.sql
```

### 3. Using Docker

```bash
# Start PostgreSQL container
docker run -d \
  --name traffickerhub-db \
  -e POSTGRES_DB=traffickerhub \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  postgres:15

# Run migrations
docker exec -i traffickerhub-db psql -U postgres traffickerhub < database/schema.sql
docker exec -i traffickerhub-db psql -U postgres traffickerhub < database/seeds/01_seed_data.sql
```

## Sample Queries

### Get campaign performance for last 7 days

```sql
SELECT * FROM campaign_performance_summary 
WHERE campaign_id = 'c1111111-1111-1111-1111-111111111111';
```

### Get daily metrics for a campaign

```sql
SELECT date, spend, leads, cpl, roas
FROM metrics
WHERE campaign_id = 'c1111111-1111-1111-1111-111111111111'
  AND date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;
```

### Get all campaign changes in last 30 days

```sql
SELECT 
  c.name AS campaign_name,
  cc.changed_at,
  cc.change_type,
  cc.description
FROM campaign_changes cc
JOIN campaigns c ON c.id = cc.campaign_id
WHERE cc.changed_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY cc.changed_at DESC;
```

### Get active recommendations for a brand

```sql
SELECT 
  r.title,
  r.type,
  r.severity,
  r.detail,
  r.action_items,
  c.name AS campaign_name
FROM recommendations r
LEFT JOIN campaigns c ON c.id = r.campaign_id
WHERE r.brand_id = 'b1111111-1111-1111-1111-111111111111'
  AND r.status = 'active'
ORDER BY 
  CASE r.severity 
    WHEN 'critical' THEN 1 
    WHEN 'warning' THEN 2 
    WHEN 'info' THEN 3 
  END,
  r.generated_at DESC;
```

### Calculate brand-level aggregates

```sql
SELECT 
  b.name AS brand_name,
  SUM(m.spend) AS total_spend,
  SUM(m.leads) AS total_leads,
  ROUND(SUM(m.spend) / NULLIF(SUM(m.leads), 0), 2) AS avg_cpl,
  ROUND(SUM(m.revenue) / NULLIF(SUM(m.spend), 0), 2) AS avg_roas
FROM brands b
JOIN campaigns c ON c.brand_id = b.id
JOIN metrics m ON m.campaign_id = c.id
WHERE m.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY b.id, b.name;
```

## AI Copilot Integration

The database is designed to support the Campaign Copilot AI assistant:

### 1. Context Building

When a user asks a question, the copilot queries:
- Campaign details from `campaigns`
- Recent metrics from `metrics`
- Recent changes from `campaign_changes`
- Active recommendations from `recommendations`

### 2. Correlation Analysis

The AI can correlate events:

```
"On Nov 1, you increased the budget by 50%. 
After this change, CPL went up 37% but total leads increased by 55%."
```

### 3. Automated Insights

The backend service can:
- Generate daily summaries
- Detect anomalies (sudden CPL spikes, zero leads, etc.)
- Suggest optimizations based on historical patterns
- Alert on critical issues

### 4. Conversation Persistence

All chat interactions are stored for:
- Learning from user preferences
- Building better context over time
- Audit trail of AI recommendations

## Data Model Best Practices

### 1. Time-Series Optimization

Metrics are partitioned by date for efficient queries:
- Indexes on (campaign_id, date)
- Consider partitioning by month for large datasets
- Archive old data after 12-24 months

### 2. JSONB Fields

Used for flexibility without schema changes:
- `campaign_changes.old_value` / `new_value`
- `recommendations.action_items`
- `reports.data`

### 3. Soft Deletes

Consider adding `deleted_at` columns instead of hard deletes:
- Preserves historical data
- Enables recovery
- Maintains referential integrity

## Scaling Considerations

### For Production:

1. **Indexes**: Already included for common queries
2. **Partitioning**: Consider table partitioning for metrics by month
3. **Caching**: Use Redis for campaign performance summaries
4. **Read Replicas**: Use for reporting and AI queries
5. **Archival**: Move old metrics to cold storage after 12+ months
6. **Monitoring**: Track slow queries and optimize indexes

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Foreign key constraints for data integrity
- ✅ Enum constraints for status fields
- ✅ Unique constraints on critical fields
- ⚠️ Customize RLS policies per your access control needs
- ⚠️ Add encryption at rest for sensitive data
- ⚠️ Regular backups (Supabase handles this automatically)

## Migration Strategy

### For Existing Projects:

1. Create new schema in separate namespace
2. Migrate data incrementally by brand
3. Run dual writes during transition
4. Validate data consistency
5. Cutover with rollback plan

## API Integration Points

### Platform Connectors Needed:

- **Meta Ads API**: Pull daily metrics, campaigns, ad sets, ads
- **Google Ads API**: Campaign performance, keywords, ads
- **TikTok Ads API**: Campaign metrics and creatives
- **LinkedIn Ads API**: B2B campaign performance

### Data Sync Strategy:

1. **Initial sync**: Pull 90 days historical data
2. **Daily sync**: Automated at 6 AM
3. **Real-time updates**: Webhook for critical events
4. **Change detection**: Track external changes vs manual changes

## Next Steps

1. ✅ Schema designed
2. ✅ Seed data created
3. 🔄 Deploy to Supabase
4. ⏳ Build FastAPI backend
5. ⏳ Implement AI Copilot service
6. ⏳ Connect frontend dashboard
7. ⏳ Add platform integrations

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-07  
**Database**: PostgreSQL 15+  
**Compatible with**: Supabase, Prisma, SQLAlchemy
