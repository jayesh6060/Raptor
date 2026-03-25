'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExamQuestions() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New question form state
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    async function fetchData() {
      const { data: examData } = await supabase.from('exams').select('*').eq('id', id).single();
      const { data: qData } = await supabase.from('questions').select('*').eq('exam_id', id);
      setExam(examData);
      setQuestions(qData || []);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const addQuestion = async () => {
    if (!question || options.some(o => !o) || !correctAnswer) {
      alert('Please fill all fields and select correct answer');
      return;
    }

    const { data, error } = await supabase.from('questions').insert({
      exam_id: id,
      question,
      options,
      correct_answer: correctAnswer
    }).select();

    if (error) alert(error.message);
    else {
      setQuestions([...questions, data[0]]);
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
    }
  };

  const deleteQuestion = async (qId: string) => {
    await supabase.from('questions').delete().eq('id', qId);
    setQuestions(questions.filter(q => q.id !== qId));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={20} />
        Back to Exams
      </button>

      <div>
        <h1 className="text-3xl font-black text-slate-900">{exam?.title}</h1>
        <p className="text-slate-500">Manage questions for this examination.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Plus className="text-indigo-600" size={20} />
            Add New Question
        </h2>
        
        <div className="space-y-4">
          <textarea 
            placeholder="Type your question here..."
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none h-24"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <input 
                  type="radio" 
                  name="correct" 
                  checked={correctAnswer === opt && opt !== ''}
                  onChange={() => setCorrectAnswer(opt)}
                  className="w-4 h-4 text-indigo-600"
                />
                <input 
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-transparent text-sm outline-none"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[i] = e.target.value;
                    setOptions(newOpts);
                  }}
                />
              </div>
            ))}
          </div>

          <button 
            onClick={addQuestion}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Add Question to Exam
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Current Questions ({questions.length})</h2>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-4 flex-1">
                  <h4 className="font-bold text-slate-800 text-lg">
                    <span className="text-indigo-600 border-b-2 border-indigo-100 mr-2">Q{idx + 1}</span>
                    {q.question}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt: string) => (
                      <div key={opt} className={cn(
                        "p-3 rounded-xl border text-sm flex items-center justify-between",
                        q.correct_answer === opt ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-500"
                      )}>
                        {opt}
                        {q.correct_answer === opt && <CheckCircle2 size={16} />}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => deleteQuestion(q.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
