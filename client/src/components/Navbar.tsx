'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Search, User } from 'lucide-react';

export function Navbar() {
  const { profile } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{profile?.name || 'Loading...'}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{profile?.role || 'User'}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
