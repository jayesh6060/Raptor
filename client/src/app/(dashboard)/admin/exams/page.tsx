'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { GraduationCap, Plus, Trash2, Calendar, Clock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Exam } from '@/types/database';

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('60');

  useEffect(() => {
    fetchExams();
  }, []);

  async function fetchExams() {
    const { data } = await supabase.from('exams').select('*').order('date', { ascending: true });
    setExams(data || []);
  }

  const createExam = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('exams').insert({
      title,
      date,
      duration: parseInt(duration)
    }).select();

    if (error) alert(error.message);
    else {
      setShowForm(false);
      fetchExams();
      // Reset form
      setTitle('');
      setDate('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Examinations</h1>
          <p className="text-slate-500">Schedule and manage online MCQ exams.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} />
          Create Exam
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 max-w-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-black text-slate-900 mb-6">Exam Details</h2>
          <form onSubmit={createExam} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 tracking-tight ml-1">Title</label>
              <input 
                required
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Final Exam: DBMS"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 tracking-tight ml-1">Date</label>
                <input 
                  type="date"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 tracking-tight ml-1">Duration (Min)</label>
                <input 
                  type="number"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Save Exam</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-indigo-100 transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <GraduationCap size={24} />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-md">Scheduled</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{exam.title}</h3>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-slate-500">
                  <Calendar size={18} className="text-slate-300" />
                  <span className="text-sm">{new Date(exam.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Clock size={18} className="text-slate-300" />
                  <span className="text-sm">{exam.duration} Minutes</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button className="flex-1 py-2 text-indigo-600 font-bold text-xs hover:bg-indigo-50 rounded-lg transition-colors">Manage Questions</button>
              <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
