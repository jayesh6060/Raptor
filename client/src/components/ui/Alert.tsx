'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
  onClose?: () => void;
}

const variantStyles: Record<AlertVariant, string> = {
  default: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100',
  destructive: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-400',
  success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400',
  warning: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400',
  info: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-800 dark:text-indigo-400',
};

const variantIcons: Record<AlertVariant, React.ElementType> = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
};

export function Alert({ title, children, variant = 'default', className, onClose }: AlertProps) {
  const Icon = variantIcons[variant];

  return (
    <div className={cn(
      "relative w-full p-6 rounded-[32px] border flex gap-6 shadow-soft group transition-all duration-300 hover:shadow-strong overflow-hidden",
      variantStyles[variant],
      className
    )}>
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full blur-3xl -mr-10 -mt-10 group-hover:opacity-[0.05] transition-opacity" />
      
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-soft border group-hover:scale-105 transition-transform",
        "bg-white/50 dark:bg-slate-900/50 border-current/10"
      )}>
        <Icon size={24} className="text-current" />
      </div>
      
      <div className="flex-1 space-y-1.5 pt-1">
        {title && (
          <h5 className="font-black text-xl tracking-tight leading-none font-display">
            {title}
          </h5>
        )}
        <div className="text-base font-bold opacity-80 leading-relaxed font-display">
          {children}
        </div>
      </div>

      {onClose && (
        <button 
          onClick={onClose}
          className="p-3 rounded-xl hover:bg-current/5 transition-colors h-fit self-start"
        >
          <X size={20} className="text-current opacity-40 hover:opacity-100" />
        </button>
      )}
    </div>
  );
}
