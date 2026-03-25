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
  LogOut,
  Building,
  User,
  CreditCard,
  BookOpen,
  Info,
  Zap,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface NavItems {
  General: NavItem[];
  Academics: NavItem[];
  Account: NavItem[];
}

export function Sidebar() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname() || '';
  const { profile, signOut } = useAuth();
  const role = profile?.role || 'student';
  
  const isActive = (path: string) => pathname.startsWith(path);

  const NAV_ITEMS: NavItems = {
    General: [],
    Academics: [],
    Account: [],
  };

  if (role === 'admin') {
    NAV_ITEMS.General = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Courses', path: '/admin/courses', icon: BookOpen },
      { name: 'Students', path: '/admin/students', icon: Users },
    ];
    NAV_ITEMS.Academics = [
      { name: 'Attendance', path: '/admin/attendance', icon: Calendar },
      { name: 'Notes', path: '/admin/notes', icon: FileText },
      { name: 'Exams', path: '/admin/exams', icon: GraduationCap },
      { name: 'Results', path: '/admin/exams/results', icon: ClipboardList },
    ];
    NAV_ITEMS.Account = [
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'About', path: '/about', icon: Info },
    ];
  } else if (role === 'teacher') {
    NAV_ITEMS.General = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'My Courses', path: '/admin/courses', icon: BookOpen },
      { name: 'Students', path: '/admin/students', icon: Users },
    ];
    NAV_ITEMS.Academics = [
      { name: 'Attendance', path: '/admin/attendance', icon: Calendar },
      { name: 'Notes', path: '/admin/notes', icon: FileText },
      { name: 'Exams', path: '/admin/exams', icon: GraduationCap },
    ];
    NAV_ITEMS.Account = [
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'About', path: '/about', icon: Info },
    ];
  } else { // student
    NAV_ITEMS.General = [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Campus', path: '/student/campus', icon: Building },
    ];
    NAV_ITEMS.Academics = [
      { name: 'Courses', path: '/student/courses', icon: BookOpen },
      { name: 'Exams', path: '/student/exams', icon: GraduationCap },
    ];
    NAV_ITEMS.Account = [
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Payments', path: '/student/payments', icon: CreditCard },
      { name: 'About', path: '/about', icon: Info },
    ];
  }

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-64 bg-white dark:bg-slate-900 rounded-[32px] text-slate-900 dark:text-slate-100 flex flex-col z-50 border border-slate-100 dark:border-slate-800 shadow-soft transition-all duration-500">
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-4 mb-12 px-6 group cursor-pointer">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-strong shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Zap size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-indigo-600 font-brand uppercase leading-none group-hover:text-indigo-500 transition-colors">RAPTOR</h1>
          <p className="text-[12px] font-bold text-slate-400 dark:text-slate-500 txt-future tracking-[0.2em] mt-1.5">SYSTEM 4.0</p>
        </div>
      </Link>

      {/* Navigation Section */}
      <div className="flex-1 space-y-10 px-4 overflow-y-auto hide-scrollbar">
        {mounted && (Object.keys(NAV_ITEMS) as Array<keyof NavItems>).map((category) => (
          <div key={category} className="space-y-5">
            <h3 className="px-3 text-[11px] txt-future text-slate-400 font-bold opacity-60">
              {category}
            </h3>
            <div className="space-y-2">
              {NAV_ITEMS[category].map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cn(
                    "group flex items-center gap-4 px-5 py-4 rounded-2xl text-[16px] font-semibold transition-all duration-150",
                    isActive(item.path)
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-100"
                  )}
                >
                  <item.icon 
                    size={24} 
                    className={cn(
                      "transition-colors",
                      isActive(item.path) ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )} 
                  />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile */}
      <div className="p-10 border-t border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/50 rounded-b-[32px]">
         <div className="mb-8 px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
               <User size={22} className="text-indigo-600" />
            </div>
            {mounted && (
              <div className="overflow-hidden">
                 <p className="text-[14px] font-black truncate text-slate-950 dark:text-white leading-none mb-1.5 font-display">{profile?.name || 'User'}</p>
                 <p className="text-[11px] txt-future text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black leading-none">{profile?.role}</p>
              </div>
            )}
         </div>
        <button
          onClick={signOut}
          className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all group font-bold text-[12px] txt-future"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
