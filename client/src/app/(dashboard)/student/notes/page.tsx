'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Download, Search, ExternalLink, Calendar, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

export default function StudentNotes() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      if (!profile?.id) return;
      setLoading(true);

      // 1. Get enrolled courses
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', profile.id);
      
      const enrolledCourseIds = enrollmentData?.map(e => e.course_id) || [];

      // 2. Fetch notes from DB with course details
      const { data: dbNotes } = await supabase
        .from('notes')
        .select('*, courses(name, code)')
        .order('created_at', { ascending: false });
      
      const vtuNotes = [
        { id: 'vtu-1', title: 'VTU 2022 Scheme - Engineering Mathematics I', file_url: '#', created_at: '2024-03-20T00:00:00.000Z', isVtu: true, courses: { code: 'MAT101', name: 'Engineering Mathematics I' } },
        { id: 'vtu-2', title: 'VTU 2022 Scheme - Physics for CSE Stream', file_url: '#', created_at: '2024-03-20T00:00:00.000Z', isVtu: true, courses: { code: 'PHY101', name: 'Engineering Physics' } },
        { id: 'vtu-3', title: 'VTU 2022 Scheme - Basic Electronics', file_url: '#', created_at: '2024-03-20T00:00:00.000Z', isVtu: true, courses: { code: 'ELN101', name: 'Basic Electronics' } },
        { id: 'vtu-4', title: 'VTU 2022 Scheme - Introduction to C Programming', file_url: '#', created_at: '2024-03-20T00:00:00.000Z', isVtu: true, courses: { code: 'CCP101', name: 'C Programming' } }
      ];
      
      // 3. Mark notes as relevant if they belong to enrolled courses
      const processedNotes = (dbNotes || []).map((n: any) => ({
        ...n,
        isRelevant: enrolledCourseIds.includes(n.course_id)
      }));

      // 4. Combine and sort: Enrolled first, then others
      const combinedNotes = [
        ...vtuNotes.map(n => ({ ...n, isRelevant: true })), 
        ...processedNotes
      ].sort((a, b) => {
        if (a.isRelevant === b.isRelevant) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.isRelevant ? -1 : 1;
      });

      setNotes(combinedNotes);
      setLoading(false);
    }
    fetchNotes();
  }, [profile?.id]);

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Study Materials</h1>
          <p className="text-muted-foreground font-medium mt-3">Download and review high-quality academic notes curated by your faculty.</p>
        </div>
        <div className="relative group w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={20} />
          <Input 
            type="text"
            placeholder="Search for subjects or topics..."
            className="h-14 pl-12 rounded-2xl border-border bg-card/50 backdrop-blur-md font-bold focus-visible:ring-primary/20 shadow-soft"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNotes.length > 0 ? filteredNotes.map((note) => (
          <Card key={note.id} className="group border-border shadow-soft overflow-hidden hover:shadow-strong hover:-translate-y-2 transition-all duration-500 bg-card/50 backdrop-blur-md flex flex-col h-[340px]">
             <div className="aspect-video bg-muted/30 relative flex items-center justify-center border-b border-border group-hover:bg-primary/5 transition-colors overflow-hidden">
                <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-destructive group-hover:text-white transition-all duration-500">
                    <FileText size={32} />
                </div>
                <Badge variant="glass" className={cn(
                  "absolute top-4 right-4 text-[9px] font-black tracking-widest px-2.5 py-1 backdrop-blur",
                  note.isRelevant 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "bg-card/80 border-border"
                )}>
                  {note.isRelevant ? 'CORE CURRICULUM' : 'SUPPLEMENTARY'}
                </Badge>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] text-foreground">
                  <svg className="w-full h-full" width="100%" height="100%"><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                </div>
             </div>
            
            <div className="p-7 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {note.courses && (
                    <Badge variant="secondary" className="text-[8px] font-black tracking-[0.1em] px-2 py-0.5 border-primary/10 text-primary">
                      {note.courses.code}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[8px] font-black tracking-[0.1em] px-2 py-0.5 border-border text-muted-foreground uppercase">
                    {note.category || 'NOTE'}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[9px] font-black uppercase tracking-widest">
                    <Calendar size={12} className="text-primary/40" />
                    {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <h3 className="font-black text-foreground text-lg group-hover:text-primary transition-colors line-clamp-2 leading-tight uppercase tracking-tight italic">
                  {note.title}
                </h3>
                {note.courses && (
                   <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-2 border-l border-primary/20 pl-2">
                     {note.courses.name}
                   </p>
                )}
              </div>
              
              <div className="flex items-center gap-3 pt-6 border-t border-border/50">
                <a href={note.file_url} target="_blank" className="block">
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-card border-border shadow-soft hover:text-primary transition-all">
                    <ExternalLink size={18} />
                  </Button>
                </a>
                <a href={note.file_url} download className="flex-1">
                  <Button variant="gradient" className="w-full h-11 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-strong">
                    <Download size={16} className="mr-2" />
                    Archive Material
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        )) : (
            <div className="col-span-full py-32 border-2 border-dashed border-border rounded-[40px] bg-muted/5 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-muted text-muted-foreground/20 rounded-[32px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <FileText size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic">Registry Dormant</h3>
                  <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] mt-2">No matching academic records found in the Study Hub.</p>
                </div>
                <Button variant="outline" onClick={() => setSearchTerm('')} className="rounded-xl font-black uppercase text-xs border-border">Clear Search</Button>
            </div>
        )}
      </div>
    </div>
  );
}
