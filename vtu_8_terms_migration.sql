-- VTU 2022 SCHEME (ALL 8 TERMS)
-- Run this in the Supabase SQL Editor

-- 1. Ensure semester column exists
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 1;

-- 2. Populate Semesters
INSERT INTO public.courses (code, name, department, semester)
VALUES 
  -- SEMESTER 1 (Physics Cycle)
  ('BMATS101', 'Mathematics for CSE-I', 'CSE', 1),
  ('BPHYS102', 'Applied Physics', 'CSE', 1),
  ('BEEEE103', 'Basic Electrical/Electronics', 'CSE', 1),
  ('BPLCK105A', 'Introduction to C', 'CSE', 1),
  ('BCEDL105P', 'Engineering Drawing', 'CSE', 1),
  ('BENGK106', 'Communicative English', 'CSE', 1),
  ('BIDTK107', 'Design Thinking', 'CSE', 1),

  -- SEMESTER 2 (Chemistry Cycle)
  ('BMATS201', 'Mathematics for CSE-II', 'CSE', 2),
  ('BCHEM202', 'Applied Chemistry', 'CSE', 2),
  ('BEMEN203', 'Basic Mechanical Engineering', 'CSE', 2),
  ('BEEEN204', 'Basic Electronics', 'CSE', 2),
  ('BPLCK205B', 'Introduction to Java', 'CSE', 2),
  ('BENGK206', 'Professional English', 'CSE', 2),
  ('BICO208', 'Constitution of India', 'CSE', 2),

  -- SEMESTER 4 (CSE Core)
  ('BCS401', 'Design & Analysis of Algorithms', 'CSE', 4),
  ('BCS402', 'Microcontrollers', 'CSE', 4),
  ('BCS403', 'Database Management System', 'CSE', 4),
  ('BCSL404', 'Algorithms Lab', 'CSE', 4),
  ('BCS405A', 'Discrete Mathematical Structures', 'CSE', 4),
  ('BCSL456D', 'UI/UX Design', 'CSE', 4),
  ('BBOC407', 'Biology for Engineers', 'CSE', 4),
  ('BUHK408', 'Universal Human Values', 'CSE', 4)
ON CONFLICT (code) DO UPDATE SET semester = EXCLUDED.semester;

-- 3. Assign to Jayesh
DO $$
DECLARE
    teacher_uuid UUID;
    course_record RECORD;
BEGIN
    SELECT id INTO teacher_uuid FROM public.profiles WHERE email ILIKE 'jayeshsuthar0621@gmail.com' LIMIT 1;
    IF teacher_uuid IS NOT NULL THEN
        FOR course_record IN SELECT id FROM public.courses LOOP
            INSERT INTO public.teacher_assignments (course_id, teacher_id) 
            VALUES (course_record.id, teacher_uuid) 
            ON CONFLICT (course_id, teacher_id) DO NOTHING;
        END LOOP;
    END IF;
END $$;
