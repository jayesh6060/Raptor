'use client';

import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Clock, 
  Cloud, 
  Globe, 
  HardDrive,
  ArrowLeft,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AboutPage() {
  const features = [
    {
      title: "Role-Based Intelligence",
      description: "Dedicated portals for Students, Teachers, and Administrators, ensuring everyone has the tools they need.",
      icon: Users,
      variant: "primary"
    },
    {
      title: "Dynamic Attendance Hub",
      description: "Cloud-synced roll-call system with real-time tracking and granular subject-level analytics.",
      icon: Clock,
      variant: "success"
    },
    {
      title: "Academic Resource Vault",
      description: "A centralized engine for sharing study notes, assignments, and PDFs with seamless organization.",
      icon: HardDrive,
      variant: "primary"
    },
    {
      title: "Smart Exam Engine",
      description: "Automated assessment platform for creating, managing, and taking exams with instant feedback.",
      icon: GraduationCap,
      variant: "secondary"
    },
    {
      title: "Security & Protection",
      description: "Email whitelisting and robust authentication layers to keep your institutional data safe.",
      icon: ShieldCheck,
      variant: "destructive"
    },
    {
      title: "Real-time Broadcast",
      description: "Global announcement system to bridge the gap between administration and the student body.",
      icon: Zap,
      variant: "warning"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 p-8">
      {/* Navigation */}
      <div className="pt-4">
        <Link href="/">
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-border bg-card shadow-soft hover:text-primary transition-all">
            <ArrowLeft size={18} className="mr-2" />
            Back to Portal
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative text-center space-y-6 py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
        <Badge variant="glass" className="h-10 px-6 text-[11px] font-black tracking-[0.3em] border-primary/20 text-primary">PROJECT RAPTOR</Badge>
        <h1 className="text-6xl font-black text-foreground uppercase tracking-tighter italic leading-none">
          Next-Gen <span className="text-primary">Campus</span> Engine
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
          The most advanced campus management ecosystem ever built. Engineered for academic excellence, 
          optimized for high-performance administration.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <Card key={idx} className="group border-border shadow-soft bg-card/50 backdrop-blur-md hover:shadow-strong hover:-translate-y-2 transition-all duration-500 overflow-hidden">
             <CardContent className="p-10">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-all duration-500 group-hover:scale-110",
                  feature.variant === 'primary' ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : 
                  feature.variant === 'success' ? 'bg-success/10 text-success group-hover:bg-success group-hover:text-white' :
                  feature.variant === 'warning' ? 'bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white' :
                  feature.variant === 'secondary' ? 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white' : 'bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-white'
                )}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight italic group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed font-medium">
                  {feature.description}
                </p>
             </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats / Tech Section */}
      <Card className="bg-foreground text-background border-none shadow-strong overflow-hidden p-0">
        <CardContent className="p-0 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] -mr-48 -mt-48 pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
            <div className="p-16 space-y-10 border-r border-background/5">
              <div className="space-y-4">
                 <Badge variant="outline" className="text-[10px] font-black tracking-widest text-primary border-primary/20 px-3 py-1 uppercase">Engineering Abstract</Badge>
                 <h2 className="text-4xl font-black uppercase tracking-tight italic leading-none">Infrastructure Foundation</h2>
              </div>
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-background/10 flex items-center justify-center border border-background/5 shadow-inner group-hover:bg-primary group-hover:text-foreground transition-all">
                    <Globe className="text-primary group-hover:text-foreground" size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-xl uppercase tracking-tight italic">Next.js Framework</p>
                    <p className="text-background/40 text-sm font-medium leading-relaxed">Full-stack React architecture for sub-second page delivery.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-background/10 flex items-center justify-center border border-background/5 shadow-inner group-hover:bg-success group-hover:text-foreground transition-all">
                    <Cloud className="text-success group-hover:text-foreground" size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-xl uppercase tracking-tight italic">Supabase Cloud Database</p>
                    <p className="text-background/40 text-sm font-medium leading-relaxed">Encrypted real-time data persistence and secure authentication.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-16 flex flex-col items-center justify-center text-center space-y-8 bg-background/5 backdrop-blur-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Activity size={24} className="text-success animate-pulse" />
                  <p className="text-success font-black uppercase tracking-widest text-xs">Platform Synchronized</p>
                </div>
                <p className="text-7xl font-black italic tracking-tighter uppercase leading-none text-white shadow-primary/20 drop-shadow-2xl">OPERATIONAL</p>
                <p className="text-background/40 text-xs font-black uppercase tracking-[0.2em] pt-4 border-t border-background/5 mt-6">Version 2.0.4-LTS (Active Support)</p>
              </div>
              <Link href="/login">
                <Button variant="gradient" className="h-14 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-strong">
                  Initialize Access
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
