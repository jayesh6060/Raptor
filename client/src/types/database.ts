export type Profile = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'teacher';
  usn?: string;
  roll_number?: number;
  phone?: string;
  created_at: string;
};

export type Attendance = {
  id: string;
  student_id: string;
  subject: string;
  date: string;
  status: 'present' | 'absent';
  created_at: string;
};

export type Note = {
  id: string;
  title: string;
  file_url: string;
  uploaded_by: string;
  created_at: string;
};

export type Exam = {
  id: string;
  title: string;
  date: string;
  duration: number;
  created_at: string;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  created_at: string;
};

export type Submission = {
  id: string;
  student_id: string;
  exam_id: string;
  score: number;
  total_possible: number;
  submitted_at: string;
  exams?: {
    title: string;
  };
};
