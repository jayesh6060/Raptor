'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, CheckCircle2, XCircle, AlertCircle, Filter, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Attendance } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function StudentAttendance() {
  const { profile } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      if (!profile?.id) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', profile.id)
        .order('date', { ascending: false });
      setAttendance(data || []);
      setLoading(false);
    }
    fetchAttendance();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Syncing records...</p>
      </div>
    );
  }

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const rate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">My Attendance</h1>
          <p className="text-muted-foreground font-medium mt-1">A detailed log of your class presence and performance.</p>
        </div>
        <div className="flex gap-4">
          <Card className="px-8 py-4 border-border shadow-strong flex items-center gap-6 bg-card/50 backdrop-blur-md">
             <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
               <TrendingUp size={28} />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Live Rate</p>
               <div className="flex items-baseline gap-2">
                 <p className="text-3xl font-black text-foreground italic">{rate.toFixed(0)}%</p>
                 <Badge variant="glass" className={cn(
                   "text-[9px] font-black px-2 py-0.5",
                   rate >= 85 ? "text-success border-success/20" : "text-warning border-warning/20"
                 )}>
                   {rate >= 85 ? 'GOOD' : 'WARNING'}
                 </Badge>
               </div>
             </div>
          </Card>
        </div>
      </div>

      <Card className="border-border shadow-soft overflow-hidden">
        <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
           <CardTitle className="text-xl font-black text-foreground tracking-tight italic flex items-center gap-3">
             <Calendar size={22} className="text-primary" />
             History Log
           </CardTitle>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl border-border">
                <ChevronLeft size={20} />
              </Button>
              <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl border-border">
                <ChevronRight size={20} />
              </Button>
           </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attendance.length > 0 ? attendance.map((record) => (
              <Card key={record.id} className="group p-7 border-border bg-muted/10 hover:bg-card hover:shadow-strong hover:-translate-y-1.5 transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform",
                     record.status === 'present' ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                   )}>
                      {record.status === 'present' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                   </div>
                   <Badge variant={record.status === 'present' ? 'success' : 'destructive'} className="font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1">
                     {record.status}
                   </Badge>
                </div>
                
                <h4 className="text-lg font-black text-foreground tracking-tight uppercase group-hover:text-primary transition-colors">{record.subject || 'UNTITLED SESSION'}</h4>
                <div className="mt-5 pt-5 border-t border-border/50 flex items-center gap-3 text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                  <Calendar size={14} className="text-primary/40" />
                  {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </Card>
            )) : (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-border rounded-[32px] bg-muted/5">
                <AlertCircle size={56} className="mx-auto text-muted-foreground/20 mb-6" />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No attendance records found.</p>
                <Button variant="link" className="mt-2 text-primary">Need help? Contact support</Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
