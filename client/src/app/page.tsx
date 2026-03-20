'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2, 
  BookOpen, 
  ClipboardCheck, 
  ShieldCheck,
  Users,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-20 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">CollegeERP</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#about" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">About</a>
          <div className="h-6 w-px bg-slate-200"></div>
          <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-indigo-600">Log In</Link>
          <Link href="/signup" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 lg:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Next Generation ERP</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Manage your <span className="text-indigo-600">College Life</span> with Elegance.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
              An all-in-one platform for students and instructors. Attendance tracking, MCQ examinations, and resource management—all in one beautiful interface.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[20px] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                Join as a Student
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-[20px] font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
                Portal Login
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-slate-400">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">
                     {String.fromCharCode(64 + i)}
                   </div>
                 ))}
               </div>
               <p className="text-sm font-medium"><span className="text-slate-900 font-bold">500+</span> Students actively using the platform</p>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="aspect-square bg-indigo-600/5 rounded-full absolute -top-20 -right-20 blur-3xl w-[120%] animate-pulse"></div>
             <div className="relative bg-white p-4 rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100 transform rotate-2">
                <div className="bg-slate-900 rounded-[32px] overflow-hidden aspect-video relative">
                   {/* Mock UI Element */}
                   <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                         <div className="space-y-2">
                            <div className="w-24 h-2 bg-indigo-500 rounded-full"></div>
                            <div className="w-40 h-2 bg-slate-700 rounded-full"></div>
                         </div>
                         <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                            <Layout className="text-white" size={24} />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="h-24 bg-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                               <CheckCircle2 size={16} />
                            </div>
                            <div className="w-12 h-2 bg-slate-600 rounded-full"></div>
                         </div>
                         <div className="h-24 bg-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                               <BookOpen size={16} />
                            </div>
                            <div className="w-12 h-2 bg-slate-600 rounded-full"></div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Everything you need to <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Succeed</span>.</h2>
            <p className="text-lg text-slate-500">From enrollment to graduation, we&apos;ve automated the heavy lifting so you can focus on learning.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Digital Attendance', desc: 'Secure, real-time presence tracking with subject-wise breakdown for students.', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { title: 'MCQ Examinations', titleFull: 'Automated Exams', desc: 'Attempt complex MCQ exams with instant auto-evaluation and score reports.', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Cloud Resources', desc: 'Access study materials and PDFs uploaded by your professors from anywhere.', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
              { title: 'Analytics Dashboard', desc: 'Detailed insights and GPA tracking to monitor academic performance.', icon: Layout, color: 'text-rose-600', bg: 'bg-rose-50' },
              { title: 'Secure Access', desc: 'Role-based security ensuring data privacy for every student and admin.', icon: ShieldCheck, color: 'text-slate-900', bg: 'bg-slate-100' },
              { title: 'Directory', desc: 'Unified student directory for administrative management and reporting.', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-slate-50 rounded-[40px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 transition-all duration-300">
                <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-[20px] mb-8 shadow-sm group-hover:scale-110 transition-transform", f.bg, f.color)}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 lg:px-20 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={18} />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">CollegeERP</span>
          </div>
          <div className="flex gap-10 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
          <p className="text-sm font-medium text-slate-400">© 2026 Advanced College ERP System. Built with Antigravity.</p>
        </div>
      </footer>
    </div>
  );
}
