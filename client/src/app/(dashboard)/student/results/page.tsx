'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Target, Award, ArrowUpRight, BookOpen, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Submission } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

export default function StudentResults() {
  const { profile } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!profile?.id) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('submissions')
        .select('*, exams(title)')
        .eq('student_id', profile.id)
        .order('submitted_at', { ascending: false });
      setSubmissions(data || []);
      setLoading(false);
    }
    fetchResults();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Compiling academic records...</p>
      </div>
    );
  }

  const totalScore = submissions.reduce((acc, curr) => acc + curr.score, 0);
  const totalPossible = submissions.reduce((acc, curr) => acc + curr.total_possible, 0);
  const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Academic Results</h1>
          <p className="text-muted-foreground font-medium mt-3">Comprehensive performance tracking and granular examination insights.</p>
        </div>
        <Badge variant="glass" className="h-10 px-5 text-[10px] font-black tracking-widest border-primary/20 text-primary">SEMESTER VI REGISTRY</Badge>
      </div>

      {/* Hero Performance Card */}
      <Card className="bg-primary text-white border-none shadow-strong overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none group-hover:bg-white/10 transition-colors" />
        <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <Badge variant="outline" className="text-[10px] font-black tracking-widest text-white border-white/20 px-3 py-1 uppercase backdrop-blur-sm">Candidate Pulse</Badge>
            <h2 className="text-4xl font-black italic uppercase tracking-tight leading-none">Exceptional Trajectory</h2>
            <p className="text-white/60 font-medium text-lg leading-relaxed max-w-md italic">
              "Excellence is not an act, but a habit." Your performance metrics are currently trending above the departmental average.
            </p>
          </div>
          <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Award size={48} className="text-white drop-shadow-lg" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center justify-between group hover:shadow-strong transition-all duration-500">
           <div className="space-y-2">
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">Overall Precision</p>
             <h3 className="text-5xl font-black text-foreground tracking-tighter italic leading-none">{percentage.toFixed(1)}%</h3>
           </div>
           <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner flex items-center justify-center">
              <Target size={32} />
           </div>
        </Card>
        <Card className="p-8 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center justify-between group hover:shadow-strong transition-all duration-500">
           <div className="space-y-2">
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">Assessment Count</p>
             <h3 className="text-5xl font-black text-foreground tracking-tighter italic leading-none">{submissions.length}</h3>
           </div>
           <div className="w-16 h-16 bg-success/10 text-success rounded-2xl group-hover:bg-success group-hover:text-white transition-all shadow-inner flex items-center justify-center">
              <TrendingUp size={32} />
           </div>
        </Card>
        <Card className="p-8 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center justify-between group hover:shadow-strong transition-all duration-500">
           <div className="space-y-2">
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">Aggregate Credits</p>
             <h3 className="text-4xl font-black text-foreground tracking-tighter italic leading-none">{totalScore} <span className="text-muted-foreground/30 text-2xl">/ {totalPossible}</span></h3>
           </div>
           <div className="w-16 h-16 bg-warning/10 text-warning rounded-2xl group-hover:bg-warning group-hover:text-white transition-all shadow-inner flex items-center justify-center">
              <Trophy size={32} />
           </div>
        </Card>
      </div>

      <Card className="border-border shadow-strong overflow-hidden bg-card/50 backdrop-blur-md">
        <CardHeader className="p-8 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
                <BookOpen size={20} />
             </div>
             <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight italic">Granular Breakdown</CardTitle>
          </div>
        </CardHeader>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border">
              <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12">Examination</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12">Performance Gauge</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12 text-center">Status Badge</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12">Registry Date</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12 text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => {
              const subPercentage = (sub.score / sub.total_possible) * 100;
              return (
                <TableRow key={sub.id} className="hover:bg-muted/30 group transition-all duration-300 border-border">
                  <TableCell className="px-10 py-7">
                    <div className="space-y-1">
                      <p className="font-black text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors text-lg leading-none">{sub.exams?.title}</p>
                      <Badge variant="outline" className="text-[8px] font-black tracking-widest uppercase border-border bg-muted/50 mt-2">Verified Result</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-7">
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-foreground italic leading-none">{sub.score}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">/ {sub.total_possible}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 group-hover:scale-x-105",
                            subPercentage >= 75 ? "bg-success" : subPercentage >= 40 ? "bg-warning" : "bg-destructive"
                          )} 
                          style={{ width: `${subPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-7">
                    <div className="flex justify-center">
                      <Badge variant={subPercentage >= 40 ? 'success' : 'destructive'} className="font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1 shadow-soft">
                        {subPercentage >= 40 ? 'PASSED' : 'RETRY'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-7">
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                       <Calendar size={14} className="text-primary/40" />
                       {new Date(sub.submitted_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-7 text-right">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-[18px] bg-card border-border shadow-soft hover:text-primary hover:border-primary/20 transition-all">
                      <ArrowUpRight size={22} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Loader2({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
