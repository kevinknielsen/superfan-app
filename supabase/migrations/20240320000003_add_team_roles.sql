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
    'Tech',
    'Artist',
    'Curator',
    'Manager',
    'Label',
    'Publisher',
    'Composer',
    'Lyricist',
    'Performer',
    'Featured Artist',
    'Backing Vocalist',
    'Session Musician',
    'Sound Designer',
    'Studio Manager',
    'A&R',
    'Marketing',
    'Legal',
    'Business Manager',
    'Tour Manager',
    'Merchandise Manager',
    'Social Media Manager'
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
        'Tech',
        'Artist',
        'Curator',
        'Manager',
        'Label',
        'Publisher',
        'Composer',
        'Lyricist',
        'Performer',
        'Featured Artist',
        'Backing Vocalist',
        'Session Musician',
        'Sound Designer',
        'Studio Manager',
        'A&R',
        'Marketing',
        'Legal',
        'Business Manager',
        'Tour Manager',
        'Merchandise Manager',
        'Social Media Manager'
    ]::text[])); 