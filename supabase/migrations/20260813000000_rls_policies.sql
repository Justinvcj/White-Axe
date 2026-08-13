-- Phase 8: Production Hardening & Scale
-- Enterprise Auth & Row Level Security (RLS)

-- 1. Enable RLS on core tables
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 2. Student Profile Policies
-- Students can only read their own profile
CREATE POLICY "Students can view own profile" 
ON public.student_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Teachers can only read profiles of students enrolled in their classes
CREATE POLICY "Teachers can view enrolled students' profiles" 
ON public.student_profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.classes c ON c.id = e.class_id
    WHERE e.user_id = student_profiles.user_id
    AND c.school_id = (SELECT school_id FROM public.users WHERE id = auth.uid() LIMIT 1)
  )
);

-- 3. Classes Policies
-- Teachers can only view classes within their school
CREATE POLICY "Teachers can view classes in their school"
ON public.classes
FOR SELECT
USING (
  school_id = (SELECT school_id FROM public.users WHERE id = auth.uid() LIMIT 1)
);

-- 4. Enrollments Policies
-- Students can only view their own enrollments
CREATE POLICY "Students can view own enrollments"
ON public.enrollments
FOR SELECT
USING (auth.uid() = user_id);

-- Teachers can view enrollments for classes in their school
CREATE POLICY "Teachers can view enrollments in their school"
ON public.enrollments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = enrollments.class_id
    AND c.school_id = (SELECT school_id FROM public.users WHERE id = auth.uid() LIMIT 1)
  )
);
