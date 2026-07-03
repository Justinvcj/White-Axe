-- Phase 3/Admin: Onboarding, Point System & Feedback
-- Adaptive AI Education Operating System (AEOS)

-- 1. Create or Replace Trigger Function (in case it wasn't run in Phase 1)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1b. Create JWT Helper Function (in case it wasn't run in Phase 1)
CREATE OR REPLACE FUNCTION get_jwt_school_id() RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'school_id')::UUID;
$$ LANGUAGE SQL STABLE;

-- 2. Academic Years Table for Onboarding
CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    holidays DATE[], -- Array of dates for off-days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_academic_years_modtime BEFORE UPDATE ON public.academic_years FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic Years isolated by school_id" ON public.academic_years
    FOR ALL USING (school_id = get_jwt_school_id());

-- 2. Update Compatibility Scores for the AI vs Teacher Point System
ALTER TABLE public.compatibility_scores 
ADD COLUMN teacher_points INTEGER DEFAULT 0,
ADD COLUMN ai_points INTEGER DEFAULT 0;

-- 3. Mock Data insertion for 8th Grade Math & Physics Demo
-- Note: Assuming a generic school_id exists, otherwise this is handled via the Admin UI.
