'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Zap, 
  Globe, 
  Cpu, 
  Shield, 
  Code2, 
  Library,
  ArrowRight
} from 'lucide-react';
import { motion as _motion } from 'framer-motion';
const motion: any = _motion;
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function SyndicatesPage() {
  const syndicates = [
    {
      id: 'syn-01',
      name: 'Neural Foundry',
      category: 'Research Guild',
      description: 'Deep-dive into advanced machine learning architectures and autonomous neural networks.',
      members: 142,
      icon: Cpu,
      color: 'primary',
      active: true
    },
    {
      id: 'syn-02',
      name: 'Cyber Sentinel',
      category: 'Security Group',
      description: 'Exploring end-to-end encryption protocols and defensive infrastructure against node intrusion.',
      members: 89,
      icon: Shield,
      color: 'destructive',
      active: true
    },
    {
      id: 'syn-03',
      name: 'Algorithm Forge',
      category: 'Coding Guild',
      description: 'The elite circle for competitive programming and high-performance hardware optimization.',
      members: 256,
      icon: Code2,
      color: 'success',
      active: true
    },
    {
      id: 'syn-04',
      name: 'Raptor Archive',
      category: 'Academic Library',
      description: 'A collaborative effort to document and disseminate decentralized academic knowledge.',
      members: 64,
      icon: Library,
      color: 'warning',
      active: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-12 pb-20"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-end justify-between gap-10">
        <div className="space-y-6">
          <Badge variant="glass" className="h-8 px-4 text-[9px] font-black tracking-widest bg-primary/10 text-primary border-primary/20">MODULE 05 — SYNDICATES</Badge>
          <h1 className="text-6xl md:text-7xl font-black text-foreground tracking-tighter italic uppercase leading-none">The Collective</h1>
          <p className="text-muted-foreground font-medium max-w-2xl leading-relaxed text-lg italic">Engage with specialized research guilds and student clubs. Collaborative nodes designed for high-performance academic synthesis.</p>
        </div>
        <div className="flex flex-col items-end gap-3 text-right">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Global Network Online</span>
             </div>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">4.2k Syndicated Members</p>
        </div>
      </motion.div>

      {/* Control Bar */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground transition-colors group-hover:text-primary">
            <Search size={20} />
          </div>
          <Input 
            placeholder="Search guilds by name or protocol..." 
            className="h-14 pl-14 bg-card/50 backdrop-blur-md border-border rounded-[24px] text-base font-medium focus:ring-1 focus:ring-primary/20 shadow-soft"
          />
        </div>
        <Button 
          variant="gradient" 
          className="h-14 px-10 rounded-[24px] font-black uppercase text-[11px] tracking-widest shadow-strong active:scale-95 transition-all"
        >
          Initialize New Syndicate
        </Button>
      </motion.div>

      {/* Syndicate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {syndicates.map((syn) => {
          const Icon = syn.icon;
          return (
            <motion.div key={syn.id} variants={itemVariants}>
              <Card className="h-full border-border shadow-soft bg-card/50 backdrop-blur-md hover:shadow-strong transition-all duration-500 overflow-hidden relative group">
                <div className={cn(
                  "absolute top-0 right-0 w-48 h-48 rounded-bl-full -mr-16 -mt-16 transition-all duration-700 opacity-5 group-hover:opacity-10",
                  syn.color === 'primary' ? 'bg-primary' : 
                  syn.color === 'destructive' ? 'bg-destructive' :
                  syn.color === 'success' ? 'bg-success' : 'bg-warning'
                )} />
                
                <CardContent className="p-10 relative z-10 flex flex-col h-full justify-between gap-10">
                  <div className="flex gap-10">
                    <div className={cn(
                      "w-20 h-20 rounded-[32px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500",
                      syn.color === 'primary' ? 'bg-primary/10 text-primary' : 
                      syn.color === 'destructive' ? 'bg-destructive/10 text-destructive' :
                      syn.color === 'success' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    )}>
                      <Icon size={40} />
                    </div>
                    
                    <div className="space-y-4 pt-2">
                       <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[8px] font-black tracking-widest border-border bg-background/50 uppercase">{syn.category}</Badge>
                          {syn.active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                       </div>
                       <h3 className="text-3xl font-black text-foreground tracking-tighter italic uppercase group-hover:text-primary transition-colors">{syn.name}</h3>
                       <p className="text-muted-foreground font-medium text-sm leading-relaxed line-clamp-2 italic">{syn.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                     <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">0{i}</div>
                           ))}
                           <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-[8px] font-black text-primary">+{syn.members}</div>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Synchronized Nodes</span>
                     </div>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="h-10 px-6 rounded-xl font-black uppercase text-[9px] tracking-widest border-border bg-background group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all group/btn"
                     >
                       <span>Join Protocol</span>
                       <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                     </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Global Status Banner */}
      <motion.div variants={itemVariants} className="bg-slate-950 p-12 rounded-[48px] border border-slate-800 relative overflow-hidden group">
         <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-[grid-white_1.5rem_1.5rem]"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                     <Globe size={20} className="animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-black text-white italic uppercase tracking-tight">Syndicated Network Hub</h4>
               </div>
               <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed italic">The Raptor network enables cross-node collaboration. Join high-performance guilds to accelerate your academic trajectory.</p>
            </div>
            <Link href="/student/campus/groups/discover" className="shrink-0 w-full md:w-auto">
               <Button variant="secondary" className="w-full md:w-auto h-16 px-12 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black uppercase text-[11px] tracking-widest shadow-strong transform transition-all active:scale-95">
                  Discover All Collectives
               </Button>
            </Link>
         </div>
         {/* Animated Scan Line */}
         <motion.div 
           animate={{ y: ['-100%', '200%'] }}
           transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
           className="absolute inset-x-0 h-[2px] bg-indigo-500/20 z-0 pointer-events-none"
         />
      </motion.div>
    </motion.div>
  );
}
