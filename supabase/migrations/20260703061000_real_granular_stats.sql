ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS initial_assessment_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS granular_performance JSONB DEFAULT '[]'::jsonb;
