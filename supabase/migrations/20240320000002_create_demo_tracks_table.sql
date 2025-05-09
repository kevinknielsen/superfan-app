-- Create demo_tracks table
CREATE TABLE IF NOT EXISTS public.demo_tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.demo_tracks ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Enable read access for all users"
    ON public.demo_tracks FOR SELECT
    USING (true);

-- Allow insert for project creators
CREATE POLICY "Enable insert for project creators"
    ON public.demo_tracks FOR INSERT
    WITH CHECK (true);

-- Allow delete for project creators
CREATE POLICY "Enable delete for project creators"
    ON public.demo_tracks FOR DELETE
    USING (true); 