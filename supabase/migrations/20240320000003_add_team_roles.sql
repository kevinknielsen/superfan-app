-- Create an enum type for team member roles
CREATE TYPE public.team_member_role AS ENUM (
    'Producer',
    'Arranger',
    'Songwriter',
    'Musician',
    'Vocalist',
    'Engineer',
    'Mixer',
    'Mastering',
    'Assistant',
    'Tech'
);

-- Add a check constraint to ensure only valid roles are used
ALTER TABLE public.team_members 
    DROP CONSTRAINT IF EXISTS team_members_role_check;

ALTER TABLE public.team_members 
    ADD CONSTRAINT team_members_role_check 
    CHECK (role::text = ANY (ARRAY[
        'Producer',
        'Arranger',
        'Songwriter',
        'Musician',
        'Vocalist',
        'Engineer',
        'Mixer',
        'Mastering',
        'Assistant',
        'Tech'
    ]::text[])); 