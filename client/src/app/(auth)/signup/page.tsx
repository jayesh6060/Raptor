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
  const [usn, setUsn] = useState('');
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

    if (role === 'student') {
      const usnFormat = /^[1-9][a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{3}$/i;
      const formattedUsn = usn.trim().toUpperCase();
      
      if (!usnFormat.test(formattedUsn)) {
        setError('Invalid USN format. Example: 1RV20CS001');
        setLoading(false);
        return;
      }

      // Check if email is explicitly allowed by the Admin.
      // (Commented out during development so you can test signups freely)
      /* 
      const { data: allowedEmail, error: allowedError } = await supabase
        .from('allowed_emails')
        .select('*')
        .eq('email', email.trim())
        .single();

      if (allowedError || !allowedEmail) {
        setError('Verification failed. Your email has not been authorized by the administration. Please contact the admin to gain access.');
        setLoading(false);
        return;
      }
      */
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          role: role, // Dynamically set role
          usn: role === 'student' ? usn.trim().toUpperCase() : null,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Forcefully create the profile fallback over frontend in case the SQL trigger drops out
    if (data?.user) {
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        name: fullName,
        email: email,
        role: role,
        usn: role === 'student' ? usn.trim().toUpperCase() : null,
      }, { onConflict: 'id' });
      
      if (upsertError) {
        // Use console.warn instead of console.error to prevent Next.js dev overlay from showing up
        console.warn('Silent upsert error:', upsertError);
      }
    }

    // If Supabase has "Confirm Email" disabled, data.session WILL exist here!
    if (data?.session) {
      if (role === 'admin' || role === 'teacher') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
      return;
    }

    // Since we want to ensure a profile is created even if they haven't verified yet,
    // we can use a Supabase Edge Function or Trigger.
    // For this implementation, we inform them to check their email.
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl shadow-indigo-100 dark:shadow-none p-10 border border-slate-100 dark:border-slate-800 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Verify your Email</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
                We&apos;ve sent a magic link to <span className="font-bold text-slate-900 dark:text-white">{email}</span>. 
                Please click the link to activate your student account.
            </p>
            <div className="pt-4 flex flex-col gap-4">
                <Link href="/login" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Go to Login
                </Link>
                <button 
                    onClick={handleResend} 
                    disabled={resending}
                    className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 py-12 transition-colors duration-500">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none p-10 border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Join the student community today</p>
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
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium dark:text-slate-200"
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
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium dark:text-slate-200"
                placeholder="student@raptor.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {role === 'student' && (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">USN Number</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium uppercase dark:text-slate-200"
                  placeholder="1RV20CS001"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter px-2 mt-1">Required for student verification</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="password"
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium dark:text-slate-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter px-2 mt-1">Minimum 6 characters required</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Joining as a</label>
            <div className="grid grid-cols-2 gap-2">
              {(['student', 'teacher'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "py-3 rounded-2xl border-2 text-xs font-bold capitalize transition-all",
                    role === r 
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm" 
                      : "border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
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
