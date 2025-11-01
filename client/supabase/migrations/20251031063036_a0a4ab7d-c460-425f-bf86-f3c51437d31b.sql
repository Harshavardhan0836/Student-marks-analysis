-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  department TEXT,
  semester INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_seat_number TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  semester INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- RLS for students
CREATE POLICY "Anyone authenticated can view students"
ON public.students
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage students"
ON public.students
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(subject_code, department, semester)
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create marks table
CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  internal_marks INTEGER NOT NULL DEFAULT 0,
  external_marks INTEGER NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 0,
  result TEXT CHECK (result IN ('P', 'F')),
  announced_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id)
);

ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view marks"
ON public.marks
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage marks"
ON public.marks
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create file_uploads table to track uploads
CREATE TABLE public.file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all uploads"
ON public.file_uploads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create uploads"
ON public.file_uploads
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));