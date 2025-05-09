-- Drop the existing foreign key constraint
ALTER TABLE public.team_members
DROP CONSTRAINT IF EXISTS team_members_project_id_fkey;

-- Add a new foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.team_members
ADD CONSTRAINT team_members_project_id_fkey
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE; 