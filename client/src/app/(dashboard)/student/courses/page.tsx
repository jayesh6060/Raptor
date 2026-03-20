'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Calendar, CheckCircle, Percent, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Course, Attendance } from '@/types/database';

export default function StudentCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!profile?.id) return;
      
      const [coursesRes, attendanceRes] = await Promise.all([
        supabase.from('courses').select('*').order('name'),
        supabase.from('attendance').select('*').eq('student_id', profile.id)
      ]);

      setCourses(coursesRes.data || []);
      setAttendance(attendanceRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getAttendanceStats = (courseName: string) => {
    const relevant = attendance.filter(a => a.subject === courseName);
    const present = relevant.filter(a => a.status === 'present').length;
    const total = relevant.length;
    const rate = total > 0 ? (present / total) * 100 : 0;
    return { present, total, rate };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">My Courses</h1>
        <p className="text-slate-500">View your enrolled subjects and attendance performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => {
            const stats = getAttendanceStats(course.name);
            return (
              <div key={course.id} className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 hover:-translate-y-1 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
                    <BookOpen size={28} />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{course.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Subject Code: {course.code}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                        <CheckCircle size={14} className="text-emerald-500" />
                        Attendance
                      </div>
                      <span className={cn(
                        "text-lg font-black",
                        stats.rate >= 75 ? "text-emerald-600" : "text-amber-600"
                      )}>
                        {stats.rate.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          stats.rate >= 75 ? "bg-emerald-500" : "bg-amber-500"
                        )}
                        style={{ width: `${stats.rate}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tight">
                      <span>{stats.present}/{stats.total} Classes</span>
                      <span>Target: 75%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
             <AlertCircle size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold">No courses available in the system yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
