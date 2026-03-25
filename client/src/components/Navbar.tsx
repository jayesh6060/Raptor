'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Search, User, LogOut, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function Navbar() {
  const { profile, signOut } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-6 mx-6 z-40 px-8 flex items-center justify-between rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft transition-all duration-300">
      {/* Search Terminal */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search command terminal..." 
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800/50 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-100 dark:focus:border-indigo-500/30 transition-all font-display dark:text-slate-200"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
             <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-400 border border-slate-200">⌘K</span>
          </div>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-6 ml-6">
        <div className="flex items-center gap-2">
           <ThemeToggle />
           <button className="relative w-11 h-11 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all group">
              <Bell size={20} className="group-hover:rotate-6 transition-transform" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900"></span>
           </button>
        </div>
        
        <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>

        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center gap-4 group cursor-pointer p-1.5 rounded-2xl transition-all duration-300",
              isDropdownOpen ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
          >
            {mounted && (
              <div className="text-right hidden sm:block pl-2">
                <p className="text-sm font-black text-slate-950 dark:text-slate-100 font-display transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {profile?.name || 'Guest'}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <p className="text-[10px] txt-future text-slate-400 uppercase tracking-widest font-bold leading-none">
                    {profile?.role || 'User'}
                  </p>
                  <ChevronDown size={10} className={cn("text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                </div>
              </div>
            )}
            <div className="w-11 h-11 bg-indigo-50 dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 overflow-hidden shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
                {mounted && profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                )}
            </div>
          </div>

          {/* Quick Actions Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <>
                {/* Backdrop to close on click outside */}
                <div 
                  className="fixed inset-0 z-[-1]" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-strong overflow-hidden p-2 z-50 backdrop-blur-xl"
                >
                  <div className="px-4 py-3 mb-2 border-b border-slate-50 dark:border-slate-800/50 sm:hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{profile?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-400">{profile?.role}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Link 
                      href="/profile?edit=true" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                        <User size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Edit Profile</p>
                        <p className="text-[10px] text-slate-400">Update your information</p>
                      </div>
                    </Link>

                    <Link 
                      href="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                        <Settings size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Account Settings</p>
                        <p className="text-[10px] text-slate-400">View profile details</p>
                      </div>
                    </Link>

                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group text-left">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                        <HelpCircle size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Help & Support</p>
                        <p className="text-[10px] text-slate-400">Get assistance</p>
                      </div>
                    </button>

                    <div className="h-px bg-slate-50 dark:bg-slate-800/50 my-2 mx-4" />

                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <LogOut size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">End Session</p>
                        <p className="text-[10px] text-rose-400/70">Securely sign out</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
