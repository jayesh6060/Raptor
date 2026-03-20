'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      const pathname = window.location.pathname;
      
      if (profile) {
        // RBAC Redirection
        if ((profile.role === 'admin' || profile.role === 'teacher') && pathname.startsWith('/student')) {
          router.push('/admin/dashboard');
        } else if (profile.role === 'student' && pathname.startsWith('/admin')) {
          router.push('/student/dashboard');
        }
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-64">
        <Navbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
