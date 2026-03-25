'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Calendar, CheckCircle, Percent, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Course, Attendance } from '@/types/database';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function StudentCourses() {
  const { profile } = useAuth();
  
  // Try to load cached data for instant initial render
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window === 'undefined') return [];
    const cached = localStorage.getItem('raptor_cached_courses');
    return cached ? JSON.parse(cached) : [];
  });
  
  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    if (typeof window === 'undefined') return [];
    const cached = localStorage.getItem('raptor_cached_attendance');
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !localStorage.getItem('raptor_cached_courses');
  });
  const [activeTerm, setActiveTerm] = useState(1); // Set default to Term 1

  useEffect(() => {
    async function fetchData() {
      if (!profile?.id) {
        setLoading(false);
        return;
      }
      
      const [enrollmentRes, attendanceRes] = await Promise.all([
        supabase.from('enrollments').select('*, courses(*)').eq('student_id', profile.id),
        supabase.from('attendance').select('*').eq('student_id', profile.id)
      ]);

      const enrolledCourses = enrollmentRes.data?.map((e: any) => e.courses) || [];
      const attendanceData = attendanceRes.data || [];
      
      setCourses(enrolledCourses as Course[]);
      setAttendance(attendanceData || []);
      
      // Update cache
      if (typeof window !== 'undefined') {
        localStorage.setItem('raptor_cached_courses', JSON.stringify(enrolledCourses));
        localStorage.setItem('raptor_cached_attendance', JSON.stringify(attendanceData));
      }
      
      setLoading(false);
    }
    fetchData();
  }, [profile?.id]);

  if (loading && !courses.length) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getAttendanceStats = (courseId: string) => {
    const relevant = attendance.filter(a => a.course_id === courseId);
    const present = relevant.filter(a => a.status === 'present').length;
    const total = relevant.length;
    const rate = total > 0 ? (present / total) * 100 : 0;
    return { present, total, rate };
  };

  const filteredCourses = courses.filter((c: Course) => c.semester === activeTerm);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-3">Academic <span className="gradient-text">Terms & Attendance</span></h1>
        <p className="text-muted-foreground font-medium text-lg">Track your enrolled subjects and live attendance performance across all 8 terms.</p>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((term) => (
          <Button
            key={term}
            onClick={() => setActiveTerm(term)}
            variant={activeTerm === term ? "default" : "outline"}
            className={cn(
              "px-8 py-6 rounded-2xl font-black text-sm whitespace-nowrap transition-all duration-300 border-2",
              activeTerm === term 
                ? "shadow-lg scale-105 border-primary" 
                : "bg-background/60 text-muted-foreground border-border/60 hover:border-primary/50"
            )}
          >
            Term {term}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const stats = getAttendanceStats(course.id);
            const isDanger = stats.rate < 75 && stats.total > 0;
            return (
              <Link key={course.id} href={`/student/courses/${course.id}`} className="block group">
                <Card className="p-8 h-full border-border/60 shadow-soft group-hover:shadow-strong transition-all overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700 pointer-events-none opacity-50"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                      <BookOpen size={28} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-foreground leading-tight mb-2 tracking-tight group-hover:text-primary transition-colors">{course.name}</h3>
                    <Badge variant="glass" className="w-fit mb-8 text-[11px] font-black tracking-[0.1em] border-primary/20 text-primary">
                      {course.code}
                    </Badge>
                    
                    <div className="mt-auto space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                          <CheckCircle size={14} className={isDanger ? "text-warning" : "text-success"} />
                          Attendance
                        </div>
                        <span className={cn(
                          "text-2xl font-black tracking-tighter",
                          isDanger ? "text-warning" : "text-success"
                        )}>
                          {stats.rate.toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-out",
                            isDanger ? "bg-warning" : "bg-success"
                          )}
                          style={{ width: `${stats.rate}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-[11px] font-black text-muted-foreground uppercase tracking-widest opacity-80">
                        <span>{stats.present}/{stats.total} Classes</span>
                        <span className={cn(isDanger ? "text-warning" : "")}>Target: 75%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <Card className="col-span-full py-24 text-center border-dashed border-2 border-border bg-muted/20">
             <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center mx-auto mb-6 shadow-soft border border-border">
               <AlertCircle size={32} className="text-muted-foreground/40" />
             </div>
             <p className="text-2xl text-foreground font-black tracking-tight mb-2">No Courses Yet</p>
             <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed text-lg">
                Raptor is ready when you are. The syllabus for Term {activeTerm} will appear here when published.
             </p>
          </Card>
        )}
      </div>
    </div>
  );
}
