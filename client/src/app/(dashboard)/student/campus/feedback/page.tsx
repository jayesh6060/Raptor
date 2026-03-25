'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Send, 
  ChevronRight,
  Zap,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { motion as _motion } from 'framer-motion';
const motion: any = _motion;
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function FeedbackLoopPage() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (r: number) => setRating(r);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <ShieldCheck size={48} className="animate-pulse" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Evaluation Decrypted</h2>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto italic">Your feedback has been securely transmitted to the central node. Thank you for contributing to campus growth.</p>
        </div>
        <Button 
          variant="gradient" 
          onClick={() => setSubmitted(false)}
          className="h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]"
        >
          Initialize New Session
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-12 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="space-y-4">
          <Badge variant="glass" className="h-8 px-4 text-[9px] font-black tracking-widest bg-primary/10 text-primary border-primary/20">MODULE 04 — FEEDBACK LOOP</Badge>
          <h1 className="text-5xl font-black text-foreground tracking-tighter italic uppercase leading-none">Faculty Evaluation</h1>
          <p className="text-muted-foreground font-medium max-w-xl">Provide surgical clarity on instructional performance and facility infrastructure. Your insights drive the Raptor ecosystem forward.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20 shadow-soft">
            <Activity size={24} />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Sync Status</p>
            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mt-1">Live Connection</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Card className="border-border shadow-strong bg-card/50 backdrop-blur-md overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />
          <CardContent className="p-12 relative z-10 space-y-12">
            
            {/* Subject Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Academic Node (Faculty Name)</label>
                <Input 
                  placeholder="e.g. PROF. ALAN TURING"
                  className="h-14 bg-background/50 border-border text-lg font-black uppercase tracking-tighter italic"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Protocol Identifier (Course ID)</label>
                <Input 
                  placeholder="e.g. CS-402 — OPERATING SYSTEMS"
                  className="h-14 bg-background/50 border-border text-lg font-black uppercase tracking-tighter italic"
                />
              </div>
            </div>

            {/* Rating System */}
            <div className="space-y-8 py-10 border-y border-border/50">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight italic">Performance Grade</h3>
                <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Scale Trace Output</p>
              </div>
              
              <div className="flex justify-center gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => handleRate(i)}
                    className={cn(
                      "w-16 h-16 rounded-[24px] flex items-center justify-center border-2 transition-all duration-300 transform hover:scale-110 active:scale-90",
                      rating >= i 
                        ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(99,102,241,0.4)]" 
                        : "bg-background/50 border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    <Star size={28} fill={rating >= i ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Comprehensive Analysis</label>
                <Badge variant="outline" className="text-[8px] font-black tracking-widest border-primary/20 text-primary">ENCRYPTED INPUT</Badge>
              </div>
              <textarea 
                placeholder="Identify instructional strengths and areas for telemetry optimization..."
                className="w-full min-h-[200px] p-8 bg-background/30 border border-border rounded-[32px] text-base font-medium text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none shadow-inner"
              />
            </div>

            {/* Submission */}
            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4 text-muted-foreground">
                <Zap size={20} className="text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transmission Security Verified</span>
              </div>
              <Button 
                variant="gradient" 
                size="lg"
                onClick={() => setSubmitted(true)}
                disabled={rating === 0}
                className="w-full md:w-auto h-16 px-16 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-strong group/btn transition-all active:scale-95"
              >
                <span>Upload telemetry</span>
                <Send size={20} className="ml-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>

      {/* Footer Info */}
      <motion.div variants={itemVariants} className="bg-primary/5 border border-primary/10 rounded-[40px] p-10 flex items-center gap-8">
        <div className="w-16 h-16 bg-white dark:bg-card border border-primary/20 rounded-2xl flex items-center justify-center shadow-soft shrink-0">
          <MessageSquare size={32} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h4 className="font-black text-foreground uppercase tracking-tight italic">Privacy Protocol</h4>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">Evaluation data is anonymized and aggregated for institutional performance review. Your individual node identity remains untraceable by instructional staff.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
