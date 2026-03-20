'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, Loader2, CheckCircle2, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [role, setRole] = useState<'student' | 'admin' | 'teacher'>('student');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          role: role, // Dynamically set role
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Since we want to ensure a profile is created even if they haven't verified yet,
    // we can use a Supabase Edge Function or Trigger. 
    // For this implementation, we inform them to check their email.
    // The profile creation will be handled by a trigger (ideally) 
    // or on first login in our DashboardLayout.

    setSuccess(true);
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setResending(false);
    alert('Verification email resent!');
  };

  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl shadow-indigo-100 p-10 border border-slate-100 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">Verify your Email</h1>
            <p className="text-slate-500 text-lg">
                We&apos;ve sent a magic link to <span className="font-bold text-slate-900">{email}</span>. 
                Please click the link to activate your student account.
            </p>
            <div className="pt-4 flex flex-col gap-4">
                <Link href="/login" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Go to Login
                </Link>
                <button 
                    onClick={handleResend} 
                    disabled={resending}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {resending ? <Loader2 className="animate-spin" size={20} /> : 'Resend Verification Email'}
                </button>
                <button onClick={() => setSuccess(false)} className="text-sm font-bold text-slate-400 hover:text-slate-600">
                    Entered the wrong email?
                </button>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-4">
                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider leading-relaxed">
                    Note: Supabase Free Tier permits only 3 emails per hour. If you don&apos;t see the email, please check your spam or try again later.
                  </p>
                </div>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2 font-medium">Join the student community today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full shrink-0"></span>
                {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="password"
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter px-2 mt-1">Minimum 6 characters required</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Joining as a</label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "py-3 rounded-2xl border-2 text-xs font-bold capitalize transition-all",
                    role === r 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm" 
                      : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Create Account
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-sm font-bold text-slate-400">
          Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-700 transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
