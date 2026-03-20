'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Upload, Trash2, Download, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note } from '@/types/database';

export default function AdminNotes() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
    setNotes(data || []);
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `notes/${fileName}`;

    // Upload to Supabase Storage (assuming bucket 'notes' exists)
    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload error: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('notes').getPublicUrl(filePath);

    // Save to Database
    const { error: dbError } = await supabase.from('notes').insert({
      title: file.name,
      file_url: publicUrl,
      uploaded_by: profile?.id
    });

    if (dbError) {
      alert('DB error: ' + dbError.message);
    } else {
      fetchNotes();
    }
    setUploading(false);
  };

  const deleteNote = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    // Extract file path from URL (simple version)
    const filePath = fileUrl.split('notes/').pop();
    if (filePath) {
        await supabase.storage.from('notes').remove([`notes/${filePath}`]);
    }
    
    await supabase.from('notes').delete().eq('id', id);
    fetchNotes();
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Notes</h1>
          <p className="text-slate-500">Manage and upload study materials.</p>
        </div>
        
        <label className="cursor-pointer">
          <div className={cn(
            "flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all",
            uploading && "opacity-50 cursor-not-allowed"
          )}>
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            {uploading ? 'Uploading...' : 'Upload PDF'}
          </div>
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search by title..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={note.file_url} target="_blank" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg">
                  <Download size={18} />
                </a>
                <button onClick={() => deleteNote(note.id, note.file_url)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 line-clamp-1">{note.title}</h3>
            <p className="text-xs text-slate-400 mt-2">Added on {new Date(note.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
