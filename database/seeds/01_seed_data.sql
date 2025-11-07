-- TraffickerHub Seed Data
-- Realistic mock data for development and testing

-- =====================================================
-- CLEAN UP (for re-running seeds)
-- =====================================================

TRUNCATE TABLE 
  copilot_messages,
  copilot_conversations,
  recommendations,
  campaign_changes,
  metrics,
  creatives,
  tasks,
  reports,
  campaigns,
  brands,
  user_profiles
CASCADE;

-- =====================================================
-- USER PROFILES
-- =====================================================
-- Note: In production, these would come from auth.users via Supabase Auth
-- For testing, we'll use dummy UUIDs

INSERT INTO user_profiles (id, full_name, role, company) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Marcelino Martinez', 'admin', 'TraffickerHub'),
  ('22222222-2222-2222-2222-222222222222', 'Ana Rodriguez', 'trafficker', 'TraffickerHub'),
  ('33333333-3333-3333-3333-333333333333', 'Carlos Fernandez', 'client', 'Nodo Hotel'),
  ('44444444-4444-4444-4444-444444444444', 'Laura Gomez', 'trafficker', 'TraffickerHub'),
  ('55555555-5555-5555-5555-555555555555', 'Pedro Santos', 'client', 'TechStart Inc');

-- =====================================================
-- BRANDS
-- =====================================================

INSERT INTO brands (id, name, slug, industry, website, status, owner_id, created_by) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Nodo', 'nodo', 'Hospitality', 'https://nodo.com', 'active', 
   '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('b2222222-2222-2222-2222-222222222222', 'TechStart', 'techstart', 'SaaS', 'https://techstart.io', 'active',
   '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111'),
  ('b3333333-3333-3333-3333-333333333333', 'EcoShop', 'ecoshop', 'E-commerce', 'https://ecoshop.com', 'active',
   '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111');

-- =====================================================
-- CAMPAIGNS
-- =====================================================

INSERT INTO campaigns (id, brand_id, name, platform, objective, status, daily_budget, total_budget, start_date, end_date, created_by) VALUES
  -- Nodo Campaigns
  ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Black Friday - Meta Awareness', 'meta', 'awareness', 'active', 150.00, 4500.00, '2025-10-15', '2025-11-30', '22222222-2222-2222-2222-222222222222'),
  ('c1111111-1111-1111-1111-111111111112', 'b1111111-1111-1111-1111-111111111111', 'Meta Retargeting - Bookings', 'meta', 'conversions', 'active', 80.00, 2400.00, '2025-10-15', '2025-11-30', '22222222-2222-2222-2222-222222222222'),
  ('c1111111-1111-1111-1111-111111111113', 'b1111111-1111-1111-1111-111111111111', 'Google Search - Brand', 'google', 'leads', 'active', 120.00, 3600.00, '2025-10-01', '2025-12-31', '22222222-2222-2222-2222-222222222222'),
  ('c1111111-1111-1111-1111-111111111114', 'b1111111-1111-1111-1111-111111111111', 'TikTok - UGC Campaign', 'tiktok', 'traffic', 'active', 100.00, 3000.00, '2025-10-20', '2025-11-30', '22222222-2222-2222-2222-222222222222'),
  ('c1111111-1111-1111-1111-111111111115', 'b1111111-1111-1111-1111-111111111111', 'Google Display - Cold Traffic', 'google', 'awareness', 'paused', 60.00, 1800.00, '2025-10-01', '2025-11-30', '22222222-2222-2222-2222-222222222222'),
  
  -- TechStart Campaigns
  ('c2222222-2222-2222-2222-222222222221', 'b2222222-2222-2222-2222-222222222222', 'LinkedIn - B2B Lead Gen', 'linkedin', 'leads', 'active', 200.00, 6000.00, '2025-10-01', '2025-12-31', '44444444-4444-4444-4444-444444444444'),
  ('c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'Google Ads - SaaS Demo', 'google', 'conversions', 'active', 180.00, 5400.00, '2025-10-10', '2025-12-31', '44444444-4444-4444-4444-444444444444'),
  
  -- EcoShop Campaigns
  ('c3333333-3333-3333-3333-333333333331', 'b3333333-3333-3333-3333-333333333333', 'Meta - Product Launch', 'meta', 'sales', 'active', 250.00, 7500.00, '2025-10-01', '2025-11-30', '22222222-2222-2222-2222-222222222222'),
  ('c3333333-3333-3333-3333-333333333332', 'b3333333-3333-3333-3333-333333333333', 'Google Shopping', 'google', 'sales', 'active', 300.00, 9000.00, '2025-10-01', '2025-12-31', '22222222-2222-2222-2222-222222222222');

-- =====================================================
-- CREATIVES
-- =====================================================

INSERT INTO creatives (id, campaign_id, name, type, status, headline, primary_text, call_to_action, created_by) VALUES
  -- Black Friday Meta Campaign
  ('cr111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'BF Hero Image V1', 'image', 'active', 
   '50% OFF Black Friday', 'Limited time offer: Book your stay and save big this Black Friday weekend', 'Book Now', 
   '22222222-2222-2222-2222-222222222222'),
  ('cr111111-1111-1111-1111-111111111112', 'c1111111-1111-1111-1111-111111111111', 'BF Video Testimonial', 'video', 'active',
   'Guest Experience at Nodo', 'See why our guests love staying at Nodo. Black Friday special rates available!', 'Learn More',
   '22222222-2222-2222-2222-222222222222'),
  
  -- Meta Retargeting
  ('cr111111-1111-1111-1111-111111111113', 'c1111111-1111-1111-1111-111111111112', 'Retargeting Carousel', 'carousel', 'active',
   'Complete Your Booking', 'You were checking out Nodo. Complete your reservation now and get 10% off!', 'Complete Booking',
   '22222222-2222-2222-2222-222222222222'),
  
  -- TikTok UGC
  ('cr111111-1111-1111-1111-111111111114', 'c1111111-1111-1111-1111-111111111114', 'UGC Creator Video 1', 'video', 'active',
   'Hidden Gem in the City', 'Check out this amazing boutique hotel experience! 🏨✨', 'Book Now',
   '22222222-2222-2222-2222-222222222222'),
  ('cr111111-1111-1111-1111-111111111115', 'c1111111-1111-1111-1111-111111111114', 'UGC Creator Video 2', 'video', 'paused',
   'Weekend Vibes at Nodo', 'Perfect weekend getaway destination 🌟', 'Learn More',
   '22222222-2222-2222-2222-222222222222'),
  
  -- TechStart LinkedIn
  ('cr222222-2222-2222-2222-222222222221', 'c2222222-2222-2222-2222-222222222221', 'B2B Case Study', 'image', 'active',
   'Increase Sales by 300%', 'See how TechStart helped companies like yours scale their revenue', 'Get Demo',
   '44444444-4444-4444-4444-444444444444'),
  
  -- EcoShop Product Launch
  ('cr333333-3333-3333-3333-333333333331', 'c3333333-3333-3333-3333-333333333331', 'Product Hero Shot', 'image', 'active',
   'New Sustainable Collection', 'Shop our latest eco-friendly products. Good for you, good for the planet 🌍', 'Shop Now',
   '22222222-2222-2222-2222-222222222222');

-- =====================================================
-- METRICS (Daily data for last 14 days)
-- =====================================================
-- Generating realistic daily metrics for the last 14 days
-- Campaign: Black Friday - Meta Awareness (c1111111-1111-1111-1111-111111111111)

INSERT INTO metrics (campaign_id, date, spend, impressions, reach, frequency, clicks, link_clicks, ctr, cpc, leads, conversions, revenue, cpl, roas, likes, shares, comments) VALUES
  -- Week 1: Lower performance
  ('c1111111-1111-1111-1111-111111111111', '2025-10-24', 145.00, 45000, 32000, 1.41, 850, 720, 1.89, 0.17, 11, 3, 450.00, 13.18, 3.10, 120, 15, 8),
  ('c1111111-1111-1111-1111-111111111111', '2025-10-25', 138.00, 43500, 31000, 1.40, 800, 680, 1.84, 0.17, 10, 2, 380.00, 13.80, 2.75, 110, 12, 6),
  ('c1111111-1111-1111-1111-111111111111', '2025-10-26', 142.00, 44000, 30500, 1.44, 820, 695, 1.86, 0.17, 9, 2, 340.00, 15.78, 2.39, 115, 14, 7),
  ('c1111111-1111-1111-1111-111111111111', '2025-10-27', 148.00, 46000, 33000, 1.39, 880, 745, 1.91, 0.17, 12, 3, 520.00, 12.33, 3.51, 125, 16, 9),
  
  -- Week 2: Budget increased on Nov 1, performance improved
  ('c1111111-1111-1111-1111-111111111111', '2025-10-28', 150.00, 47000, 34000, 1.38, 920, 780, 1.96, 0.16, 13, 4, 580.00, 11.54, 3.87, 135, 18, 10),
  ('c1111111-1111-1111-1111-111111111111', '2025-10-29', 152.00, 48500, 35000, 1.39, 950, 805, 1.96, 0.16, 14, 4, 640.00, 10.86, 4.21, 140, 20, 11),
  ('c1111111-1111-1111-1111-111111111111', '2025-10-30', 155.00, 50000, 36000, 1.39, 1000, 850, 2.00, 0.16, 15, 5, 720.00, 10.33, 4.65, 150, 22, 13),
  ('c1111111-1111-1111-1111-111111111111', '2025-10-31', 158.00, 51000, 37000, 1.38, 1020, 865, 2.00, 0.15, 16, 5, 780.00, 9.88, 4.94, 155, 24, 14),
  ('c1111111-1111-1111-1111-111111111111', '2025-11-01', 220.00, 68000, 48000, 1.42, 1380, 1170, 2.03, 0.16, 20, 7, 1050.00, 11.00, 4.77, 210, 32, 18),
  ('c1111111-1111-1111-1111-111111111111', '2025-11-02', 225.00, 70000, 49000, 1.43, 1420, 1205, 2.03, 0.16, 21, 7, 1120.00, 10.71, 4.98, 220, 34, 19),
  ('c1111111-1111-1111-1111-111111111111', '2025-11-03', 228.00, 72000, 50000, 1.44, 1450, 1230, 2.01, 0.16, 19, 6, 980.00, 12.00, 4.30, 215, 33, 18),
  ('c1111111-1111-1111-1111-111111111111', '2025-11-04', 230.00, 73000, 51000, 1.43, 1480, 1255, 2.03, 0.16, 22, 8, 1240.00, 10.45, 5.39, 225, 35, 20),
  ('c1111111-1111-1111-1111-111111111111', '2025-11-05', 232.00, 74000, 52000, 1.42, 1500, 1275, 2.03, 0.15, 23, 8, 1320.00, 10.09, 5.69, 230, 37, 21),
  ('c1111111-1111-1111-1111-111111111111', '2025-11-06', 235.00, 75000, 53000, 1.42, 1520, 1290, 2.03, 0.15, 24, 9, 1400.00, 9.79, 5.96, 235, 38, 22);

-- Campaign: Meta Retargeting (c1111111-1111-1111-1111-111111111112)
-- Better CPL, lower volume
INSERT INTO metrics (campaign_id, date, spend, impressions, reach, frequency, clicks, link_clicks, ctr, cpc, leads, conversions, revenue, cpl, roas) VALUES
  ('c1111111-1111-1111-1111-111111111112', '2025-10-24', 78.00, 12000, 8500, 1.41, 580, 520, 4.83, 0.13, 9, 7, 980.00, 8.67, 12.56),
  ('c1111111-1111-1111-1111-111111111112', '2025-10-25', 75.00, 11500, 8200, 1.40, 560, 500, 4.87, 0.13, 8, 6, 840.00, 9.38, 11.20),
  ('c1111111-1111-1111-1111-111111111112', '2025-10-26', 76.00, 11800, 8400, 1.40, 570, 510, 4.83, 0.13, 8, 6, 900.00, 9.50, 11.84),
  ('c1111111-1111-1111-1111-111111111112', '2025-10-27', 79.00, 12200, 8700, 1.40, 590, 530, 4.84, 0.13, 9, 7, 1020.00, 8.78, 12.91),
  ('c1111111-1111-1111-1111-111111111112', '2025-10-28', 80.00, 12500, 8900, 1.40, 605, 545, 4.84, 0.13, 10, 8, 1140.00, 8.00, 14.25),
  ('c1111111-1111-1111-1111-111111111112', '2025-10-29', 82.00, 12800, 9100, 1.41, 620, 558, 4.84, 0.13, 10, 8, 1200.00, 8.20, 14.63),
  ('c1111111-1111-1111-1111-111111111112', '2025-10-30', 83.00, 13000, 9300, 1.40, 630, 567, 4.85, 0.13, 11, 9, 1300.00, 7.55, 15.66),
  ('c1111111-1111-1111-1111-111111111112', '2025-10-31', 85.00, 13200, 9400, 1.40, 640, 576, 4.85, 0.13, 11, 9, 1340.00, 7.73, 15.76),
  ('c1111111-1111-1111-1111-111111111112', '2025-11-01', 85.00, 13500, 9600, 1.41, 655, 589, 4.85, 0.13, 12, 10, 1460.00, 7.08, 17.18),
  ('c1111111-1111-1111-1111-111111111112', '2025-11-02', 87.00, 13800, 9800, 1.41, 670, 603, 4.86, 0.13, 12, 10, 1520.00, 7.25, 17.47),
  ('c1111111-1111-1111-1111-111111111112', '2025-11-03', 88.00, 14000, 10000, 1.40, 680, 612, 4.86, 0.13, 13, 11, 1640.00, 6.77, 18.64),
  ('c1111111-1111-1111-1111-111111111112', '2025-11-04', 89.00, 14200, 10100, 1.41, 690, 621, 4.86, 0.13, 13, 11, 1700.00, 6.85, 19.10),
  ('c1111111-1111-1111-1111-111111111112', '2025-11-05', 90.00, 14500, 10300, 1.41, 705, 634, 4.86, 0.13, 14, 12, 1820.00, 6.43, 20.22),
  ('c1111111-1111-1111-1111-111111111112', '2025-11-06', 91.00, 14700, 10500, 1.40, 715, 643, 4.86, 0.13, 14, 12, 1880.00, 6.50, 20.66);

-- Campaign: Google Search - Brand (c1111111-1111-1111-1111-111111111113)
-- High intent, great CPL
INSERT INTO metrics (campaign_id, date, spend, impressions, reach, frequency, clicks, link_clicks, ctr, cpc, leads, conversions, revenue, cpl, roas) VALUES
  ('c1111111-1111-1111-1111-111111111113', '2025-10-24', 115.00, 25000, 25000, 1.00, 920, 920, 3.68, 0.13, 18, 12, 1680.00, 6.39, 14.61),
  ('c1111111-1111-1111-1111-111111111113', '2025-10-25', 118.00, 26000, 26000, 1.00, 950, 950, 3.65, 0.12, 19, 13, 1820.00, 6.21, 15.42),
  ('c1111111-1111-1111-1111-111111111113', '2025-10-26', 120.00, 27000, 27000, 1.00, 980, 980, 3.63, 0.12, 20, 14, 1960.00, 6.00, 16.33),
  ('c1111111-1111-1111-1111-111111111113', '2025-10-27', 122.00, 27500, 27500, 1.00, 1000, 1000, 3.64, 0.12, 20, 14, 2020.00, 6.10, 16.56),
  ('c1111111-1111-1111-1111-111111111113', '2025-10-28', 125.00, 28000, 28000, 1.00, 1020, 1020, 3.64, 0.12, 21, 15, 2160.00, 5.95, 17.28),
  ('c1111111-1111-1111-1111-111111111113', '2025-10-29', 127.00, 28500, 28500, 1.00, 1040, 1040, 3.65, 0.12, 22, 15, 2250.00, 5.77, 17.72),
  ('c1111111-1111-1111-1111-111111111113', '2025-10-30', 130.00, 29000, 29000, 1.00, 1060, 1060, 3.66, 0.12, 22, 16, 2320.00, 5.91, 17.85),
  ('c1111111-1111-1111-1111-111111111113', '2025-10-31', 132.00, 29500, 29500, 1.00, 1080, 1080, 3.66, 0.12, 23, 16, 2400.00, 5.74, 18.18),
  ('c1111111-1111-1111-1111-111111111113', '2025-11-01', 135.00, 30000, 30000, 1.00, 1100, 1100, 3.67, 0.12, 24, 17, 2520.00, 5.63, 18.67),
  ('c1111111-1111-1111-1111-111111111113', '2025-11-02', 138.00, 30500, 30500, 1.00, 1120, 1120, 3.67, 0.12, 24, 17, 2580.00, 5.75, 18.70),
  ('c1111111-1111-1111-1111-111111111113', '2025-11-03', 140.00, 31000, 31000, 1.00, 1140, 1140, 3.68, 0.12, 25, 18, 2700.00, 5.60, 19.29),
  ('c1111111-1111-1111-1111-111111111113', '2025-11-04', 142.00, 31500, 31500, 1.00, 1160, 1160, 3.68, 0.12, 26, 18, 2790.00, 5.46, 19.65),
  ('c1111111-1111-1111-1111-111111111113', '2025-11-05', 145.00, 32000, 32000, 1.00, 1180, 1180, 3.69, 0.12, 26, 19, 2860.00, 5.58, 19.72),
  ('c1111111-1111-1111-1111-111111111113', '2025-11-06', 148.00, 32500, 32500, 1.00, 1200, 1200, 3.69, 0.12, 27, 19, 2940.00, 5.48, 19.86);

-- Campaign: TikTok - UGC Campaign (c1111111-1111-1111-1111-111111111114)
-- High engagement, moderate CPL
INSERT INTO metrics (campaign_id, date, spend, impressions, reach, frequency, clicks, link_clicks, ctr, cpc, leads, conversions, revenue, cpl, roas, video_views, likes, shares, comments) VALUES
  ('c1111111-1111-1111-1111-111111111114', '2025-10-24', 95.00, 38000, 28000, 1.36, 1140, 950, 3.00, 0.08, 14, 8, 960.00, 6.79, 10.11, 18500, 2400, 320, 180),
  ('c1111111-1111-1111-1111-111111111114', '2025-10-25', 98.00, 39000, 29000, 1.34, 1170, 975, 3.00, 0.08, 14, 8, 1020.00, 7.00, 10.41, 19000, 2500, 330, 190),
  ('c1111111-1111-1111-1111-111111111114', '2025-10-26', 100.00, 40000, 30000, 1.33, 1200, 1000, 3.00, 0.08, 15, 9, 1080.00, 6.67, 10.80, 19500, 2600, 340, 195),
  ('c1111111-1111-1111-1111-111111111114', '2025-10-27', 102.00, 41000, 31000, 1.32, 1230, 1025, 3.00, 0.08, 15, 9, 1140.00, 6.80, 11.18, 20000, 2700, 350, 200),
  ('c1111111-1111-1111-1111-111111111114', '2025-10-28', 105.00, 42000, 32000, 1.31, 1260, 1050, 3.00, 0.08, 16, 10, 1200.00, 6.56, 11.43, 20500, 2800, 360, 210),
  ('c1111111-1111-1111-1111-111111111114', '2025-10-29', 108.00, 43000, 33000, 1.30, 1290, 1075, 3.00, 0.08, 17, 10, 1280.00, 6.35, 11.85, 21000, 2900, 370, 215),
  ('c1111111-1111-1111-1111-111111111114', '2025-10-30', 110.00, 44000, 34000, 1.29, 1320, 1100, 3.00, 0.08, 17, 11, 1360.00, 6.47, 12.36, 21500, 3000, 380, 220),
  ('c1111111-1111-1111-1111-111111111114', '2025-10-31', 112.00, 45000, 35000, 1.29, 1350, 1125, 3.00, 0.08, 18, 11, 1420.00, 6.22, 12.68, 22000, 3100, 390, 225),
  ('c1111111-1111-1111-1111-111111111114', '2025-11-01', 115.00, 46000, 36000, 1.28, 1380, 1150, 3.00, 0.08, 18, 12, 1500.00, 6.39, 13.04, 22500, 3200, 400, 230),
  ('c1111111-1111-1111-1111-111111111114', '2025-11-02', 118.00, 47000, 37000, 1.27, 1410, 1175, 3.00, 0.08, 19, 12, 1580.00, 6.21, 13.39, 23000, 3300, 410, 235),
  ('c1111111-1111-1111-1111-111111111114', '2025-11-03', 120.00, 48000, 38000, 1.26, 1440, 1200, 3.00, 0.08, 19, 13, 1660.00, 6.32, 13.83, 23500, 3400, 420, 240),
  ('c1111111-1111-1111-1111-111111111114', '2025-11-04', 122.00, 49000, 39000, 1.26, 1470, 1225, 3.00, 0.08, 20, 13, 1740.00, 6.10, 14.26, 24000, 3500, 430, 245),
  ('c1111111-1111-1111-1111-111111111114', '2025-11-05', 125.00, 50000, 40000, 1.25, 1500, 1250, 3.00, 0.08, 20, 14, 1820.00, 6.25, 14.56, 24500, 3600, 440, 250),
  ('c1111111-1111-1111-1111-111111111114', '2025-11-06', 128.00, 51000, 41000, 1.24, 1530, 1275, 3.00, 0.08, 21, 14, 1900.00, 6.10, 14.84, 25000, 3700, 450, 255);

-- =====================================================
-- CAMPAIGN CHANGES (Audit Log)
-- =====================================================

INSERT INTO campaign_changes (campaign_id, changed_at, changed_by, change_type, old_value, new_value, description) VALUES
  -- Black Friday campaign budget increase
  ('c1111111-1111-1111-1111-111111111111', '2025-11-01 09:00:00', '22222222-2222-2222-2222-222222222222', 'budget_update',
   '{"daily_budget": 150.00}'::jsonb,
   '{"daily_budget": 225.00}'::jsonb,
   'Increased daily budget by 50% for Black Friday push'),
  
  -- Paused Google Display campaign due to high CPL
  ('c1111111-1111-1111-1111-111111111115', '2025-11-01 14:30:00', '22222222-2222-2222-2222-222222222222', 'status_change',
   '{"status": "active"}'::jsonb,
   '{"status": "paused"}'::jsonb,
   'Paused campaign due to CPL exceeding $18. Will review targeting and creative.'),
  
  -- TikTok creative swap
  ('c1111111-1111-1111-1111-111111111114', '2025-10-26 11:00:00', '22222222-2222-2222-2222-222222222222', 'creative_update',
   '{"active_creative": "cr111111-1111-1111-1111-111111111115"}'::jsonb,
   '{"active_creative": "cr111111-1111-1111-1111-111111111114"}'::jsonb,
   'Paused UGC Video 2, focusing budget on UGC Video 1 which has better engagement'),
  
  -- Google Search bid adjustment
  ('c1111111-1111-1111-1111-111111111113', '2025-10-29 16:00:00', '22222222-2222-2222-2222-222222222222', 'bid_update',
   '{"target_cpa": 8.00}'::jsonb,
   '{"target_cpa": 6.50}'::jsonb,
   'Lowered target CPA based on strong conversion performance'),
  
  -- Meta retargeting audience expansion
  ('c1111111-1111-1111-1111-111111111112', '2025-10-28 10:00:00', '22222222-2222-2222-2222-222222222222', 'targeting_update',
   '{"retargeting_window": "14 days"}'::jsonb,
   '{"retargeting_window": "30 days"}'::jsonb,
   'Extended retargeting window to capture more potential bookers');

-- =====================================================
-- RECOMMENDATIONS (AI Generated Insights)
-- =====================================================

INSERT INTO recommendations (brand_id, campaign_id, generated_at, type, severity, title, detail, action_items, status) VALUES
  -- Critical alert: High frequency
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '2025-11-06 08:00:00', 'alert', 'warning',
   'Increasing frequency may indicate ad fatigue',
   'The Black Friday Meta Awareness campaign has reached an average frequency of 4.3 over the last 3 days. This suggests the audience is seeing the ads multiple times, which could lead to declining performance if not addressed.',
   '[
     {"action": "Test new creative variations", "priority": "high"},
     {"action": "Consider expanding the target audience", "priority": "medium"},
     {"action": "Reduce daily budget by 10-15% to control frequency", "priority": "medium"}
   ]'::jsonb,
   'active'),
  
  -- Opportunity: Meta Retargeting performing well
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111112', '2025-11-06 08:00:00', 'opportunity', 'info',
   'Meta Retargeting campaign shows strong ROAS potential',
   'The Meta Retargeting campaign has consistently delivered ROAS above 17x in the last 7 days, with CPL 25% lower than the brand average. Consider increasing budget allocation.',
   '[
     {"action": "Increase daily budget from $90 to $120", "priority": "high"},
     {"action": "Expand retargeting pool to include 60-day window", "priority": "medium"}
   ]'::jsonb,
   'active'),
  
  -- Optimization tip: Google Search
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111113', '2025-11-05 12:00:00', 'optimization_tip', 'info',
   'Google Search campaign delivering consistent results',
   'Google Search - Brand campaign maintains stable CPL around $5.60 with strong ROAS of 19x. Performance is steady and scalable.',
   '[
     {"action": "Test increasing daily budget by 20%", "priority": "medium"},
     {"action": "Add more brand-related keywords", "priority": "low"}
   ]'::jsonb,
   'active'),
  
  -- Daily summary for brand
  ('b1111111-1111-1111-1111-111111111111', NULL, '2025-11-06 07:00:00', 'daily_summary', 'info',
   'Daily Performance Summary for Nodo',
   'Yesterday (Nov 5), Nodo campaigns spent $665 and generated 83 leads with an average CPL of $8.01. This represents a 12% improvement in CPL compared to the previous 7-day average. The Meta Retargeting campaign continues to be the top performer with 20x ROAS.',
   '[
     {"action": "Review Meta Awareness frequency", "priority": "high"},
     {"action": "Consider scaling Meta Retargeting budget", "priority": "high"},
     {"action": "Monitor Black Friday campaign performance daily", "priority": "medium"}
   ]'::jsonb,
   'active'),
  
  -- Performance warning: Paused campaign
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111115', '2025-11-01 15:00:00', 'performance_warning', 'critical',
   'Google Display campaign paused due to high CPL',
   'The Google Display - Cold Traffic campaign was paused after CPL exceeded $18.75, which is 2.3x higher than the brand average. This campaign requires targeting and creative review before reactivating.',
   '[
     {"action": "Review and refine audience targeting", "priority": "high"},
     {"action": "Test new creative variations", "priority": "high"},
     {"action": "Consider lowering daily budget to $40 on relaunch", "priority": "medium"}
   ]'::jsonb,
   'active');

-- =====================================================
-- TASKS
-- =====================================================

INSERT INTO tasks (brand_id, campaign_id, title, description, status, priority, assigned_to, created_by, due_date) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 
   'Launch Black Friday campaign', 
   'Final review and launch of Black Friday awareness campaign', 
   'completed', 'urgent', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '2025-10-15'),
  
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111114',
   'Review TikTok CPL after 3 days',
   'Monitor TikTok campaign performance and adjust if CPL exceeds $7',
   'in_progress', 'medium', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '2025-11-08'),
  
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111112',
   'Upload new creatives for Meta remarketing',
   'Create and upload 3 new carousel ads for retargeting campaign',
   'completed', 'high', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '2025-11-03'),
  
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111',
   'Test new creative variations for Meta',
   'Frequency is increasing. Need to test 2-3 new creative angles to combat ad fatigue',
   'pending', 'high', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '2025-11-08'),
  
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111115',
   'Revise Google Display targeting',
   'Campaign was paused due to high CPL. Review and optimize audience targeting before relaunch',
   'pending', 'medium', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '2025-11-10'),
  
  ('b1111111-1111-1111-1111-111111111111', NULL,
   'Prepare end-of-month report for Nodo',
   'Compile November performance data and insights for client presentation',
   'pending', 'medium', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2025-11-28'),
  
  ('b2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222221',
   'Optimize LinkedIn B2B campaign',
   'Review lead quality and adjust targeting if needed',
   'pending', 'low', '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '2025-11-15');

-- =====================================================
-- END OF SEED DATA
-- =====================================================
