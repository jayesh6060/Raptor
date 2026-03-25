'use client';
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronRight,
  Zap,
  Shield,
  Activity,
  ClipboardCheck,
  BookOpen,
  Users,
  Layout,
  ArrowRight,
  Cpu,
  Globe,
  Lock
} from 'lucide-react';
import { motion as _motion, AnimatePresence } from 'framer-motion';
const motion: any = _motion;
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

function FloatingShard({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -20, 0],
        rotate: [0, 2, 0]
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 8, repeat: Infinity, ease: "easeInOut", delay }
      }}
      className={cn("glass-shard rounded-3xl p-6 absolute pointer-events-none z-20 hidden lg:block", className)}
    >
      {children}
    </motion.div>
  );
}

function FloatingNode({ label, x, y, delay }: { label: string, x: string, y: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [1, 1.1, 1],
        x: [0, 10, 0],
        y: [0, -10, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      style={{ left: `calc(50% + ${x})`, top: `calc(50% + ${y})` }}
      className="absolute z-30 flex flex-col items-center gap-2"
    >
      <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
      <span className="text-[8px] font-black txt-future text-indigo-600/80 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full border border-indigo-500/20 backdrop-blur-sm whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  );
}

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const features = [
    { title: 'Predictive Attendance', desc: 'Secure tracking with intelligent anomaly detection.', icon: ClipboardCheck, color: 'text-indigo-600' },
    { title: 'Assessment Hub', desc: 'Automated evaluation pipelines for faster insights.', icon: Zap, color: 'text-indigo-600' },
    { title: 'Knowledge Vault', desc: 'Personalized study resources synced across devices.', icon: BookOpen, color: 'text-indigo-600' },
    { title: 'Growth Analytics', desc: 'Visual progress mapping and GPA forecasting.', icon: Activity, color: 'text-indigo-600' },
    { title: 'Shield Protocol', desc: 'End-to-end encryption for all sensitive records.', icon: Shield, color: 'text-indigo-600' },
    { title: 'Human Directory', desc: 'Intuitive management of the entire academic community.', icon: Users, color: 'text-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-100 font-sans overflow-x-hidden transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center px-6 md:px-12 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 pr-6 border-r border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-widest font-brand text-indigo-600">Raptor</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black txt-future text-emerald-600 dark:text-emerald-400">NODE 01 ONLINE</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] font-brand">{item}</a>
            ))}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="w-4 h-4" />
              ) : theme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <Link href="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors font-brand tracking-widest uppercase">Login</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-strong hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">
              <span className="txt-future text-[10px]">INITIALIZE</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 px-6 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div
          className="absolute w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto text-center relative z-10 w-full"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-12 group hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-default">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] txt-future text-indigo-600 font-black tracking-widest">RAPTOR CORE — v4.2.0 RELEASED</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-8xl md:text-[160px] font-black tracking-[-0.01em] leading-[0.85] mb-20 text-slate-950 dark:text-white font-brand uppercase relative drop-shadow-2xl"
          >
            Raptor
            <div className="absolute inset-0 blur-[60px] opacity-20 select-none pointer-events-none text-indigo-500/30">Raptor</div>
          </motion.h1>

          <div className="max-w-3xl mx-auto space-y-8">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-medium text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Built for Humans. <br /> <span className="txt-reveal font-black uppercase tracking-widest font-brand">Powered by Precision.</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              A minimalist ecosystem designed to think ahead. Intuitive tools for students and faculty, delivered with technical excellence and surgical clarity.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8">
            <Link href="/signup" className="group h-16 px-12 bg-indigo-600 text-white rounded-[24px] font-bold shadow-strong hover:bg-indigo-700 transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center gap-4 text-sm font-brand tracking-[0.2em]">
              <span>INITIALIZE SETUP</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="h-16 px-12 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-[24px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.95] flex items-center gap-4 text-sm font-brand tracking-[0.2em]">
              <span>MEMBER LOGIN</span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-28 max-w-5xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbfbfb] via-transparent to-transparent z-10"></div>
            <div className="rounded-[44px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 p-2 scale-95 opacity-80 group-hover:scale-100 group-hover:opacity-100 transition-all duration-1000">
              <div className="aspect-video bg-slate-50 rounded-[36px] overflow-hidden relative">
                <img
                  src="/dashboard_preview.png"
                  alt="Raptor Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CORE EXPERIENCE GRID */}
      <section id="features" className="py-32 px-6 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] txt-future text-slate-400 mb-4 block">System Architecture</span>
            <h3 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter mb-4">Core Ecosystem</h3>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">A unified framework designed to simplify the complexities of modern academic management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group p-10 rounded-[32px] hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-200">
                <div className={cn("inline-flex items-center gap-2 mb-8 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl shadow-soft border border-slate-100 dark:border-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition-all", feature.color)}>
                  <feature.icon size={20} />
                  <span className="text-[9px] txt-future opacity-70">Active</span>
                </div>
                <h4 className="text-2xl font-bold text-slate-950 dark:text-white mb-4 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase font-brand">{feature.title}</h4>
                <p className="text-slate-500 text-base font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-[1.1] font-brand uppercase">
              Experience the Cleanest <br /> Interface in Academia.
            </h3>
            <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed">
              We've removed the noise to focus on what matters. Raptor provides a clutter-free environment that maximizes productivity for both students and administrators.
            </p>
            <div className="space-y-6">
              {[
                'Fast Performance with zero lag.',
                'Simple Interface designed for clarity.',
                'Reliable System built on modern infrastructure.',
                'Designed for the Next Generation.'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 font-bold txt-future text-[11px] uppercase tracking-wider">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-[48px] blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>

            {/* Futuristic About Visual */}
            <div className="relative w-full h-full flex items-center justify-center p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[48px] shadow-2xl overflow-hidden group/about">
              {/* Background Grid/Particles */}
              <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-[grid-white_1.5rem_1.5rem] dark:bg-[grid-slate-800_1.5rem_1.5rem]"></div>

              {/* Rotating Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[400px] h-[400px] border border-indigo-500/20 rounded-full border-dashed"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-[300px] h-[300px] border border-indigo-400/30 rounded-full border-dashed"
              />

              {/* Core Pulsing Orb */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] mb-8"
                >
                  <Cpu size={48} className="text-white animate-pulse" />
                </motion.div>

                <div className="text-center space-y-2">
                  <h4 className="text-sm font-black txt-future text-indigo-600 uppercase tracking-[0.3em]">System Core v4.2</h4>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto"></div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 max-w-xs leading-relaxed">
                    "Autonomous Academic Operating System. Designed for surgical precision and seamless human-node interaction."
                  </p>
                </div>
              </div>

              {/* Floating Data Points */}
              <FloatingNode delay={0} x="-30%" y="-20%" label="E2E ENCRYPTION" />
              <FloatingNode delay={1} x="35%" y="-35%" label="NODE 01 ACTIVE" />
              <FloatingNode delay={2} x="-25%" y="30%" label="SURGICAL CLARITY" />
              <FloatingNode delay={3} x="30%" y="25%" label="99.9% UPTIME" />

              {/* Scanning Line Effect */}
              <motion.div
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-20"
              />
            </div>
          </div>
        </div>
      </section>       {/* GALLERY / MODERN CAMPUS SECTION */}
      <section className="py-32 px-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[48px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative aspect-[21/9] group flex items-center justify-center bg-slate-950">
            {/* Futuristic Network Visual */}
            <div className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-[grid-white_2rem_2rem]"></div>

            <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
              {/* Glowing Globe / Network Center */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Globe size={180} className="text-indigo-500/20 blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
                </div>
              </motion.div>

              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <motion.path
                  d="M 200 100 Q 400 50 600 150"
                  stroke="url(#grad)" strokeWidth="1" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M 800 200 Q 600 300 400 250"
                  stroke="url(#grad)" strokeWidth="1" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Data Tags */}
              <div className="absolute top-1/4 left-1/4">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-indigo-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                  <span className="text-[9px] font-black txt-future text-indigo-400">LATENCY: 08ms</span>
                </div>
              </div>
              <div className="absolute bottom-1/3 right-1/4">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black txt-future text-emerald-400">34.5k NODES SYNCED</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-12">
              <div className="text-white max-w-2xl relative z-20">
                <h3 className="text-3xl font-black tracking-tight mb-2 font-brand uppercase tracking-widest">Designed for High-Performance Learning.</h3>
                <p className="text-slate-200 font-medium">Raptor integrates seamlessly with the modern academic environment, providing surgical clarity for every student node.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-3xl mx-auto p-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-10 font-brand uppercase leading-tight relative z-10">
            Start managing your campus <br /> with Raptor.
          </h2>
          <Link href="/signup" className="inline-flex items-center gap-4 px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-bold hover:bg-indigo-700 transition-all group/cta relative z-10 shadow-strong hover:scale-105 active:scale-95 text-sm font-brand tracking-widest">
            GET STARTED TODAY <ChevronRight size={18} className="group-hover/cta:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-[0.3em] font-brand text-indigo-600 uppercase">Raptor</span>
            </div>
            <p className="text-sm font-medium text-slate-400 txt-future uppercase tracking-widest">Built for smarter campuses.</p>
          </div>

          <div className="flex gap-12">
            {['Features', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors font-brand">{item}</a>
            ))}
          </div>

          <p className="text-[10px] font-bold text-slate-400 txt-future uppercase tracking-widest">© 2026 Raptor System v4.2. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
