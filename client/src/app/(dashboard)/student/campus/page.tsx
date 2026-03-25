'use client';

import React from 'react';
import { 
  Award, 
  FileText, 
  Files, 
  MessageSquare, 
  Users, 
  UserCog,
  ArrowRight,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function CampusPage() {
  const actions = [
    { 
      title: 'Certificates', 
      description: 'Access and verify your official academic transcripts and completion awards.', 
      icon: Award, 
      variant: 'primary',
      href: '/student/campus/certificates'
    },
    { 
      title: 'Professional Resume', 
      description: 'Engineer and showcase your achievements with the integrated CV builder.', 
      icon: FileText, 
      variant: 'primary',
      href: '/student/campus/resume'
    },
    { 
      title: 'Digital Vault', 
      description: 'Securely manage your archived documents and academic submissions.', 
      icon: Files, 
      variant: 'primary',
      href: '/student/campus/documents'
    },
    { 
      title: 'Feedback Loop', 
      description: 'Contribute to campus growth through faculty and facility evaluations.', 
      icon: MessageSquare, 
      variant: 'primary',
      href: '/student/campus/feedback'
    },
    { 
      title: 'Syndicates', 
      description: 'Engage with elite student clubs and specialized research guilds.', 
      icon: Users, 
      variant: 'primary',
      href: '/student/campus/groups'
    },
    { 
      title: 'Core Account', 
      description: 'Configure your credential security and global ERP preferences.', 
      icon: UserCog, 
      variant: 'primary',
      href: '/profile'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Institution Actions</h1>
          <p className="text-muted-foreground font-medium mt-3">Centralized command center for your campus life and academic identity.</p>
        </div>
        <Badge variant="glass" className="h-10 px-5 text-[10px] font-black tracking-widest border-primary/20 text-primary">RAPTOR ECOSYSTEM v2.0</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link 
              href={action.href} 
              key={action.title}
              className="group"
            >
              <Card className="h-full border-border shadow-soft bg-card/50 backdrop-blur-md hover:shadow-strong transition-all duration-500 overflow-hidden relative">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-12 -mt-12 transition-all duration-700 opacity-5 group-hover:opacity-20 bg-primary" />
                
                {/* Scan Effect on Hover */}
                <div className="absolute inset-x-0 h-[2px] bg-primary/20 opacity-0 group-hover:opacity-100 group-hover:animate-[scan-line_3s_linear_infinite] z-20 pointer-events-none" />

                <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 shadow-inner transition-all duration-500 group-hover:scale-110 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white">
                      <Icon size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-foreground mb-3 group-hover:text-primary transition-colors uppercase tracking-tight italic">
                      {action.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {action.description}
                    </p>
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">Launch Module</span>
                    <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
