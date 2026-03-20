'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, CheckCircle2, XCircle, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Attendance } from '@/types/database';

export default function StudentAttendance() {
  const { profile } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      if (!profile?.id) return;
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', profile.id)
        .order('date', { ascending: false });
      setAttendance(data || []);
      setLoading(false);
    }
    fetchAttendance();
  }, [profile]);

  if (loading) return <div>Loading records...</div>;

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const rate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Attendance</h1>
          <p className="text-slate-500">A detailed log of your class presence.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <Calendar size={20} />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Attendance Rate</p>
               <p className="text-xl font-black text-slate-900">{rate.toFixed(0)}%</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 overflow-hidden relative">
        <div className="flex items-center justify-between mb-10">
           <h3 className="text-xl font-black text-slate-900">History Log</h3>
           <div className="flex gap-2">
              <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"><ChevronLeft size={20} /></button>
              <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"><ChevronRight size={20} /></button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendance.length > 0 ? attendance.map((record) => (
            <div key={record.id} className="group p-6 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-6">
                 <div className="p-3 bg-white rounded-2xl shadow-sm">
                    {record.status === 'present' ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                 </div>
                 <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    record.status === 'present' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                 )}>
                   {record.status}
                 </span>
              </div>
              
              <h4 className="text-lg font-bold text-slate-900">{record.subject}</h4>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Calendar size={14} />
                {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
              <AlertCircle size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">No records found for your account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
