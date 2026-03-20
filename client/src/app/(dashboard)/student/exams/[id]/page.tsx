'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Exam } from '@/types/database';

export default function TakeExam() {
  const { id } = useParams();
  const { profile } = useAuth();
  const router = useRouter();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: examData } = await supabase.from('exams').select('*').eq('id', id).single();
      const { data: qData } = await supabase.from('questions').select('*').eq('exam_id', id);
      
      setExam(examData);
      setQuestions(qData || []);
      setTimeLeft((examData?.duration || 60) * 60);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0 || completed) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, completed]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) score += 1;
    });

    const { error } = await supabase.from('submissions').insert({
      student_id: profile?.id,
      exam_id: id,
      score,
      total_possible: questions.length
    });

    if (error) alert(error.message);
    else setCompleted(true);
    setSubmitting(false);
  };

  if (loading) return <div>Loading exam...</div>;

  if (completed) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-100 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Exam Submitted Successfully!</h1>
          <p className="text-slate-500 mt-2 text-lg">Your responses have been recorded and auto-evaluated.</p>
        </div>
        <button onClick={() => router.push('/student/results')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all">
          View My Results
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between sticky top-20 bg-slate-50/80 backdrop-blur-md py-4 z-20">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{exam?.title}</h1>
          <div className="flex items-center gap-4 mt-1">
             <span className="text-xs font-bold text-slate-400 uppercase">Question {currentIndex + 1} of {questions.length}</span>
             <div className="w-40 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
             </div>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xl shadow-sm border",
          timeLeft < 300 ? "bg-red-50 border-red-100 text-red-600 animate-pulse" : "bg-white border-slate-100 text-slate-700"
        )}>
          <Clock size={24} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 leading-snug">
            {currentQ?.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQ?.options.map((option: string) => (
              <button
                key={option}
                onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: option }))}
                className={cn(
                  "p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                  answers[currentQ.id] === option 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-4 ring-indigo-500/5 shadow-lg shadow-indigo-100" 
                    : "border-slate-50 bg-slate-50 hover:border-slate-200 text-slate-600"
                )}
              >
                <span className="font-bold text-lg">{option}</span>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  answers[currentQ.id] === option ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-slate-400"
                )}>
                  {answers[currentQ.id] === option && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button 
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="px-8 py-3 text-slate-400 font-bold hover:text-slate-900 disabled:opacity-0 transition-all"
        >
          Previous
        </button>
        
        {currentIndex === questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={24} /> : 'Final Submit'}
          </button>
        ) : (
          <button 
            disabled={!answers[currentQ?.id]}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group"
          >
            Next Question
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
