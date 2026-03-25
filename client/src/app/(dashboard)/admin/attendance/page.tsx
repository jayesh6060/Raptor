'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, UserCheck, Calendar as CalendarIcon, Save, Check, X, Loader2, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
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

export default function AttendanceMarking() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    async function fetchTeacherCourses() {
      if (!profile?.id) return;
      
      setLoading(true);
      const { data: assignmentData } = await supabase
        .from('teacher_assignments')
        .select('course_id, courses(*)')
        .eq('teacher_id', profile.id);

      const teacherCourses = (assignmentData?.map((a: any) => {
        const c = a.courses;
        return Array.isArray(c) ? c[0] : c;
      }) || []) as any[];

      setLoading(false);
      setCourses(teacherCourses);
      
      if (teacherCourses.length > 0) {
        setSelectedCourseId((teacherCourses[0] as any)?.id || '');
      }
    }
    fetchTeacherCourses();
  }, [profile?.id]);

  useEffect(() => {
    async function fetchEnrolledStudents() {
      if (!selectedCourseId) {
        setStudents([]);
        return;
      }
      
      setFetchingStudents(true);
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('student_id, profiles(*)')
        .eq('course_id', selectedCourseId);

      const enrolledStudents = (enrollmentData?.map((e: any) => e.profiles) || []) as any[];
      setStudents(enrolledStudents);
      
      const initial: Record<string, string> = {};
      enrolledStudents.forEach(s => initial[s.id] = 'present');
      setAttendance(initial);
      setFetchingStudents(false);
    }
    fetchEnrolledStudents();
  }, [selectedCourseId]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedCourseId) return;

    const selectedCourse = courses.find((c: any) => c.id === selectedCourseId);
    
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: studentId,
      course_id: selectedCourseId,
      subject: (selectedCourse as any)?.name || 'Unknown',
      date,
      status
    }));

    const { error } = await supabase.from('attendance').upsert(records, {
      onConflict: 'student_id, date, course_id'
    });

    if (error) {
      alert('Error saving attendance: ' + error.message);
    } else {
      alert('Attendance saved successfully!');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Loading faculty system...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">Attendance Hub</h1>
          <p className="text-muted-foreground font-medium mt-1">Mark and manage attendance records for your assigned courses.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={students.length === 0}
          variant="gradient"
          className="h-14 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-strong"
        >
          <Save size={18} className="mr-2" />
          Finalize Roll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-7 border-border shadow-soft space-y-3 bg-card/50 backdrop-blur-md">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current Subject</label>
          <div className="relative group">
             <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={18} />
             <select 
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-muted/10 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none cursor-pointer"
             >
                {courses.length > 0 ? courses.map(course => (
                  <option key={course.id} value={course.id}>{course.code} — {course.name}</option>
                )) : (
                  <option value="">No subjects assigned</option>
                )}
             </select>
          </div>
        </Card>
        
        <Card className="p-7 border-border shadow-soft space-y-3 bg-card/50 backdrop-blur-md">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Marking Date</label>
          <div className="relative group">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={18} />
            <Input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-14 pl-12 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20"
            />
          </div>
        </Card>
      </div>

      <Card className="border-border shadow-strong overflow-hidden bg-card/50 backdrop-blur-md">
        {fetchingStudents ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6 text-muted-foreground">
             <Loader2 className="animate-spin text-primary" size={32} />
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Compiling Enrollment Registry...</p>
          </div>
        ) : students.length > 0 ? (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border">
                <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Candidate</TableHead>
                <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Status Toggle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors border-border group">
                  <TableCell className="px-10 py-7">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center font-black text-sm border border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 group-hover:scale-110 transition-all">
                        {student.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-foreground tracking-tight uppercase italic group-hover:text-primary transition-colors">{student.name}</p>
                        <Badge variant="outline" className="mt-1 text-[9px] font-black border-border bg-muted/30 text-muted-foreground uppercase tracking-widest px-2 py-0.5">
                          {student.usn || 'PENDING'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-7">
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={() => handleStatusChange(student.id, 'present')}
                        variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                        className={cn(
                          "h-12 px-7 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                          attendance[student.id] === 'present' 
                            ? "bg-success text-white shadow-lg shadow-success/20 hover:bg-success/90" 
                            : "text-muted-foreground hover:border-success/30 hover:text-success"
                        )}
                      >
                        <Check size={14} className="mr-2" strokeWidth={4} />
                        Present
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        variant={attendance[student.id] === 'absent' ? 'destructive' : 'outline'}
                        className={cn(
                          "h-12 px-7 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                          attendance[student.id] === 'absent' 
                            ? "bg-destructive text-white shadow-lg shadow-destructive/20" 
                            : "text-muted-foreground hover:border-destructive/30 hover:text-destructive"
                        )}
                      >
                        <X size={14} className="mr-2" strokeWidth={4} />
                        Absent
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-32 text-center space-y-6">
             <div className="w-20 h-20 bg-muted text-muted-foreground/30 rounded-[32px] flex items-center justify-center mx-auto border-2 border-dashed border-border group-hover:scale-110 transition-transform">
                <Users size={40} />
             </div>
             <div>
                <p className="text-foreground font-black uppercase text-lg tracking-tight italic">Registry Empty</p>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1">No candidates enrolled in this subject yet.</p>
             </div>
          </div>
        )}
      </Card>
    </div>
  );
}
