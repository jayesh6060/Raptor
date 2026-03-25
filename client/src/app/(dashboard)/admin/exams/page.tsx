'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { GraduationCap, Plus, Trash2, Calendar, Clock, Trophy, Loader2, BookOpen, ChevronRight, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function AdminExams() {
  const { profile } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('60');
  const [examCourseId, setExamCourseId] = useState('');

  useEffect(() => {
    if (profile?.id) {
        fetchData();
    }
  }, [profile?.id]);

  async function fetchData() {
    setLoading(true);

    const [
      { data: examData },
      { data: assignmentData }
    ] = await Promise.all([
      supabase.from('exams').select('*, courses(name, code)').order('date', { ascending: true }),
      supabase.from('teacher_assignments').select('course_id, courses(*)').eq('teacher_id', profile?.id)
    ]);

    const teacherCourses = (assignmentData?.map((a: any) => {
        const c = a.courses;
        return Array.isArray(c) ? c[0] : c;
    }) || []) as any[];
    
    setCourses(teacherCourses);
    if (teacherCourses.length > 0) setExamCourseId((teacherCourses[0] as any)?.id || '');

    setExams(examData || []);
    setLoading(false);
  }

  const createExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examCourseId) return;

    const { error } = await supabase.from('exams').insert({
      title,
      date,
      duration: parseInt(duration),
      course_id: examCourseId
    });

    if (error) alert(error.message);
    else {
      setShowForm(false);
      fetchData();
      setTitle('');
      setDate('');
    }
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Delete this exam schedule?')) return;
    await supabase.from('exams').delete().eq('id', id);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Synchronizing exam registry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">Exam Center</h1>
          <p className="text-muted-foreground font-medium mt-1">Configure and manage online assessments for your subjects.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "gradient"}
          className="h-14 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-strong"
        >
          {showForm ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
          {showForm ? 'Cancel Entry' : 'New Schedule'}
        </Button>
      </div>

      {showForm && (
        <Card className="max-w-3xl border-border shadow-strong overflow-hidden animate-in fade-in slide-in-from-top-6 duration-500">
          <CardHeader className="bg-muted/30 border-b border-border p-8">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
                  <Calendar size={28} />
               </div>
               <div>
                  <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tight italic">Setup Examination</CardTitle>
                  <CardDescription className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-1">Academic Cycle 2026-27</CardDescription>
               </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={createExam} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Assigned Subject</label>
                    <div className="relative group">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={18} />
                      <select 
                        required
                        value={examCourseId}
                        onChange={(e) => setExamCourseId(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-muted/10 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none cursor-pointer"
                      >
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                        ))}
                      </select>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Exam Label</label>
                    <Input 
                      required 
                      className="h-14 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20" 
                      placeholder="e.g. Mid-Term 2" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Test Date</label>
                    <Input 
                      type="date" 
                      required 
                      className="h-14 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20" 
                      value={date} 
                      onChange={e => setDate(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Duration (Min)</label>
                    <Input 
                      type="number" 
                      required 
                      className="h-14 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20" 
                      value={duration} 
                      onChange={e => setDuration(e.target.value)} 
                    />
                 </div>
                 <div className="md:col-span-2 pt-4">
                    <Button type="submit" variant="gradient" className="w-full h-16 font-black uppercase text-sm tracking-[0.2em] rounded-2xl shadow-strong">
                      Broadcast Schedule
                    </Button>
                 </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exams.length > 0 ? exams.map((exam) => (
          <Card key={exam.id} className="group border-border shadow-soft overflow-hidden hover:shadow-strong hover:-translate-y-2 transition-all duration-500 bg-card/50 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <GraduationCap size={32} />
                </div>
                <Badge variant="glass" className="text-[9px] font-black tracking-widest text-primary border-primary/20 px-3 py-1">UPCOMING</Badge>
              </div>
              
              <div className="space-y-2 mb-8 pr-4">
                 <Badge variant="secondary" className="text-[9px] font-black tracking-widest bg-muted border-border uppercase">
                    {exam.courses?.code || 'EXM'}
                 </Badge>
                 <h3 className="font-black text-foreground text-2xl group-hover:text-primary transition-colors uppercase tracking-tight italic leading-tight truncate">
                    {exam.title}
                 </h3>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest border-l-2 border-primary/20 pl-3 mt-3 truncate">
                    {exam.courses?.name || 'Assigned Course'}
                 </p>
              </div>
              
              <div className="space-y-3 pt-6 border-t border-border/50">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar size={18} className="text-primary/40" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                     {new Date(exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock size={18} className="text-primary/40" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{exam.duration} Min Session</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="px-8 py-5 bg-muted/30 border-t border-border flex gap-3">
              <Link href={`/admin/exams/${exam.id}`} className="flex-1">
                <Button variant="outline" className="w-full h-11 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] border-border bg-card shadow-soft hover:bg-primary hover:text-white transition-all leading-none">
                  <Settings size={14} className="mr-2" />
                  Settings
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => deleteExam(exam.id)} 
                className="w-11 h-11 rounded-xl shadow-soft"
              >
                <Trash2 size={18} />
              </Button>
            </CardFooter>
          </Card>
        )) : (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-[32px] bg-muted/5">
             <Trophy size={64} className="mx-auto text-muted-foreground/10 mb-6" />
             <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs leading-relaxed">Registry dormant<br/>Schedule first assessment</p>
          </div>
        )}
      </div>
    </div>
  );
}
