-- ROBUST SCHEMA FOR COLLEGE MANAGEMENT ERP
-- Copy and run this in the Supabase SQL Editor

-- 1. Create Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, date, subject)
);

-- 3. Create Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Exams Table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_possible INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 8. AUTOMATIC PROFILE TRIGGER (REFINED)
-- This function will create a profile automatically when a user signs up
-- We use SECURITY DEFINER to bypass RLS for the system insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Trigger to run the function on every signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. REFINED RLS POLICIES

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Other tables policies (as before)
DROP POLICY IF EXISTS "Attendance viewable by owner or admin." ON public.attendance;
CREATE POLICY "Attendance viewable by owner or admin." ON public.attendance FOR SELECT USING (auth.uid() = student_id OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')));

DROP POLICY IF EXISTS "Notes are viewable by everyone." ON public.notes;
CREATE POLICY "Notes are viewable by everyone." ON public.notes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Exams are viewable by everyone." ON public.exams;
CREATE POLICY "Exams are viewable by everyone." ON public.exams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Questions are viewable by everyone." ON public.questions;
CREATE POLICY "Questions are viewable by everyone." ON public.questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Submissions viewable by owner or admin." ON public.submissions;
CREATE POLICY "Submissions viewable by owner or admin." ON public.submissions FOR SELECT USING (auth.uid() = student_id OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')));

-- Admin full access
DROP POLICY IF EXISTS "Admins can manage everything." ON public.attendance;
CREATE POLICY "Admins can manage everything." ON public.attendance FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage notes." ON public.notes;
CREATE POLICY "Admins can manage notes." ON public.notes FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage exams." ON public.exams;
CREATE POLICY "Admins can manage exams." ON public.exams FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage questions." ON public.questions;
CREATE POLICY "Admins can manage questions." ON public.questions FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
