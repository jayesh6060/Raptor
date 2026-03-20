'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, Users, Search, Filter, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminExamResults() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchAllSubmissions() {
      const { data } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles(name, email),
          exams(title)
        `)
        .order('submitted_at', { ascending: false });
      setSubmissions(data || []);
      setLoading(false);
    }
    fetchAllSubmissions();
  }, []);

  const filtered = submissions.filter(s => 
    s.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.exams?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <button onClick={() => router.back()} className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
             <ArrowLeft size={20} />
           </button>
           <div>
             <h1 className="text-3xl font-black text-slate-900">Exam Submissions</h1>
             <p className="text-slate-500">Monitor student performance and review scores.</p>
           </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Submissions</p>
             <h3 className="text-4xl font-black text-slate-900">{submissions.length}</h3>
           </div>
           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Users size={32} />
           </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Pass Rate (Avg)</p>
             <h3 className="text-4xl font-black text-slate-900">78%</h3>
           </div>
           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Trophy size={32} />
           </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by student or exam..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Examination</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((sub) => {
              const perc = (sub.score / sub.total_possible) * 100;
              return (
                <tr key={sub.id} className="hover:bg-slate-50/50 group transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {sub.profiles?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{sub.profiles?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{sub.profiles?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-700 font-semibold">{sub.exams?.title}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col items-center">
                       <span className={cn(
                         "font-black text-lg",
                         perc >= 75 ? "text-emerald-500" : perc >= 40 ? "text-amber-500" : "text-red-500"
                       )}>
                         {sub.score} / {sub.total_possible}
                       </span>
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{perc.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-400 text-sm">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                      <ExternalLink size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
