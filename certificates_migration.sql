-- CERTIFICATES TABLE AND STORAGE SETUP
-- Run this in the Supabase SQL Editor

-- 1. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT,
  file_url TEXT NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
CREATE POLICY "Users can view own certificates" ON public.certificates 
  FOR SELECT USING (auth.uid() = student_id OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')));

DROP POLICY IF EXISTS "Users can insert own certificates" ON public.certificates;
CREATE POLICY "Users can insert own certificates" ON public.certificates 
  FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Users can delete own certificates" ON public.certificates;
CREATE POLICY "Users can delete own certificates" ON public.certificates 
  FOR DELETE USING (auth.uid() = student_id);

-- 4. Note: Manually create a storage bucket named 'certificates' in the Supabase dashboard
-- and set its privacy to public or add appropriate storage policies.
