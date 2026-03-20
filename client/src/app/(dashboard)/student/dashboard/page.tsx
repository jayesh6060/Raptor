'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Award, 
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [overallAttendance, setOverallAttendance] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      if (!profile?.id) return;
      
      // Fetch ALL Attendance for rate calculation
      const { data: allAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', profile.id);
      
      const present = allAttendance?.filter(a => a.status === 'present').length || 0;
      const total = allAttendance?.length || 0;
      setOverallAttendance(total > 0 ? (present / total) * 100 : 0);

      // Fetch Recent Attendance for list
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', profile.id)
        .order('date', { ascending: false })
        .limit(5);
      setAttendance(attendanceData || []);

      // Fetch Course Count
      const { count } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      setCourseCount(count || 0);
    }
    fetchData();
  }, [profile]);

  const stats = [
    { label: 'Attendance', value: `${overallAttendance.toFixed(0)}%`, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Exams', value: '2', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Courses', value: courseCount.toString(), icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/student/courses' },
    { label: 'GPA', value: '3.8', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Welcome back, {profile?.name}!</h1>
          <p className="text-indigo-100 mt-2 max-w-md">Continue your learning journey. You have 2 exams scheduled for this week.</p>
          <button className="mt-6 px-6 py-2 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
            View Schedule
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const CardContent = (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-full hover:shadow-md transition-shadow">
              <div className={cn("p-2 rounded-lg w-fit mb-4", stat.bg, stat.color)}>
                <Icon size={20} />
              </div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          );

          if (stat.href) {
            return (
              <Link key={stat.label} href={stat.href}>
                {CardContent}
              </Link>
            );
          }

          return <div key={stat.label}>{CardContent}</div>;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Attendance</h2>
          <div className="space-y-4">
            {attendance.length > 0 ? (
              attendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    {record.status === 'present' ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{record.subject}</p>
                      <p className="text-xs text-slate-500">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-tight",
                    record.status === 'present' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}>
                    {record.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-8">No recent records found.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden relative">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Upcoming Exams</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex gap-4 p-4 rounded-xl border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-600 flex-shrink-0 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                    <span className="text-xs font-bold">MAR</span>
                    <span className="text-lg font-black leading-none">{19 + i}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">Final Exam: DBMS</h4>
                    <p className="text-xs text-slate-500 mt-1">Duration: 60 Minutes • 10:00 AM</p>
                  </div>
                  <button className="self-center p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
