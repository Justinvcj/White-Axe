-- Phase 4: Fully Generative Engine Support
-- Adaptive AI Education Operating System (White-Axe)

-- 1. Add syllabus constraints to Topics to prevent AI Hallucinations
ALTER TABLE public.topics
ADD COLUMN syllabus_constraints TEXT;

-- 2. Add interest cache to student profiles so the Adaptive Engine can easily access it
ALTER TABLE public.student_profiles
ADD COLUMN current_interest TEXT;
