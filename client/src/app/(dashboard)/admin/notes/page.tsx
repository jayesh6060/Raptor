'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Upload, Trash2, Download, Search, Loader2, BookOpen, Filter, MoreVertical, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function AdminNotes() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [uploadCategory, setUploadCategory] = useState('notes');
  const [activeCourseId, setActiveCourseId] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (profile?.id) {
        fetchData();
    }
  }, [profile?.id]);

  async function fetchData() {
    if (!profile?.id) return;
    setLoading(true);

    try {
      const isAdmin = profile?.role === 'admin';
      
      let fetchedCourses: any[] = [];
      if (isAdmin) {
        const { data: allCourses, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .order('name');
        if (coursesError) console.error('Courses fetch failed:', coursesError.message);
        fetchedCourses = allCourses || [];
      } else {
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('teacher_assignments')
          .select('course_id, courses(*)')
          .eq('teacher_id', profile.id);
        
        if (assignmentError) console.error('Teacher assignments fetch failed:', assignmentError.message);
        
        fetchedCourses = (assignmentData?.map((a: any) => {
            const c = a.courses;
            return Array.isArray(c) ? (c[0] as any) : (c as any);
        }).filter(Boolean) || []) as any[];
      }
      setCourses(fetchedCourses);

      // Attempt to fetch notes. If this fails, we don't want to stop the whole UI.
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*, courses(name, code)')
        .order('created_at', { ascending: false });
      
      if (notesError) {
        console.warn('Notes fetch (main query) failed, trying fallback:', notesError.message);
        // Fallback to even simpler query if courses relationship or category is problematic
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('notes')
          .select('id, title, file_url, created_at') // Removed course_id to ensure it loads even if schema is broken
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
            console.error('Fallback notes fetch failed:', fallbackError.message);
            setNotes([]);
        } else {
            setNotes(fallbackData || []);
        }
      } else {
        setNotes(notesData || []);
      }
    } catch (err) {
      console.error('Critical data fetch failure:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetCourseId = activeCourseId === 'all' ? (courses[0]?.id) : activeCourseId;
    
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!targetCourseId) {
      alert('Subject path resolution failed. Please select a specific course before publishing.');
      return;
    }
    const file = e.target.files[0];
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `notes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload error: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('notes').getPublicUrl(filePath);

    const insertData: any = {
      title: file.name,
      file_url: publicUrl,
      uploaded_by: profile?.id,
      course_id: targetCourseId,
      category: uploadCategory
    };

    let { error: dbError } = await supabase.from('notes').insert(insertData);

    // Resilience: If category column is missing, try inserting without it
    if (dbError && dbError.message?.includes('column "category" of relation "notes" does not exist')) {
      console.warn('Category column missing, retrying without it...');
      const { category, ...safeData } = insertData;
      const { error: retryError } = await supabase.from('notes').insert(safeData);
      dbError = retryError;
    }

    if (dbError) {
      console.error('Database insertion failed:', dbError);
      alert('Registry error: ' + dbError.message + (dbError.code === 'P0001' ? ' (Check if course_id and category columns exist)' : ''));
    } else {
      fetchData();
      alert('Document published successfully!');
    }
    setUploading(false);
  };

  const deleteNote = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    const filePath = fileUrl.split('notes/').pop();
    if (filePath) {
        await supabase.storage.from('notes').remove([`notes/${filePath}`]);
    }
    
    await supabase.from('notes').delete().eq('id', id);
    fetchData();
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = activeCourseId === 'all' || n.course_id === activeCourseId;
    const matchesCategory = filterCategory === 'all' || n.category === filterCategory;
    return matchesSearch && matchesCourse && matchesCategory;
  });

  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Initializing subject library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">Study Hub</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage and publish academic materials for your courses.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <Card className="px-4 py-2 border-border shadow-soft flex items-center gap-4 bg-card/50 backdrop-blur-md h-14">
              <div className="flex items-center gap-2 border-r border-border pr-4 h-full">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Path</span>
                <select 
                   value={activeCourseId}
                   onChange={(e) => setActiveCourseId(e.target.value)}
                   className="bg-card/80 dark:bg-slate-900/50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl py-1.5 focus:ring-1 focus:ring-primary/20 outline-none max-w-[120px] truncate cursor-pointer text-foreground shadow-inner"
                >
                   <option value="all">Global (All)</option>
                   {courses.map(c => (
                     <option key={c.id} value={c.id}>{c.code}</option>
                   ))}
                </select>
              </div>
              <div className="flex items-center gap-2 border-r border-border pr-4 h-full">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type</span>
                <select 
                   value={uploadCategory}
                   onChange={(e) => setUploadCategory(e.target.value)}
                   className="bg-card/80 dark:bg-slate-900/50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl py-1.5 focus:ring-1 focus:ring-primary/20 outline-none max-w-[100px] truncate cursor-pointer text-foreground shadow-inner"
                >
                   <option value="notes">Notes</option>
                   <option value="pyq">PYQ</option>
                   <option value="textbook">Book</option>
                </select>
              </div>
             <div className="flex items-center gap-4">
                <Button 
                  variant="gradient" 
                  disabled={uploading}
                  onClick={() => {
                    if (activeCourseId === 'all' && courses.length === 0) {
                        alert('No courses found. You must have at least one course assigned or created to publish documents.');
                        return;
                    }
                    fileInputRef.current?.click();
                  }}
                >
                  <div className="flex items-center">
                    {uploading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Upload size={14} className="mr-2" />}
                    {uploading ? 'Processing' : 'Publish Document'}
                  </div>
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx" 
                  className="hidden" 
                  onChange={handleUpload} 
                  disabled={uploading} 
                />
             </div>
           </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={20} />
          <Input 
            type="text"
            placeholder="Search documents by filename..."
            className="h-14 pl-14 rounded-2xl border-border bg-card/50 backdrop-blur-md font-bold focus-visible:ring-primary/20 shadow-soft"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Card className="px-5 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center gap-4 h-14 min-w-[200px]">
          <Filter size={18} className="text-muted-foreground" />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-[10px] font-black uppercase tracking-widest bg-card/80 dark:bg-slate-900/50 border-none focus:ring-1 focus:ring-primary/20 outline-none w-full cursor-pointer text-foreground rounded-lg px-2 h-full shadow-inner"
          >
            <option value="all">All Content</option>
            <option value="notes">Lecture Notes</option>
            <option value="pyq">Previous Year Papers</option>
            <option value="textbook">Textbooks</option>
          </select>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNotes.length > 0 ? filteredNotes.map((note) => (
          <Card key={note.id} className="group border-border shadow-soft overflow-hidden hover:shadow-strong hover:-translate-y-2 transition-all duration-500 bg-card/50 backdrop-blur-md h-[320px] flex flex-col justify-between">
            <CardContent className="p-8 relative">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all flex gap-2 z-10">
                  <a href={note.file_url} target="_blank">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-card border-border shadow-soft hover:text-primary transition-all">
                      <Download size={18} />
                    </Button>
                  </a>
                  <Button variant="destructive" size="icon" onClick={() => deleteNote(note.id, note.file_url)} className="h-10 w-10 rounded-xl shadow-soft">
                    <Trash2 size={18} />
                  </Button>
              </div>
              
              <div className="w-14 h-14 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mb-8 group-hover:bg-destructive group-hover:text-white transition-all shadow-inner">
                <FileText size={32} />
              </div>

              <div className="space-y-2 mb-6 min-w-0">
                  <div className="flex gap-2">
                    <Badge variant="glass" className="text-[9px] font-black text-primary border-primary/20 uppercase tracking-widest px-2.5 py-1">
                        {note.courses?.code || 'GEN'}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] font-black text-muted-foreground border-border uppercase tracking-widest px-2.5 py-1">
                        {note.category || 'NOTE'}
                    </Badge>
                  </div>
                 <h3 className="font-black text-foreground text-xl group-hover:text-primary transition-colors truncate uppercase tracking-tight italic leading-tight">
                    {note.title}
                 </h3>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest border-l-2 border-primary/20 pl-3 mt-3 truncate">
                    {note.courses?.name || 'General Material'}
                 </p>
              </div>
            </CardContent>
            
            <CardFooter className="px-8 py-5 bg-muted/30 border-t border-border flex items-center justify-between">
               <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-black uppercase tracking-widest">
                 <Calendar size={14} className="text-primary/40" />
                 {new Date(note.created_at).toLocaleDateString()}
               </div>
               <Badge variant="secondary" className="text-[9px] font-black text-muted-foreground border-border bg-card shadow-inner px-2 py-0.5 uppercase">
                  {note.title.split('.').pop()?.toUpperCase() || 'PDF'}
               </Badge>
            </CardFooter>
          </Card>
        )) : (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-[32px] bg-muted/5 space-y-6">
             <div className="w-20 h-20 bg-muted text-muted-foreground/30 rounded-[32px] flex items-center justify-center mx-auto border-2 border-dashed border-border group-hover:scale-110 transition-transform">
                <FileText size={40} />
             </div>
             <div>
                <p className="text-foreground font-black uppercase text-lg tracking-tight italic">Library empty</p>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1">No materials found matching your current search or filter.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
