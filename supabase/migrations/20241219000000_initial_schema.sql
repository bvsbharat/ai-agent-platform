-- Supabase Database Schema for AI Agent Platform
-- Run this SQL in your Supabase SQL editor to create the required tables

-- Create user_profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  config JSONB DEFAULT '{}',
  prompt TEXT,
  model TEXT DEFAULT 'gpt-4',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2000,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rules table
CREATE TABLE IF NOT EXISTS public.rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mcps table
CREATE TABLE IF NOT EXISTS public.mcps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  link TEXT,
  description TEXT,
  logo TEXT,
  company_id TEXT,
  slug TEXT,
  active BOOLEAN DEFAULT true,
  plan TEXT,
  "order" INTEGER,
  fts TEXT,
  config JSONB DEFAULT '{}',
  owner_id TEXT,
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  vendor TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS public.agent_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, agent_id)
);

-- Create rule_votes table for tracking user votes
CREATE TABLE IF NOT EXISTS public.rule_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES public.rules(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, rule_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_category ON public.agents(category);
CREATE INDEX IF NOT EXISTS idx_agents_author ON public.agents(author_id);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON public.agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agents_likes ON public.agents(likes DESC);
CREATE INDEX IF NOT EXISTS idx_agents_views ON public.agents(views DESC);

CREATE INDEX IF NOT EXISTS idx_rules_category ON public.rules(category);
CREATE INDEX IF NOT EXISTS idx_rules_author ON public.rules(author_id);
CREATE INDEX IF NOT EXISTS idx_rules_created_at ON public.rules(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rules_votes ON public.rules(votes DESC);
CREATE INDEX IF NOT EXISTS idx_rules_views ON public.rules(views DESC);

CREATE INDEX IF NOT EXISTS idx_mcps_category ON public.mcps(category);
CREATE INDEX IF NOT EXISTS idx_mcps_active ON public.mcps(active);
CREATE INDEX IF NOT EXISTS idx_mcps_downloads ON public.mcps(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_mcps_rating ON public.mcps(rating DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for agents
CREATE POLICY "Anyone can view public agents" ON public.agents
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own agents" ON public.agents
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create agents" ON public.agents
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own agents" ON public.agents
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own agents" ON public.agents
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for rules
CREATE POLICY "Anyone can view public rules" ON public.rules
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own rules" ON public.rules
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create rules" ON public.rules
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own rules" ON public.rules
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own rules" ON public.rules
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for mcps (read-only for regular users)
CREATE POLICY "Anyone can view mcps" ON public.mcps
  FOR SELECT USING (true);

-- RLS Policies for agent_likes
CREATE POLICY "Users can view all likes" ON public.agent_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON public.agent_likes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for rule_votes
CREATE POLICY "Users can view all votes" ON public.rule_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own votes" ON public.rule_votes
  FOR ALL USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamp
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
  BEFORE UPDATE ON public.rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mcps_updated_at
  BEFORE UPDATE ON public.mcps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO public.agents (name, description, category, author_name, tags, prompt, model) VALUES
('Code Reviewer', 'AI agent that reviews code for best practices and potential issues', 'Development', 'System', ARRAY['code', 'review', 'quality'], 'You are an expert code reviewer. Analyze the provided code for best practices, potential bugs, security issues, and performance improvements.', 'gpt-4'),
('Content Writer', 'AI agent specialized in creating engaging content', 'Content', 'System', ARRAY['writing', 'content', 'marketing'], 'You are a professional content writer. Create engaging, well-structured content that resonates with the target audience.', 'gpt-4'),
('Data Analyst', 'AI agent for data analysis and insights', 'Analytics', 'System', ARRAY['data', 'analysis', 'insights'], 'You are a data analyst expert. Analyze data patterns, provide insights, and suggest actionable recommendations.', 'gpt-4')
ON CONFLICT DO NOTHING;

INSERT INTO public.rules (title, description, category, author_name, tags, content) VALUES
('Clean Code Principles', 'Essential principles for writing clean, maintainable code', 'Development', 'System', ARRAY['clean-code', 'best-practices'], 'Always write code that is easy to read and understand. Use meaningful variable names, keep functions small, and follow the single responsibility principle.'),
('API Design Guidelines', 'Best practices for designing RESTful APIs', 'API', 'System', ARRAY['api', 'rest', 'design'], 'Design APIs that are intuitive, consistent, and well-documented. Use proper HTTP methods, status codes, and follow RESTful conventions.'),
('Security Best Practices', 'Essential security practices for web applications', 'Security', 'System', ARRAY['security', 'web', 'practices'], 'Always validate input, use HTTPS, implement proper authentication and authorization, and keep dependencies updated.')
ON CONFLICT DO NOTHING;