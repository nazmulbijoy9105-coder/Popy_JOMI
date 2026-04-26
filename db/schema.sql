-- POPY Bangladesh Property Intelligence Platform
-- PostgreSQL Schema (Deploy on Render Free Tier)
-- Run: psql $DATABASE_URL < db/schema.sql

-- Enable PostGIS for geo queries
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Users & Auth
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'agent' CHECK (role IN ('agent', 'investor', 'developer', 'buyer', 'admin')),
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'agent', 'investor', 'developer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties (core table)
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price BIGINT NOT NULL,
  price_per_sqft INTEGER,
  location TEXT NOT NULL,
  area VARCHAR(100),
  district VARCHAR(100) DEFAULT 'Dhaka',
  sqft INTEGER,
  bedrooms SMALLINT DEFAULT 0,
  bathrooms SMALLINT DEFAULT 0,
  type VARCHAR(50) CHECK (type IN ('apartment', 'house', 'plot', 'commercial')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'urgent', 'sold', 'pending')),
  source VARCHAR(100),
  source_url TEXT,
  raw_html_path TEXT,
  deal_score SMALLINT DEFAULT 0,
  risk_score VARCHAR(20) DEFAULT 'medium' CHECK (risk_score IN ('low', 'medium', 'high')),
  price_change_pct DECIMAL(5,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_duplicate BOOLEAN DEFAULT false,
  legal_status VARCHAR(50) DEFAULT 'pending' CHECK (legal_status IN ('clean', 'pending', 'disputed')),
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price history for trend analysis
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  price BIGINT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  name VARCHAR(255),
  phone VARCHAR(20),
  type VARCHAR(20) CHECK (type IN ('seller', 'buyer')),
  urgency VARCHAR(20) DEFAULT 'warm' CHECK (urgency IN ('hot', 'warm', 'cold')),
  score SMALLINT DEFAULT 50,
  assigned_to UUID REFERENCES users(id),
  area VARCHAR(100),
  budget BIGINT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts & notification rules
CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('new_listing', 'price_drop', 'urgent_sale', 'lead', 'legal')),
  area VARCHAR(100),
  max_price BIGINT,
  min_price BIGINT,
  threshold_pct DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legal checks
CREATE TABLE IF NOT EXISTS legal_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES users(id),
  risk_score SMALLINT,
  risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  checks_passed TEXT[],
  checks_failed TEXT[],
  warnings TEXT[],
  report_url TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scraper jobs log
CREATE TABLE IF NOT EXISTS scraper_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed')),
  listings_found INTEGER DEFAULT 0,
  listings_new INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_scraped ON properties(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_urgency ON leads(urgency);
CREATE INDEX IF NOT EXISTS idx_price_history_prop ON price_history(property_id, recorded_at DESC);

-- Seed: create default admin user
-- INSERT INTO users (email, name, role, plan) VALUES ('admin@popy.bd', 'POPY Admin', 'admin', 'developer');

COMMENT ON TABLE properties IS 'Core property listings collected by scrapers';
COMMENT ON TABLE leads IS 'Hot leads extracted from urgent sellers';
COMMENT ON TABLE legal_checks IS 'AI-powered legal verification results';
