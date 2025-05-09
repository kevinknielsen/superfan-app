-- Drop the existing foreign key constraint
ALTER TABLE public.milestones
DROP CONSTRAINT IF EXISTS milestones_project_id_fkey;

-- Add a new foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.milestones
ADD CONSTRAINT milestones_project_id_fkey
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE; 