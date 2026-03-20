'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Trophy, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeExams: 0,
    totalNotes: 0,
    avgAttendance: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
      const { count: examCount } = await supabase.from('exams').select('*', { count: 'exact', head: true });
      const { count: notesCount } = await supabase.from('notes').select('*', { count: 'exact', head: true });

      setStats({
        totalStudents: studentCount || 0,
        activeExams: examCount || 0,
        totalNotes: notesCount || 0,
        avgAttendance: 85 // Mocked for now
      });
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Exams', value: stats.activeExams, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Notes', value: stats.totalNotes, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500">Welcome to your management dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", card.bg, card.color)}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  +12%
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
            <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-medium">New student record created for Marks Spencer</p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago • Student Management</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl border border-slate-100 transition-colors text-left px-4 flex items-center justify-between">
              Upload New Notes
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md">New</span>
            </button>
            <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl border border-slate-100 transition-colors text-left px-4 flex items-center justify-between">
              Create MCQ Exam
            </button>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all text-center">
              Mark Today&apos;s Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

