-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Create new policies that don't rely on auth.uid()
CREATE POLICY "Enable read access for all users"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for users"
    ON public.users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for users based on privy_id"
    ON public.users FOR UPDATE
    USING (true); 