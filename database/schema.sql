-- TraffickerHub Database Schema
-- PostgreSQL 15+ / Supabase Compatible
-- Campaign Management & Analytics Platform with AI Copilot

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================
-- Note: Supabase handles auth.users automatically
-- This is for additional user profile data

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'trafficker', 'client', 'viewer')),
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- BRANDS (Clients/Customers)
-- =====================================================

CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  industry TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  owner_id UUID REFERENCES user_profiles(id),
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brands_status ON brands(status);
CREATE INDEX idx_brands_owner ON brands(owner_id);

-- =====================================================
-- CAMPAIGNS
-- =====================================================

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'tiktok', 'linkedin', 'twitter', 'other')),
  objective TEXT NOT NULL CHECK (objective IN ('awareness', 'traffic', 'engagement', 'leads', 'conversions', 'sales')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  
  -- Budget & Dates
  daily_budget DECIMAL(10, 2),
  total_budget DECIMAL(10, 2),
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- External IDs
  external_campaign_id TEXT, -- ID from Meta/Google/etc
  
  -- Metadata
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_brand ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_platform ON campaigns(platform);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- =====================================================
-- CREATIVES (Ads, Copy, Assets)
-- =====================================================

CREATE TABLE creatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'carousel', 'text', 'story', 'other')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  
  -- Content
  headline TEXT,
  primary_text TEXT,
  description TEXT,
  call_to_action TEXT,
  
  -- Assets
  asset_url TEXT, -- URL to image/video
  thumbnail_url TEXT,
  
  -- External
  external_creative_id TEXT,
  
  -- Metadata
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_creatives_campaign ON creatives(campaign_id);
CREATE INDEX idx_creatives_status ON creatives(status);

-- =====================================================
-- METRICS (Daily Campaign Performance)
-- =====================================================

CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Spend & Budget
  spend DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Impressions & Reach
  impressions INTEGER NOT NULL DEFAULT 0,
  reach INTEGER DEFAULT 0,
  frequency DECIMAL(4, 2) DEFAULT 0,
  
  -- Engagement
  clicks INTEGER NOT NULL DEFAULT 0,
  link_clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5, 2) DEFAULT 0, -- Click-through rate
  cpc DECIMAL(10, 2) DEFAULT 0, -- Cost per click
  
  -- Conversions
  leads INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  
  -- Revenue & ROI
  revenue DECIMAL(10, 2) DEFAULT 0,
  cpl DECIMAL(10, 2) DEFAULT 0, -- Cost per lead
  cpa DECIMAL(10, 2) DEFAULT 0, -- Cost per acquisition
  roas DECIMAL(10, 2) DEFAULT 0, -- Return on ad spend
  
  -- Engagement metrics
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  
  -- Video specific
  video_views INTEGER DEFAULT 0,
  video_watch_time INTEGER DEFAULT 0, -- seconds
  
  -- Metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(campaign_id, date)
);

CREATE INDEX idx_metrics_campaign ON metrics(campaign_id);
CREATE INDEX idx_metrics_date ON metrics(date DESC);
CREATE INDEX idx_metrics_campaign_date ON metrics(campaign_id, date DESC);

-- =====================================================
-- CAMPAIGN CHANGES (Audit Log for Copilot)
-- =====================================================

CREATE TABLE campaign_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by UUID REFERENCES user_profiles(id),
  
  change_type TEXT NOT NULL CHECK (change_type IN (
    'budget_update',
    'status_change',
    'creative_update',
    'targeting_update',
    'bid_update',
    'schedule_update',
    'other'
  )),
  
  -- Before & After values (flexible JSON)
  old_value JSONB,
  new_value JSONB,
  
  -- Human-readable description
  description TEXT NOT NULL,
  
  -- Optional: link to specific creative if change is creative-related
  creative_id UUID REFERENCES creatives(id) ON DELETE SET NULL,
  
  -- Metadata
  notes TEXT
);

CREATE INDEX idx_campaign_changes_campaign ON campaign_changes(campaign_id);
CREATE INDEX idx_campaign_changes_date ON campaign_changes(changed_at DESC);
CREATE INDEX idx_campaign_changes_type ON campaign_changes(change_type);

-- =====================================================
-- RECOMMENDATIONS (AI Copilot Insights)
-- =====================================================

CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Optional: when this recommendation becomes stale
  
  type TEXT NOT NULL CHECK (type IN (
    'daily_summary',
    'alert',
    'optimization_tip',
    'budget_recommendation',
    'creative_recommendation',
    'performance_warning',
    'opportunity',
    'anomaly_detection'
  )),
  
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  
  -- Content
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  action_items JSONB, -- Array of suggested actions
  
  -- Context used to generate this
  raw_context JSONB,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'applied', 'expired')),
  dismissed_at TIMESTAMPTZ,
  dismissed_by UUID REFERENCES user_profiles(id),
  
  -- Metadata
  created_by_system BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_recommendations_brand ON recommendations(brand_id);
CREATE INDEX idx_recommendations_campaign ON recommendations(campaign_id);
CREATE INDEX idx_recommendations_type ON recommendations(type);
CREATE INDEX idx_recommendations_status ON recommendations(status);
CREATE INDEX idx_recommendations_date ON recommendations(generated_at DESC);

-- =====================================================
-- COPILOT CONVERSATIONS (Chat History)
-- =====================================================

CREATE TABLE copilot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  
  -- Conversation metadata
  title TEXT, -- Auto-generated from first message
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived'))
);

CREATE INDEX idx_copilot_conversations_user ON copilot_conversations(user_id);
CREATE INDEX idx_copilot_conversations_brand ON copilot_conversations(brand_id);
CREATE INDEX idx_copilot_conversations_date ON copilot_conversations(last_message_at DESC);

-- =====================================================
-- COPILOT MESSAGES (Individual Chat Messages)
-- =====================================================

CREATE TABLE copilot_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES copilot_conversations(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Context snapshot at time of message (for reproducibility)
  context_snapshot JSONB,
  
  -- Tokens & Model info
  model_used TEXT, -- e.g., 'claude-3-5-sonnet-20241022'
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_copilot_messages_conversation ON copilot_messages(conversation_id);
CREATE INDEX idx_copilot_messages_date ON copilot_messages(created_at);

-- =====================================================
-- TASKS (Project Management)
-- =====================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Assignment
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES user_profiles(id),
  
  -- Dates
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_brand ON tasks(brand_id);
CREATE INDEX idx_tasks_campaign ON tasks(campaign_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- =====================================================
-- REPORTS (Scheduled/Generated Reports)
-- =====================================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly', 'quarterly', 'custom', 'campaign_review')),
  
  -- Date range
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Report data (generated JSON)
  data JSONB NOT NULL,
  
  -- File export
  file_url TEXT, -- URL to PDF/Excel export
  
  -- Metadata
  generated_by UUID REFERENCES user_profiles(id),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_brand ON reports(brand_id);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_date ON reports(generated_at DESC);

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creatives_updated_at BEFORE UPDATE ON creatives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Supabase
-- =====================================================
-- Enable RLS on all tables

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (to be customized based on business logic)
-- Example: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Example: Brands access based on ownership or team membership
CREATE POLICY "Users can view brands they own or are assigned to" ON brands
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'trafficker')
    )
  );

-- Example: Campaigns inherit access from brands
CREATE POLICY "Users can view campaigns from accessible brands" ON campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = campaigns.brand_id 
      AND (brands.owner_id = auth.uid() OR brands.created_by = auth.uid())
    )
  );

-- Similar policies should be created for other tables based on business requirements
-- For development/testing, you might want to temporarily allow all operations:
-- CREATE POLICY "Allow all for authenticated users" ON table_name FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- VIEWS (Useful aggregations)
-- =====================================================

-- Campaign performance summary
CREATE OR REPLACE VIEW campaign_performance_summary AS
SELECT 
  c.id AS campaign_id,
  c.name AS campaign_name,
  c.brand_id,
  b.name AS brand_name,
  c.platform,
  c.objective,
  c.status,
  c.start_date,
  c.end_date,
  
  -- Aggregated metrics
  COUNT(DISTINCT m.date) AS days_active,
  SUM(m.spend) AS total_spend,
  SUM(m.impressions) AS total_impressions,
  SUM(m.clicks) AS total_clicks,
  SUM(m.leads) AS total_leads,
  SUM(m.conversions) AS total_conversions,
  SUM(m.revenue) AS total_revenue,
  
  -- Calculated KPIs
  CASE WHEN SUM(m.impressions) > 0 
    THEN ROUND((SUM(m.clicks)::NUMERIC / SUM(m.impressions) * 100), 2) 
    ELSE 0 
  END AS avg_ctr,
  
  CASE WHEN SUM(m.clicks) > 0 
    THEN ROUND((SUM(m.spend) / SUM(m.clicks)), 2) 
    ELSE 0 
  END AS avg_cpc,
  
  CASE WHEN SUM(m.leads) > 0 
    THEN ROUND((SUM(m.spend) / SUM(m.leads)), 2) 
    ELSE 0 
  END AS avg_cpl,
  
  CASE WHEN SUM(m.spend) > 0 
    THEN ROUND((SUM(m.revenue) / SUM(m.spend)), 2) 
    ELSE 0 
  END AS avg_roas
  
FROM campaigns c
LEFT JOIN brands b ON b.id = c.brand_id
LEFT JOIN metrics m ON m.campaign_id = c.id
GROUP BY c.id, c.name, c.brand_id, b.name, c.platform, c.objective, c.status, c.start_date, c.end_date;

-- Daily brand performance
CREATE OR REPLACE VIEW daily_brand_performance AS
SELECT 
  b.id AS brand_id,
  b.name AS brand_name,
  m.date,
  COUNT(DISTINCT c.id) AS active_campaigns,
  SUM(m.spend) AS daily_spend,
  SUM(m.impressions) AS daily_impressions,
  SUM(m.clicks) AS daily_clicks,
  SUM(m.leads) AS daily_leads,
  SUM(m.conversions) AS daily_conversions,
  SUM(m.revenue) AS daily_revenue,
  
  CASE WHEN SUM(m.leads) > 0 
    THEN ROUND((SUM(m.spend) / SUM(m.leads)), 2) 
    ELSE 0 
  END AS daily_cpl,
  
  CASE WHEN SUM(m.spend) > 0 
    THEN ROUND((SUM(m.revenue) / SUM(m.spend)), 2) 
    ELSE 0 
  END AS daily_roas
  
FROM brands b
JOIN campaigns c ON c.brand_id = b.id
JOIN metrics m ON m.campaign_id = c.id
GROUP BY b.id, b.name, m.date;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
