'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Download, Search, ExternalLink } from 'lucide-react';

export default function StudentNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchNotes() {
      const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
      setNotes(data || []);
    }
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Study Materials</h1>
        <p className="text-slate-500 text-lg">Download and review notes uploaded by your instructors.</p>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Search for subjects, topics, or materials..."
          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredNotes.length > 0 ? filteredNotes.map((note) => (
          <div key={note.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="aspect-video bg-slate-50 relative flex items-center justify-center border-b border-slate-50">
                <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-lg shadow-red-100">
                    <FileText size={32} />
                </div>
                <div className="absolute top-4 right-4 px-2 py-1 bg-white/80 backdrop-blur rounded-md text-[10px] font-black text-slate-500 uppercase tracking-tighter shadow-sm">PDF DOCUMENT</div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">{note.title}</h3>
              
              <div className="flex items-center justify-between mt-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(note.created_at).toLocaleDateString()}</span>
                <div className="flex gap-2">
                    <a 
                        href={note.file_url} 
                        target="_blank" 
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
                        title="View Online"
                    >
                        <ExternalLink size={20} />
                    </a>
                    <a 
                        href={note.file_url} 
                        download
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Download size={18} />
                        Download
                    </a>
                </div>
              </div>
            </div>
          </div>
        )) : (
            <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                    <FileText size={48} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">No materials found</h3>
                <p className="text-slate-400 mt-2">Try searching with a different keyword.</p>
            </div>
        )}
      </div>
    </div>
  );
}
