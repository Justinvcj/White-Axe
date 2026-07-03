-- Phase 1: Supabase Core & Security Layer
-- Adaptive AI Education Operating System (AEOS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Define Core Enumerations
CREATE TYPE user_role AS ENUM ('SuperAdmin', 'Admin', 'Teacher', 'Student', 'Parent');
CREATE TYPE student_tier AS ENUM ('C1', 'C2', 'C3');

-- 3. Trigger Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Table Creations

-- Schools
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_schools_modtime BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Users (Extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Classes
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade_level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_classes_modtime BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Subjects
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_subjects_modtime BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Topics
CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_topics_modtime BEFORE UPDATE ON public.topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Knowledge Graph Edges (Dependency Tracing for Predictive Risk Engine)
CREATE TABLE public.knowledge_graph_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    child_topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    dependency_weight NUMERIC DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_topic_id, child_topic_id)
);

-- Student Profiles
CREATE TABLE public.student_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    current_tier student_tier,
    clickstream_confidence_index NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_student_profiles_modtime BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Teacher Observations
CREATE TABLE public.teacher_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    observed_tier student_tier NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_assessments_modtime BEFORE UPDATE ON public.assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Questions
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    complexity_level NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_questions_modtime BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Student Responses
CREATE TABLE public.student_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    response_data JSONB,
    is_correct BOOLEAN,
    response_latency_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent Feedbacks
CREATE TABLE public.parent_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reported_interests TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compatibility Scores
CREATE TABLE public.compatibility_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    compatibility_index NUMERIC,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_compatibility_scores_modtime BEFORE UPDATE ON public.compatibility_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- 5. Row Level Security (RLS) Policies
-- Helper functions to get current user's school_id and role from JWT
CREATE OR REPLACE FUNCTION get_jwt_school_id() RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'school_id')::UUID;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION get_jwt_user_role() RETURNS TEXT AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'role')::TEXT;
$$ LANGUAGE SQL STABLE;

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compatibility_scores ENABLE ROW LEVEL SECURITY;

-- Base RLS Policy Template (Multi-tenant isolation by school_id)
-- Note: SuperAdmins bypass this via standard superuser config, but isolation is strict per requirement.

-- Users
CREATE POLICY "Users are isolated by school_id" ON public.users
    FOR ALL USING (school_id = get_jwt_school_id());

-- Classes
CREATE POLICY "Classes are isolated by school_id" ON public.classes
    FOR ALL USING (school_id = get_jwt_school_id());

-- Subjects
CREATE POLICY "Subjects are isolated by school_id" ON public.subjects
    FOR ALL USING (school_id = get_jwt_school_id());

-- Topics (via Subjects)
CREATE POLICY "Topics are isolated by school_id" ON public.topics
    FOR ALL USING (subject_id IN (SELECT id FROM public.subjects WHERE school_id = get_jwt_school_id()));

-- Knowledge Graph Edges (via Topics -> Subjects)
CREATE POLICY "Graph Edges are isolated by school_id" ON public.knowledge_graph_edges
    FOR ALL USING (parent_topic_id IN (
        SELECT t.id FROM public.topics t JOIN public.subjects s ON t.subject_id = s.id WHERE s.school_id = get_jwt_school_id()
    ));

-- Student Profiles (via Users)
CREATE POLICY "Profiles are isolated by school_id" ON public.student_profiles
    FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE school_id = get_jwt_school_id()));

-- Teacher Observations (via Teacher -> Users)
CREATE POLICY "Observations are isolated by school_id" ON public.teacher_observations
    FOR ALL USING (teacher_id IN (SELECT id FROM public.users WHERE school_id = get_jwt_school_id()));

-- Assessments (via Classes)
CREATE POLICY "Assessments are isolated by school_id" ON public.assessments
    FOR ALL USING (class_id IN (SELECT id FROM public.classes WHERE school_id = get_jwt_school_id()));

-- Questions (via Assessments -> Classes)
CREATE POLICY "Questions are isolated by school_id" ON public.questions
    FOR ALL USING (assessment_id IN (
        SELECT a.id FROM public.assessments a JOIN public.classes c ON a.class_id = c.id WHERE c.school_id = get_jwt_school_id()
    ));

-- Student Responses (via Student -> Users)
CREATE POLICY "Responses are isolated by school_id" ON public.student_responses
    FOR ALL USING (student_id IN (SELECT id FROM public.users WHERE school_id = get_jwt_school_id()));

-- Parent Feedbacks (via Parent -> Users)
CREATE POLICY "Parent Feedbacks are isolated by school_id" ON public.parent_feedbacks
    FOR ALL USING (parent_id IN (SELECT id FROM public.users WHERE school_id = get_jwt_school_id()));

-- Compatibility Scores (via Teacher -> Users)
CREATE POLICY "Compatibility Scores are isolated by school_id" ON public.compatibility_scores
    FOR ALL USING (teacher_id IN (SELECT id FROM public.users WHERE school_id = get_jwt_school_id()));

-- 6. Trigger to sync auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, school_id, role, first_name, last_name, email)
    VALUES (
        new.id,
        (new.raw_user_meta_data->>'school_id')::UUID,
        (new.raw_user_meta_data->>'role')::user_role,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        new.email
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Hook to securely append custom role claims to the JWT
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
  DECLARE
    claims jsonb;
    user_role public.user_role;
    user_school_id uuid;
  BEGIN
    -- Fetch the user role and school_id from public.users table
    SELECT role, school_id INTO user_role, user_school_id FROM public.users WHERE id = (event->>'user_id')::uuid;

    claims := event->'claims';
    
    IF user_role IS NOT NULL THEN
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    END IF;
    
    IF user_school_id IS NOT NULL THEN
      claims := jsonb_set(claims, '{school_id}', to_jsonb(user_school_id));
    END IF;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);
    
    RETURN event;
  END;
$$;

-- Grant execution to Supabase Auth so it can actually run the hook
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;
