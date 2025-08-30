-- LinkedIn Sales Automation Database Schema
-- PostgreSQL Database Schema for LinkedIn Sales Automation Tool

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    linkedin_profile_url VARCHAR(500),
    company_name VARCHAR(255),
    industry VARCHAR(100),
    subscription_plan VARCHAR(20) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'enterprise')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    target_industries TEXT[] NOT NULL,
    target_job_roles TEXT[] NOT NULL,
    target_company_sizes TEXT[] NOT NULL,
    target_locations TEXT[] NOT NULL,
    product_service TEXT NOT NULL,
    outreach_goals TEXT[] NOT NULL,
    brand_voice VARCHAR(50) NOT NULL CHECK (brand_voice IN ('professional', 'friendly', 'consultative', 'enthusiastic')),
    optional_triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
    daily_connection_limit INTEGER DEFAULT 20,
    weekly_message_limit INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Prospects table
CREATE TABLE prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    linkedin_profile_url VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    prospect_status VARCHAR(20) DEFAULT 'pending' CHECK (prospect_status IN ('pending', 'contacted', 'responded', 'qualified', 'converted', 'rejected')),
    connection_status VARCHAR(20) DEFAULT 'not_connected' CHECK (connection_status IN ('not_connected', 'pending', 'connected', 'rejected')),
    priority_level VARCHAR(10) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
    profile_score INTEGER CHECK (profile_score >= 0 AND profile_score <= 100),
    engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_follow_up_date TIMESTAMP WITH TIME ZONE,
    total_messages_sent INTEGER DEFAULT 0,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Message templates table
CREATE TABLE message_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('connection', 'follow_up', 'thank_you', 'meeting_request')),
    content TEXT NOT NULL,
    subject_line VARCHAR(255),
    brand_voice VARCHAR(50) NOT NULL CHECK (brand_voice IN ('professional', 'friendly', 'consultative', 'enthusiastic')),
    personalization_fields TEXT[],
    ai_instructions TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
    template_id UUID REFERENCES message_templates(id),
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('connection', 'follow_up', 'thank_you', 'meeting_request', 'custom')),
    content TEXT NOT NULL,
    subject_line VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'delivered', 'opened', 'replied', 'failed')),
    scheduled_send_time TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    response_received BOOLEAN DEFAULT FALSE,
    response_content TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_confidence_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI profile analyses cache table
CREATE TABLE ai_profile_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    linkedin_url VARCHAR(500) UNIQUE NOT NULL,
    profile_data JSONB,
    analysis_result JSONB NOT NULL,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User activity logs table
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    http_method VARCHAR(10),
    endpoint VARCHAR(255),
    request_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI processing logs table
CREATE TABLE ai_processing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL,
    input_data JSONB,
    ai_response JSONB,
    processing_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaign analytics aggregated table
CREATE TABLE campaign_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    prospects_added INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    connections_made INTEGER DEFAULT 0,
    responses_received INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, date)
);

-- Indexes for performance optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_plan ON users(subscription_plan);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);

CREATE INDEX idx_prospects_campaign_id ON prospects(campaign_id);
CREATE INDEX idx_prospects_status ON prospects(prospect_status);
CREATE INDEX idx_prospects_connection_status ON prospects(connection_status);
CREATE INDEX idx_prospects_linkedin_url ON prospects(linkedin_profile_url);
CREATE INDEX idx_prospects_created_at ON prospects(created_at);
CREATE INDEX idx_prospects_last_contact ON prospects(last_contact_date);
CREATE INDEX idx_prospects_next_followup ON prospects(next_follow_up_date);

CREATE INDEX idx_message_templates_user_id ON message_templates(user_id);
CREATE INDEX idx_message_templates_type ON message_templates(template_type);

CREATE INDEX idx_messages_prospect_id ON messages(prospect_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);
CREATE INDEX idx_messages_scheduled ON messages(scheduled_send_time);
CREATE INDEX idx_messages_response ON messages(response_received);

CREATE INDEX idx_ai_analyses_linkedin_url ON ai_profile_analyses(linkedin_url);
CREATE INDEX idx_ai_analyses_created_at ON ai_profile_analyses(created_at);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_campaign_id ON analytics_events(campaign_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON user_activity_logs(created_at);

CREATE INDEX idx_ai_logs_user_id ON ai_processing_logs(user_id);
CREATE INDEX idx_ai_logs_type ON ai_processing_logs(request_type);
CREATE INDEX idx_ai_logs_created_at ON ai_processing_logs(created_at);

CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_date ON campaign_analytics(date);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_analyses_updated_at BEFORE UPDATE ON ai_profile_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion (optional)
INSERT INTO users (name, email, password_hash, subscription_plan) VALUES 
('Demo User', 'demo@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/oWo2HDvBm', 'pro'),
('Test User', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/oWo2HDvBm', 'free');

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Final success message
SELECT 'LinkedIn Sales Automation Database Schema Created Successfully!' as status;
