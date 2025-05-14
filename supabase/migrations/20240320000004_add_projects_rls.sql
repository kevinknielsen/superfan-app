-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow read access for all users
CREATE POLICY "Enable read access for all users"
    ON public.projects FOR SELECT
    USING (true);

-- Allow insert for authenticated users
CREATE POLICY "Enable insert for authenticated users"
    ON public.projects FOR INSERT
    WITH CHECK (true);

-- Allow update for project creators
CREATE POLICY "Enable update for project creators"
    ON public.projects FOR UPDATE
    USING (creator_id = auth.uid());

-- Allow delete for project creators
CREATE POLICY "Enable delete for project creators"
    ON public.projects FOR DELETE
    USING (creator_id = auth.uid()); 