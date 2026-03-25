'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, GraduationCap, Award, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function AccountSetup({ userId, email, userMetadata }: { userId: string, email: string, userMetadata?: any }) {
  const { signOut } = useAuth();
  const [fullName, setFullName] = useState(userMetadata?.full_name || '');
  const [role, setRole] = useState<'student' | 'teacher'>(userMetadata?.role === 'teacher' ? 'teacher' : 'student');
  const [usn, setUsn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: userId,
        name: fullName.trim(),
        email: email,
        role: role,
        usn: role === 'student' ? usn.trim().toUpperCase() : null,
      }, { onConflict: 'id' });

      if (upsertError) {
        console.error('AccountSetup Error:', upsertError);
        setError(upsertError.message);
        setLoading(false);
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      console.error('AccountSetup Catch:', err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100/50 p-10 border border-slate-100 flex flex-col gap-8 relative overflow-hidden text-slate-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 z-0" />
        
        <div className="relative z-10 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-2">
            <User size={40} />
          </div>
          <h1 className="text-3xl font-black leading-tight text-slate-900">Complete your Account</h1>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
             Hello <span className="text-indigo-600 font-bold">{email}</span>! Please provide your name and role to finish setting up your portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Account)</label>
              <div className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400">
                {email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 flex justify-between items-center">
                <span>••••••••</span>
                <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified \u0026 Secure</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                placeholder="e.g. Dr. Jordan Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">I am a</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all group",
                  role === 'student' 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  role === 'student' ? "bg-indigo-600 text-white" : "bg-white text-slate-400"
                )}>
                  <GraduationCap size={24} />
                </div>
                <span className="font-bold">Student</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all group",
                  role === 'teacher' 
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm" 
                    : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  role === 'teacher' ? "bg-emerald-600 text-white" : "bg-white text-slate-400"
                )}>
                  <Award size={24} />
                </div>
                <span className="font-bold">Teacher</span>
              </button>
            </div>
          </div>

          {role === 'student' && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">USN Number</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all placeholder:text-slate-300 uppercase"
                placeholder="1RV20CS001"
                value={usn}
                onChange={(e) => setUsn(e.target.value.toUpperCase())}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !fullName}
            className="w-full py-5 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Finalize Setup
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={signOut}
            className="w-full text-slate-400 text-xs font-bold hover:text-red-500 transition-colors"
          >
            Sign Out & Switch Account
          </button>
        </form>
      </div>
    </div>
  );
}
