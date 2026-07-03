-- Seed Data for End-to-End Test (Phase 4 Generative AI)

-- 1. Create a School
INSERT INTO public.schools (id, name, domain) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Global Tech High', 'gth.edu')
ON CONFLICT (id) DO NOTHING;

-- 2. Create the Academic Year
INSERT INTO public.academic_years (id, school_id, start_date, end_date, holidays)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2026-08-01', '2027-05-30', ARRAY['2026-10-24', '2026-12-25']::DATE[])
ON CONFLICT (id) DO NOTHING;

-- 3. Create a Class (8th Grade Math/Physics)
INSERT INTO public.classes (id, school_id, name, grade_level)
VALUES ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Class 8-A', 8)
ON CONFLICT (id) DO NOTHING;

-- 4. Create Subjects
INSERT INTO public.subjects (id, school_id, name)
VALUES 
('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Physics'),
('44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', 'Mathematics')
ON CONFLICT (id) DO NOTHING;

-- 5. Create Strict Topics (The Generative Syllabus)
INSERT INTO public.topics (id, subject_id, name, description, order_index, syllabus_constraints)
VALUES 
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 'Newton''s First Law', 'Introduction to Inertia and Balanced Forces', 1, 'Strictly cover inertia and balanced forces. Do NOT use acceleration formulas like F=ma. Use 8th-grade vocabulary. Real-world examples must be highly relatable.'),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444441', 'Velocity & Speed', 'Understanding rate of motion', 2, 'Strictly cover distance over time (v=d/t). Do NOT cover vector displacement angles. Ensure numbers are easily divisible for 8th graders (e.g. 60km/h).')
ON CONFLICT (id) DO NOTHING;

-- 6. Create Dummy Users (Assuming Auth is handled, we just mock the public.users table)
INSERT INTO public.users (id, school_id, role, first_name, last_name, email)
VALUES 
('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', 'Teacher', 'Priya', 'Sharma', 'teacher@gth.edu'),
('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', 'Student', 'Diya', 'Sharma', 'student@gth.edu')
ON CONFLICT (id) DO NOTHING;

-- 7. Student Profile with Context
INSERT INTO public.student_profiles (user_id, current_tier, current_interest)
VALUES ('66666666-6666-6666-6666-666666666662', 'C2', 'Cricket and MS Dhoni')
ON CONFLICT (user_id) DO NOTHING;
