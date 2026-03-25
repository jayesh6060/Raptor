'use client';

import React, { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  UserPlus, 
  Users, 
  Trash2, 
  BookOpen, 
  GraduationCap,
  Loader2,
  Search,
  Plus,
  Mail,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Course, Profile, TeacherAssignment, Enrollment } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [teachers, setTeachers] = useState<Profile[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  // Management states
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [
      { data: courseData },
      { data: teacherData },
      { data: studentData },
      { data: assignmentData },
      { data: enrollmentData }
    ] = await Promise.all([
      supabase.from('courses').select('*').eq('id', courseId).single(),
      supabase.from('profiles').select('*').eq('role', 'teacher'),
      supabase.from('profiles').select('*').eq('role', 'student'),
      supabase.from('teacher_assignments').select('*, profiles(name, email)').eq('course_id', courseId),
      supabase.from('enrollments').select('*, profiles(name, email, usn)').eq('course_id', courseId)
    ]);

    setCourse(courseData);
    setTeachers(teacherData || []);
    setStudents(studentData || []);
    setAssignments(assignmentData || []);
    setEnrollments(enrollmentData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleAssignTeacher = async () => {
    if (!selectedTeacherId) return;
    setActionLoading('assign-teacher');
    
    const { error } = await supabase.from('teacher_assignments').insert([
      { course_id: courseId, teacher_id: selectedTeacherId }
    ]);

    if (error) {
      alert('Error assigning teacher. They might already be assigned.');
    } else {
      setSelectedTeacherId('');
      fetchData();
    }
    setActionLoading(null);
  };

  const handleEnrollStudent = async (studentId: string) => {
    setActionLoading(`enroll-${studentId}`);
    
    const { error } = await supabase.from('enrollments').insert([
      { course_id: courseId, student_id: studentId }
    ]);

    if (error) {
      alert('Error enrolling student.');
    } else {
      fetchData();
    }
    setActionLoading(null);
  };

  const handleRemoveAssignment = async (id: string) => {
    const { error } = await supabase.from('teacher_assignments').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleRemoveEnrollment = async (id: string) => {
    const { error } = await supabase.from('enrollments').delete().eq('id', id);
    if (!error) fetchData();
  };

  const filteredAvailableStudents = students.filter(s => 
    !enrollments.some(e => e.student_id === s.id) &&
    (s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || 
     s.usn?.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Loading course system...</p>
      </div>
    );
  }

  if (!course) return <div className="p-20 text-center font-black uppercase text-muted-foreground tracking-widest border border-dashed rounded-[32px]">Course not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <Link href="/admin/courses">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border shadow-soft hover:bg-muted group transition-all">
            <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="glass" className="text-[10px] font-black tracking-widest text-primary border-primary/20">
              {course.code}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-black tracking-widest bg-muted border-border">
              {course.department}
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">{course.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Management Tools */}
        <div className="lg:col-span-4 space-y-8">
          {/* Teacher Assignment */}
          <Card className="border-border shadow-strong overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border p-7">
              <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight italic">
                <Users size={22} className="text-primary" />
                Assign Teacher
              </CardTitle>
            </CardHeader>
            <CardContent className="p-7 space-y-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Select Faculty</label>
                <select 
                  className="w-full h-14 px-5 bg-muted/10 border border-border rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none cursor-pointer"
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                >
                  <option value="">Choose a teacher...</option>
                  {teachers.filter(t => !assignments.some(a => a.teacher_id === t.id)).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={handleAssignTeacher}
                disabled={!selectedTeacherId || actionLoading === 'assign-teacher'}
                variant="gradient"
                className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-strong"
              >
                {actionLoading === 'assign-teacher' ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} className="mr-2" />}
                Assign Faculty
              </Button>
            </CardContent>
          </Card>

          {/* Student Enrollment */}
          <Card className="border-border shadow-strong overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border p-7">
              <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight italic">
                <GraduationCap size={22} className="text-primary" />
                Enroll Students
              </CardTitle>
            </CardHeader>
            <CardContent className="p-7 space-y-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={18} />
                <Input 
                  type="text"
                  placeholder="Search students..."
                  className="h-14 pl-12 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {filteredAvailableStudents.length > 0 ? filteredAvailableStudents.map(student => (
                  <div key={student.id} className="p-4 bg-muted/30 rounded-2xl flex items-center justify-between border border-border/50 group hover:border-primary/30 hover:bg-muted/50 transition-all">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-foreground truncate uppercase">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{student.usn || student.email}</p>
                    </div>
                    <Button 
                      onClick={() => handleEnrollStudent(student.id)}
                      disabled={actionLoading === `enroll-${student.id}`}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary hover:bg-primary/10 rounded-xl"
                    >
                      {actionLoading === `enroll-${student.id}` ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
                    </Button>
                  </div>
                )) : (
                  <p className="text-center py-10 text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] italic bg-muted/10 rounded-2xl border border-dashed border-border">No matching students</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Listings */}
        <div className="lg:col-span-8 space-y-10">
          {/* Assigned Teachers View */}
          <Card className="border-border shadow-soft overflow-hidden">
             <CardHeader className="bg-muted/30 border-b border-border p-7">
                <CardTitle className="text-xl font-black tracking-tight italic">Assigned Faculty</CardTitle>
             </CardHeader>
             <div className="p-0">
                {assignments.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="border-border">
                        <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12">Teacher</TableHead>
                        <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12">Contact</TableHead>
                        <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map(a => (
                        <TableRow key={a.id} className="hover:bg-muted/30 transition-colors border-border group">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-base border border-primary/10 group-hover:scale-110 transition-transform">
                                {a.profiles?.name?.charAt(0) || '?'}
                              </div>
                              <span className="font-bold text-foreground uppercase tracking-tight italic">{a.profiles?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-8 py-6">
                             <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                               <Mail size={14} className="text-primary/50" />
                               {a.profiles?.email}
                             </div>
                          </TableCell>
                          <TableCell className="px-8 py-6 text-right">
                             <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveAssignment(a.id)} 
                              className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                             >
                                <Trash2 size={18} />
                             </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-20 text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] italic">No teachers assigned to this module.</div>
                )}
             </div>
          </Card>

          {/* Enrolled Students View */}
          <Card className="border-border shadow-soft overflow-hidden">
             <CardHeader className="bg-muted/30 border-b border-border p-7 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl font-black tracking-tight italic">Batch Enrollment</CardTitle>
                <Badge variant="glass" className="font-black uppercase text-[10px] tracking-widest text-primary border-primary/20 px-4 py-1.5 h-auto">
                  {enrollments.length} Registered
                </Badge>
             </CardHeader>
             <div className="p-0">
                {enrollments.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="border-border">
                        <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12">Student Profile</TableHead>
                        <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12">USN / ID</TableHead>
                        <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map(e => (
                        <TableRow key={e.id} className="hover:bg-muted/30 transition-colors border-border group">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-base border border-primary/10 group-hover:scale-110 transition-transform">
                                {e.profiles?.name?.charAt(0) || '?'}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-foreground uppercase tracking-tight italic truncate">{e.profiles?.name}</div>
                                <div className="text-[10px] text-muted-foreground font-black tracking-tight uppercase truncate">{e.profiles?.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-8 py-6">
                            <Badge variant="outline" className="text-[10px] font-black tracking-widest border-border bg-muted/20 text-muted-foreground uppercase">
                              {e.profiles?.usn || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-8 py-6 text-right text-slate-300">
                             <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveEnrollment(e.id)} 
                              className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                             >
                                <Trash2 size={18} />
                             </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-20 text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] italic">No active enrollments for this batch.</div>
                )}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
