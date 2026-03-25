'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  LayoutGrid, 
  ClipboardList, 
  Map, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Course, Attendance } from '@/types/database';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type Tab = 'Grading' | 'Attendance' | 'Notes' | 'Lesson Plan';

export default function StudentCourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { profile } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Grading');

  useEffect(() => {
    async function fetchData() {
      if (!id || !profile?.id) return;
      
      const [courseRes, attendanceRes, notesRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', id).single(),
        supabase.from('attendance').select('*').eq('course_id', id).eq('student_id', profile.id).order('date', { ascending: false }),
        supabase.from('notes').select('*').eq('course_id', id).order('created_at', { ascending: false })
      ]);

      if (courseRes.data) setCourse(courseRes.data);
      if (attendanceRes.data) setAttendance(attendanceRes.data);
      if (notesRes.data) setNotes(notesRes.data);
      setLoading(false);
    }
    fetchData();
  }, [id, profile?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-24">
        <AlertCircle size={48} className="mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground font-bold tracking-tight">Subject not found.</p>
        <Button onClick={() => router.back()} variant="ghost" className="mt-4 font-black">
          <ArrowLeft size={16} className="mr-2" /> Back to Courses
        </Button>
      </div>
    );
  }

  const attendanceRate = attendance.length > 0 
    ? (attendance.filter(a => a.status === 'present').length / attendance.length) * 100 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
          className="rounded-full hover:bg-muted h-12 w-12 border border-border/50"
        >
          <ArrowLeft size={24} className="text-muted-foreground" />
        </Button>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-1">{course.name}</h1>
          <div className="flex items-center gap-3">
             <Badge variant="glass" className="text-[10px] font-black tracking-widest text-primary border-primary/20">
               {course.code}
             </Badge>
             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">VTU 2022 Scheme</span>
          </div>
        </div>
      </div>

      <div className="card-glass p-1.5 rounded-2xl sticky top-4 z-20 border border-border/50 shadow-soft">
        <div className="flex gap-2">
          {(['Grading', 'Attendance', 'Notes', 'Lesson Plan'] as Tab[]).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? "default" : "ghost"}
              className={cn(
                "flex-1 py-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-500 gap-2",
                activeTab === tab 
                  ? "shadow-strong bg-primary text-primary-foreground scale-[1.02]" 
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {tab === 'Grading' && <LayoutGrid size={18} />}
              {tab === 'Attendance' && <Clock size={18} />}
              {tab === 'Notes' && <FileText size={18} />}
              {tab === 'Lesson Plan' && <Map size={18} />}
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'Grading' && (
          <Card className="overflow-hidden border-border shadow-soft">
            <div className="divide-y divide-border/50">
              {/* Attendance Summary */}
              <GradingItem 
                title="Attendance" 
                subtitle="Minimum of 85% is mandatory" 
                score={`${attendance.filter(a => a.status === 'present').length}/${attendance.length}`}
                percentage={attendanceRate}
                target={85}
              />
              
              <GradingItem 
                title="Internal Assessment 1" 
                subtitle="Conducted : 17 Nov 2025" 
                score="23/50"
                percentage={46}
              />
              <GradingItem 
                title="Internal Assessment 2" 
                subtitle="Conducted : 07 Jan 2026" 
                score="23/50"
                percentage={46}
              />
              <GradingItem 
                title="Assignment 1" 
                subtitle="Conducted : 07 Oct 2025" 
                score="25/25"
                percentage={100}
                isSuccess
              />
              <GradingItem 
                title="Assignment 2" 
                subtitle="Conducted : 17 Dec 2025" 
                score="25/25"
                percentage={100}
                isSuccess
              />
              
              <div className="p-7 flex items-center justify-between group cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Course Exit Survey</h4>
                  <p className="text-xs text-muted-foreground font-medium">Completion of this survey is mandatory</p>
                </div>
                <Badge variant="secondary" className="px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">Pending</Badge>
              </div>

              <div className="p-7 flex items-center justify-between group cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Faculty Feedback</h4>
                  <p className="text-xs text-muted-foreground font-medium">Completion of this survey is mandatory</p>
                </div>
                <Badge variant="secondary" className="px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">Pending</Badge>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'Attendance' && (
          <div className="space-y-8">
             <Card className="bg-gradient-to-br from-primary to-primary/80 border-none rounded-[32px] p-12 text-primary-foreground relative overflow-hidden shadow-strong">
                <TrendingUp className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 w-48 h-48 pointer-events-none" />
                <p className="text-primary-foreground/70 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Overall Standing</p>
                <h2 className="text-7xl font-black italic tracking-tighter mb-8 drop-shadow-lg">{attendanceRate.toFixed(1)}%</h2>
                <div className="flex gap-4 relative z-10">
                  <div className="px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black border border-white/20 shadow-inner flex items-center gap-2">
                    <span className="text-white text-sm">{attendance.filter(a => a.status === 'present').length}</span> PRESENT
                  </div>
                  <div className="px-6 py-2.5 bg-black/10 backdrop-blur-md rounded-2xl text-[10px] font-black border border-black/20 shadow-inner flex items-center gap-2">
                    <span className="text-white text-sm">{attendance.filter(a => a.status === 'absent').length}</span> ABSENT
                  </div>
                </div>
             </Card>

             <Card className="divide-y divide-border/50 border-border shadow-soft overflow-hidden">
               {attendance.map((record) => (
                 <div key={record.id} className="p-7 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                   <div className="flex items-center gap-6">
                     <div className={cn(
                       "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform",
                       record.status === 'present' ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                     )}>
                       {record.status === 'present' ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                     </div>
                     <div>
                       <p className="text-lg font-black text-foreground tracking-tight">{new Date(record.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                       <Badge variant="glass" className={cn(
                         "mt-1 text-[10px] font-black uppercase tracking-widest",
                         record.status === 'present' ? "text-success border-success/20" : "text-destructive border-destructive/20"
                       )}>
                         {record.status}
                       </Badge>
                     </div>
                   </div>
                   <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                 </div>
               ))}
               {attendance.length === 0 && (
                 <div className="p-20 text-center text-muted-foreground font-bold tracking-tight bg-muted/20">
                    <Clock size={48} className="mx-auto mb-4 opacity-20" />
                    No attendance records for this subject.
                 </div>
               )}
             </Card>
          </div>
        )}

        {activeTab === 'Notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.length > 0 ? notes.map((note) => (
              <Card key={note.id} className="group border-border shadow-soft overflow-hidden hover:shadow-strong transition-all duration-300 bg-card/50 backdrop-blur-md flex flex-col justify-between">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center group-hover:bg-destructive group-hover:text-white transition-all shadow-inner">
                      <FileText size={24} />
                    </div>
                    <Badge variant="glass" className="text-[9px] font-black tracking-widest bg-card border-border uppercase">
                      {note.title.split('.').pop()?.toUpperCase() || 'PDF'}
                    </Badge>
                  </div>
                  <h3 className="font-black text-foreground text-lg group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight italic leading-tight mb-2">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                    <Clock size={12} className="text-primary/40" />
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
                <div className="px-6 py-4 bg-muted/30 border-t border-border flex gap-3">
                  <a href={note.file_url} target="_blank" className="block flex-1">
                    <Button variant="outline" size="sm" className="w-full h-10 rounded-xl bg-card border-border shadow-soft hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest gap-2">
                      <ExternalLink size={14} />
                      View
                    </Button>
                  </a>
                  <a href={note.file_url} download className="block flex-1">
                    <Button variant="gradient" size="sm" className="w-full h-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-strong gap-2">
                      <Download size={14} />
                      Download
                    </Button>
                  </a>
                </div>
              </Card>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[32px] bg-muted/5 space-y-4">
                <FileText size={48} className="mx-auto text-muted-foreground/20" />
                <div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">Registry Dormant</h3>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">No academic records found for this subject.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Lesson Plan' && (
          <Card className="p-20 text-center border-dashed border-2 bg-muted/20 border-border">
             <Map size={56} className="mx-auto mb-6 text-muted-foreground/30" />
             <h3 className="text-xl font-black text-foreground tracking-tight">Syllabus & Lesson Plan</h3>
             <p className="text-muted-foreground font-medium mt-2">Detailed topic tracking will be available soon.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function GradingItem({ title, subtitle, score, percentage, target, isSuccess }: { 
  title: string, 
  subtitle: string, 
  score: string, 
  percentage: number,
  target?: number,
  isSuccess?: boolean
}) {
  const isWarning = target && percentage < target;
  
  return (
    <div className="p-7 flex items-center justify-between group hover:bg-muted/30 transition-colors">
      <div className="space-y-1.5">
        <h4 className="text-base font-black text-foreground uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
      </div>
      <div className={cn(
        "px-6 py-3 rounded-2xl font-black text-sm shadow-sm border transition-all group-hover:scale-105",
        isSuccess ? "bg-success/10 border-success/20 text-success" :
        isWarning ? "bg-warning/10 border-warning/20 text-warning" :
        "bg-muted/50 border-border text-muted-foreground"
      )}>
        {score}
      </div>
    </div>
  );
}
