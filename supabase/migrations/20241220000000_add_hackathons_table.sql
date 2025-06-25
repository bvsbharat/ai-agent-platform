-- Add hackathons table to the database schema

-- Create hackathons table
CREATE TABLE IF NOT EXISTS public.hackathons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  organizer TEXT NOT NULL,
  attendees INTEGER DEFAULT 0,
  image_url TEXT,
  event_url TEXT NOT NULL,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hackathons_date ON public.hackathons(date);
CREATE INDEX IF NOT EXISTS idx_hackathons_location ON public.hackathons(location);
CREATE INDEX IF NOT EXISTS idx_hackathons_is_online ON public.hackathons(is_online);
CREATE INDEX IF NOT EXISTS idx_hackathons_created_at ON public.hackathons(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hackathons
CREATE POLICY "Anyone can view hackathons" ON public.hackathons
  FOR SELECT USING (true);

-- Only admins can modify hackathons (we'll use service role for scraping)
CREATE POLICY "Admins can modify hackathons" ON public.hackathons
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE email LIKE '%@trueagents.ai'
  ));

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_hackathons_updated_at
  BEFORE UPDATE ON public.hackathons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();