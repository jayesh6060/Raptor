-- STEP 1: FIX THE SCHEMA FIRST
-- Run this block alone if the previous one failed
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 1;

-- STEP 2: POPULATE DATA
-- Run this once Step 1 is successful
INSERT INTO public.courses (code, name, department, semester)
VALUES 
  -- TERM 1
  ('BMATS101', 'Mathematics for CSE-I', 'CSE', 1),
  ('BPHYS102', 'Applied Physics', 'CSE', 1),
  ('BEEEE103', 'Basic Electrical/Electronics', 'CSE', 1),
  ('BPLCK105A', 'Introduction to C', 'CSE', 1),
  ('BCEDL105P', 'Engineering Drawing', 'CSE', 1),
  ('BENGK106', 'Communicative English', 'CSE', 1),
  ('BIDTK107', 'Design Thinking', 'CSE', 1),

  -- TERM 2
  ('BMATS201', 'Mathematics for CSE-II', 'CSE', 2),
  ('BCHEM202', 'Applied Chemistry', 'CSE', 2),
  ('BEMEN203', 'Basic Mechanical Engineering', 'CSE', 2),
  ('BEEEN204', 'Basic Electronics', 'CSE', 2),
  ('BPLCK205B', 'Introduction to Java', 'CSE', 2),
  ('BENGK206', 'Professional English', 'CSE', 2),
  ('BICO208', 'Constitution of India', 'CSE', 2),

  -- TERM 3
  ('BCS301', 'Mathematics for CSE-III', 'CSE', 3),
  ('BCS302', 'Data Structures and Applications', 'CSE', 3),
  ('BCS303', 'Computer Organization & Architecture', 'CSE', 3),
  ('BCS304', 'Object Oriented Programming with C++', 'CSE', 3),
  ('BCSL305', 'Data Structures Lab', 'CSE', 3),
  ('BSCL358', 'Social Connect & Responsibility', 'CSE', 3),

  -- TERM 4
  ('BCS401', 'Analysis & Design of Algorithms', 'CSE', 4),
  ('BCS402', 'Microcontrollers and Embedded Systems', 'CSE', 4),
  ('BCS403', 'Database Management System', 'CSE', 4),
  ('BCSL404', 'Analysis & Design of Algorithms Lab', 'CSE', 4),
  ('BCS405A', 'Discrete Mathematical Structures', 'CSE', 4),
  ('BCSL456xx', 'Ability Enhancement Course-IV', 'CSE', 4),
  ('BBOC407', 'Biology for Engineers', 'CSE', 4),
  ('BUHK408', 'Universal Human Values', 'CSE', 4),

  -- TERM 5
  ('BCS501', 'Operating Systems', 'CSE', 5),
  ('BCS502', 'Computer Networks', 'CSE', 5),
  ('BCS503', 'Theory of Computation', 'CSE', 5),
  ('BCSL504', 'Computer Networks Lab', 'CSE', 5),
  ('BCS5xx', 'Professional Elective-I', 'CSE', 5),

  -- TERM 6
  ('BCS601', 'Software Engineering & Project Mgmt', 'CSE', 6),
  ('BCS602', 'Artificial Intelligence & Machine Learning', 'CSE', 6),
  ('BCSL603', 'AI & ML Laboratory', 'CSE', 6),
  ('BCS6xx', 'Professional Elective-II', 'CSE', 6),

  -- TERM 7
  ('BCS701', 'Parallel Computer Architecture', 'CSE', 7),
  ('BCS702', 'Big Data Analytics', 'CSE', 7),
  ('BCSL703', 'Big Data Analytics Lab', 'CSE', 7),
  ('BCS7xx', 'Professional Elective-III', 'CSE', 7),

  -- TERM 8
  ('BCS801', 'Technical Seminar', 'CSE', 8),
  ('BCS802', 'Internship', 'CSE', 8),
  ('BCS803', 'Project Phase-II', 'CSE', 8)
ON CONFLICT (code) DO UPDATE SET semester = EXCLUDED.semester;

-- STEP 3: ASSIGN ALL TO TEACHER
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

-- STEP 4: ENROLL MALLI (STUDENT)
DO $$
DECLARE
    student_uuid UUID;
    course_record RECORD;
BEGIN
    SELECT id INTO student_uuid FROM public.profiles WHERE email ILIKE 'malli@gmail.com' OR name ILIKE 'malli' LIMIT 1;
    IF student_uuid IS NOT NULL THEN
        FOR course_record IN SELECT id FROM public.courses WHERE semester <= 4 LOOP
            INSERT INTO public.enrollments (course_id, student_id) 
            VALUES (course_record.id, student_uuid) 
            ON CONFLICT (course_id, student_id) DO NOTHING;
        END LOOP;
    END IF;
END $$;
