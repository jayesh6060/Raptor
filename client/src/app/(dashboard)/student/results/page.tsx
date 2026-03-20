'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Target, Award, ArrowUpRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Submission } from '@/types/database';

export default function StudentResults() {
  const { profile } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!profile?.id) return;
      const { data } = await supabase
        .from('submissions')
        .select('*, exams(title)')
        .eq('student_id', profile.id)
        .order('submitted_at', { ascending: false });
      setSubmissions(data || []);
      setLoading(false);
    }
    fetchResults();
  }, [profile]);

  if (loading) return <div>Loading results...</div>;

  const totalScore = submissions.reduce((acc, curr) => acc + curr.score, 0);
  const totalPossible = submissions.reduce((acc, curr) => acc + curr.total_possible, 0);
  const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Academic Results</h1>
        <p className="text-slate-500">Track your performance across all examinations.</p>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden mb-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic">Keep pushing!</h2>
            <p className="text-indigo-100 font-medium">You&apos;re doing great work this semester.</p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Award size={40} />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-3xl p-8 text-white flex items-center justify-between border shadow-xl shadow-indigo-100">
           <div>
             <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-1">Overall Percentage</p>
             <h3 className="text-4xl font-black">{percentage.toFixed(1)}%</h3>
           </div>
           <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
             <Target size={32} />
           </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Exams Taken</p>
             <h3 className="text-4xl font-black text-slate-900">{submissions.length}</h3>
           </div>
           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
             <Award size={32} />
           </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Points</p>
             <h3 className="text-4xl font-black text-slate-900">{totalScore} <span className="text-slate-300 text-2xl">/ {totalPossible}</span></h3>
           </div>
           <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
             <Trophy size={32} />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <BookOpen className="text-indigo-600" size={24} />
             Detailed Breakdown
           </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Exam Name</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Score</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Submitted</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => {
                const subPercentage = (sub.score / sub.total_possible) * 100;
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900">
                      {sub.exams?.title}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-900">{sub.score} / {sub.total_possible}</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              subPercentage >= 75 ? "bg-emerald-500" : subPercentage >= 40 ? "bg-amber-500" : "bg-red-500"
                            )} 
                            style={{ width: `${subPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm border",
                          subPercentage >= 40 ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"
                        )}>
                          {subPercentage >= 40 ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <ArrowUpRight size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
