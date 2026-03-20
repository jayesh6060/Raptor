'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  GraduationCap, 
  ClipboardList, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/attendance', label: 'Attendance', icon: Calendar },
  { href: '/admin/notes', label: 'Notes', icon: FileText },
  { href: '/admin/exams', label: 'Exams', icon: GraduationCap },
  { href: '/admin/exams/results', label: 'Results', icon: ClipboardList },
];

const studentLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/attendance', label: 'Attendance', icon: Calendar },
  { href: '/student/notes', label: 'Notes', icon: FileText },
  { href: '/student/exams', label: 'Exams', icon: GraduationCap },
  { href: '/student/results', label: 'Results', icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const role = (profile?.role as 'admin' | 'student') || 'student';
  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-400">CollegeERP</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
