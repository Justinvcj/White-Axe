-- Phase 2: Adaptive Flow Updates
-- Adaptive AI Education Operating System (AEOS)

-- 1. Topics Table Updates
-- Adding time constraints per the syllabus requirements
ALTER TABLE public.topics 
ADD COLUMN time_allocated_minutes INTEGER DEFAULT 60,
ADD COLUMN deadline TIMESTAMP WITH TIME ZONE;

-- 2. Assessments Table Updates
-- Differentiate the "Initial Test" (baseline) from ongoing adaptive challenges
ALTER TABLE public.assessments 
ADD COLUMN is_initial_test BOOLEAN DEFAULT false;

-- 3. Parent Feedbacks Table Updates
-- Allow parents to specify specific interests/distractions (e.g., "Cricket") to feed to the AI
ALTER TABLE public.parent_feedbacks 
ADD COLUMN interest_context TEXT;
