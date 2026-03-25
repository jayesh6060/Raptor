'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, Users, Search, Filter, ArrowLeft, Download, ExternalLink, Loader2, BookOpen, Calendar, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

export default function AdminExamResults() {
  const router = useRouter();
  const { profile } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (profile?.id) {
        fetchData();
    }
  }, [profile?.id]);

  async function fetchData() {
    setLoading(true);
    
    // Fetch teacher's assigned courses
    const { data: assignmentData } = await supabase
      .from('teacher_assignments')
      .select('course_id, courses(*)')
      .eq('teacher_id', profile?.id);
    
    const teacherCourses = (assignmentData?.map((a: any) => {
        const c = a.courses;
        return Array.isArray(c) ? c[0] : c;
    }) || []) as any[];
    
    setCourses(teacherCourses);

    // Fetch submissions with nested exams
    let query = supabase
        .from('submissions')
        .select(`
          *,
          profiles(name, email),
          exams!inner(title, course_id)
        `)
        .order('submitted_at', { ascending: false });

    // If teacher, restrict to their subjects
    if (profile?.role === 'teacher') {
        const courseIds = teacherCourses.map((c: any) => c.id);
        query = query.in('exams.course_id', courseIds);
    }

    const { data: subData } = await query;
    setSubmissions(subData || []);
    setLoading(false);
  }

  const filtered = submissions.filter(s => {
    const matchesSearch = s.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.exams?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourseId === 'all' || s.exams?.course_id === selectedCourseId;
    return matchesSearch && matchesCourse;
  });

  const passCount = filtered.filter(s => (s.score / s.total_possible) >= 0.4).length;
  const passRate = filtered.length > 0 ? (passCount / filtered.length) * 100 : 0;

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
         <Loader2 className="animate-spin text-primary" size={48} />
         <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Analyzing academic data...</p>
       </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
           <Button 
             variant="outline" 
             size="icon" 
             onClick={() => router.back()} 
             className="w-14 h-14 rounded-2xl bg-card border-border shadow-soft hover:text-primary transition-all"
           >
             <ArrowLeft size={24} />
           </Button>
           <div>
             <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Results Portal</h1>
             <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-2 border-l-2 border-primary/20 pl-3">Performance Tracking for 2026-27</p>
           </div>
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-soft border-border bg-card">
          <Download size={20} className="mr-3" />
          Export Dataset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center justify-between group hover:shadow-strong transition-all duration-500">
           <div className="space-y-2">
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">Candidate Submissions</p>
             <h3 className="text-6xl font-black text-foreground tracking-tighter italic">{filtered.length}</h3>
           </div>
           <div className="w-20 h-20 bg-primary/10 text-primary rounded-[32px] group-hover:bg-primary group-hover:text-white transition-all shadow-inner flex items-center justify-center">
              <Users size={40} />
           </div>
        </Card>
        <Card className="p-8 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center justify-between group hover:shadow-strong transition-all duration-500">
           <div className="space-y-2">
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">Threshold Passage</p>
             <h3 className="text-6xl font-black text-foreground tracking-tighter italic">{passRate.toFixed(0)}%</h3>
           </div>
           <div className="w-20 h-20 bg-success/10 text-success rounded-[32px] group-hover:bg-success group-hover:text-white transition-all shadow-inner flex items-center justify-center">
              <Trophy size={40} />
           </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={20} />
          <Input 
            type="text" 
            placeholder="Search candidate or exam identity..."
            className="h-14 pl-16 rounded-[32px] border-border bg-card/50 backdrop-blur-md font-black italic tracking-tight shadow-soft focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Card className="px-6 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center gap-4 h-14 min-w-[280px]">
          <BookOpen size={18} className="text-muted-foreground" />
          <select 
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 outline-none w-full cursor-pointer"
          >
            <option value="all">Global Catalog</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </Card>
      </div>

      <Card className="border-border shadow-strong overflow-hidden bg-card/50 backdrop-blur-md">
        {filtered.length > 0 ? (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border">
                <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-12">Candidate Profile</TableHead>
                <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-12">Exam Source</TableHead>
                <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-12 text-center">Final Accuracy</TableHead>
                <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-12">Timestamp</TableHead>
                <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-12 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => {
                const perc = (sub.score / sub.total_possible) * 100;
                return (
                  <TableRow key={sub.id} className="hover:bg-muted/30 group transition-all duration-300 border-border">
                    <TableCell className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[24px] bg-muted/50 flex items-center justify-center font-black text-xl text-muted-foreground border border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:rotate-6 transition-all shadow-inner">
                          {sub.profiles?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tighter text-lg leading-none italic">{sub.profiles?.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <Mail size={12} className="text-muted-foreground" />
                             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{sub.profiles?.email}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-10 py-7">
                       <p className="text-base font-black text-foreground uppercase tracking-tight leading-tight italic">{sub.exams?.title}</p>
                       <Badge variant="outline" className="mt-2 text-[9px] font-black border-border bg-muted text-muted-foreground uppercase px-2 py-0.5 tracking-widest">Assessment Archive</Badge>
                    </TableCell>
                    <TableCell className="px-10 py-7 text-center">
                       <div className="inline-flex flex-col items-center">
                          <span className={cn(
                            "font-black text-3xl tracking-tighter leading-none italic",
                            perc >= 75 ? "text-success" : perc >= 40 ? "text-warning" : "text-destructive"
                          )}>
                            {sub.score} / {sub.total_possible}
                          </span>
                          <Badge variant="glass" className="mt-2 text-[9px] font-black text-primary border-primary/20 uppercase tracking-widest px-2 py-1">
                             {perc.toFixed(0)}% Precise
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
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-[18px] bg-card border-border shadow-soft hover:text-primary transition-all">
                        <ExternalLink size={20} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center gap-8 border-2 border-dashed border-border rounded-[40px] bg-muted/5">
             <Trophy size={80} className="text-muted-foreground/10 animate-pulse" />
             <div className="text-center">
               <p className="text-foreground font-black uppercase text-xl tracking-tight italic">Observation Empty</p>
               <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-2 leading-relaxed">No data matched your current active filters</p>
             </div>
          </div>
        )}
      </Card>
    </div>
  );
}
