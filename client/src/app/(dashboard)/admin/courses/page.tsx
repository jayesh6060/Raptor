'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  BookOpen, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Course } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(1);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: '',
    semester: 1
  });
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  const { profile } = useAuth();
  
  const fetchCourses = async () => {
    if (!profile) return;
    setLoading(true);

    let query = supabase.from('courses').select('*').order('code', { ascending: true });

    if (profile.role === 'teacher') {
      const { data: assignments } = await supabase
        .from('teacher_assignments')
        .select('course_id')
        .eq('teacher_id', profile.id);
      
      const courseIds = assignments?.map(a => a.course_id) || [];
      query = query.in('id', courseIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching courses:', error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [profile]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionStatus({ type: null, msg: '' });

    if (!newCourse.code || !newCourse.name) return;

    const { error } = await supabase.from('courses').insert([
      { 
        code: newCourse.code.toUpperCase(), 
        name: newCourse.name, 
        department: newCourse.department,
        semester: newCourse.semester
      }
    ]);

    if (error) {
      setActionStatus({ type: 'error', msg: 'Failed to create course.' });
    } else {
      setActionStatus({ type: 'success', msg: 'Course created successfully.' });
      setNewCourse({ code: '', name: '', department: '', semester: selectedTerm });
      setIsCreating(false);
      fetchCourses();
    }
  };

  const filteredCourses = courses.filter(course => 
    (course.semester === selectedTerm) &&
    (course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
     course.department?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Academic Manager</h1>
          <p className="text-muted-foreground font-medium italic">Organized by Terms — VTU 2022 Scheme</p>
        </div>
        {(profile?.role === 'admin' || profile?.role === 'teacher') && (
          <Button 
            onClick={() => {
              setNewCourse(prev => ({ ...prev, semester: selectedTerm }));
              setIsCreating(true);
            }}
            variant="gradient"
            className="rounded-2xl px-6 py-6 shadow-strong group"
          >
            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
            Register Subject
          </Button>
        )}
      </div>

      {/* Term Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar scroll-smooth">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((term) => (
          <Button
            key={term}
            onClick={() => setSelectedTerm(term)}
            variant={selectedTerm === term ? "default" : "outline"}
            className={cn(
              "px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-2",
              selectedTerm === term
                ? "shadow-lg bg-primary border-primary text-primary-foreground"
                : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
            )}
          >
            Term {term}
          </Button>
        ))}
      </div>

      <Card className="p-2 border-border shadow-soft">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <Input 
            type="text"
            placeholder="Search by code or name..."
            className="w-full border-none bg-transparent focus-visible:ring-0 shadow-none px-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl" />
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Card key={course.id} className="group card-hover overflow-hidden border-border transition-all">
              <div className="p-7">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <Link 
                    href={`/admin/courses/${course.id}`}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                  >
                    <ExternalLink size={20} />
                  </Link>
                </div>
                
                <div className="mb-6">
                  <Badge variant="glass" className="mb-2 text-[10px] font-black tracking-widest text-primary border-primary/20">
                    {course.code}
                  </Badge>
                  <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors uppercase truncate tracking-tight">{course.name}</h3>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <GraduationCap size={14} className="text-primary" />
                  Classroom Portal
                </div>
              </div>
              
              <Link 
                href={`/admin/courses/${course.id}`}
                className="block w-full py-4 bg-muted/30 text-center text-xs font-black text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all border-t border-border/50 uppercase tracking-[0.2em]"
              >
                Manage Hub
              </Link>
            </Card>
          ))
        ) : (
          <Card className="col-span-full py-24 text-center border-dashed border-2 bg-muted/20 border-border">
            <BookOpen size={56} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-black text-foreground tracking-tight">No courses mapped</h3>
            <p className="text-muted-foreground font-medium">Courses assigned to you will appear here.</p>
          </Card>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
               <h2 className="text-xl font-black text-slate-900">Add New Course</h2>
               <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><Plus className="rotate-45" size={24} /></button>
             </div>
             <form onSubmit={handleCreateCourse} className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Code</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} placeholder="e.g. CS-202" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} placeholder="e.g. Operating Systems" />
                </div>
                <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all uppercase text-xs tracking-widest">Register Course</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
