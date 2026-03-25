'use client';
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && mounted) {
      if (!user) {
        router.push('/login');
        return;
      }

      const pathname = window.location.pathname;

      if (profile) {
        // Allow shared routes like /profile
        if (pathname === '/profile') return;

        // RBAC Redirection
        if ((profile.role === 'admin' || profile.role === 'teacher') && pathname.startsWith('/student')) {
          router.push('/admin/dashboard');
        } else if (profile.role === 'student' && pathname.startsWith('/admin')) {
          router.push('/student/dashboard');
        }
      }
    }
  }, [user, profile, loading, router, mounted]);

  // Determine if we should show the heavy loading screen
  const showHeavyLoader = mounted && loading && !user;

  if (showHeavyLoader) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#fbfbfb] relative overflow-hidden transition-opacity duration-300">
        <div className="scan-effect" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-strong mb-10 relative group">
            <div className="absolute inset-0 bg-indigo-600 rounded-2xl animate-ping opacity-20" />
            <Zap size={32} className="text-white relative z-10" fill="currentColor" />
          </div>
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[10px] font-black txt-future text-indigo-600 tracking-[0.3em]">INITIALIZING</span>
              <span className="text-[10px] font-black font-brand text-slate-900 tracking-widest">RAPTOR NODE</span>
            </div>
            <div className="tactical-loader-bg mx-auto">
              <div className="tactical-loader-fill" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated and done loading, redirect to login (handled by useEffect)
  if (!loading && !user && mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-500 flex">
      {/* Sidebar remains fixed/absolute as defined in its component */}
      <Sidebar />
      <div className="flex-1 pl-80 pr-10">
        <Navbar />
        <div className="max-w-[1700px] mx-auto">
          <main
            className={cn(
              "p-8 pb-32 transition-all duration-700 ease-out",
              (!mounted) ? 'opacity-50 blur-[2px]' : (loading ? 'opacity-80' : 'opacity-100')
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
