'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Award, Upload, Download, Trash2, FileText, CheckCircle2, ArrowLeft, Plus, ShieldCheck, Search, Filter, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function CertificatesPage() {
  const { profile } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchCertificates();
    }
  }, [profile?.id]);

  async function fetchCertificates() {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn('Certificates table not yet initialized in database.');
          setCertificates([]);
          return;
        }
        throw error;
      }
      setCertificates(data || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !profile?.id) return;
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${profile.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(filePath);

        const { error: dbError } = await supabase.from('certificates').insert({
          name: file.name.split('.')[0],
          issuer: 'Self Uploaded',
          file_url: publicUrl,
          student_id: profile.id,
          status: 'pending',
          type: fileExt?.toLowerCase().includes('pdf') ? 'pdf' : 'image'
        });

        if (dbError) throw dbError;
      });

      await Promise.all(uploadPromises);
      fetchCertificates();
    } catch (err: any) {
      alert('One or more uploads failed: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteCertificate = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      const filePath = fileUrl.split('certificates/').pop();
      if (filePath) {
        await supabase.storage.from('certificates').remove([filePath]);
      }
      
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw error;
      
      fetchCertificates();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading && !uploading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Accessing Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <Link href="/student/campus">
            <Button variant="outline" size="sm" className="h-10 rounded-xl border-border bg-card shadow-soft hover:text-primary transition-all">
              <ArrowLeft size={16} className="mr-2" /> 
              Back to Campus
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Certificates</h1>
            <p className="text-muted-foreground font-medium mt-3">Vault for your verified academic achievements and technical credentials.</p>
          </div>
        </div>
        
        <Button 
          variant="gradient" 
          className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-strong"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
           {uploading ? <Loader2 size={18} className="mr-3 animate-spin" /> : <Upload size={18} className="mr-3" />}
           {uploading ? 'Processing' : 'Upload Credentials'}
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple
          onChange={handleFileUpload}
          accept=".pdf,image/*"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left: Upload & Filters */}
        <div className="lg:col-span-1 space-y-8">
          <Card 
            className="border-2 border-dashed border-border rounded-[32px] p-8 bg-muted/5 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group shadow-soft"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center shadow-soft border border-border text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all mb-6">
              {uploading ? <Loader2 size={32} className="animate-spin" /> : <Plus size={32} />}
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic mb-2">New Entry</h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6">Drag/drop PDF or Image artifacts here</p>
            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-border opacity-60">LIMIT: 5.0 MB</Badge>
          </Card>

          <Card className="p-6 border-border shadow-soft bg-card/50 backdrop-blur-md space-y-6">
             <div className="space-y-2">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Search</p>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                 <input 
                   className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" 
                   placeholder="Filter by name..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
             </div>
             <div className="space-y-3">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Identity Status</p>
               <div className="space-y-2">
                 {['All', 'Verified', 'Pending'].map(status => (
                   <div 
                     key={status} 
                     className={cn(
                       "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group",
                       filterStatus === status ? "bg-primary/10" : "hover:bg-muted/50"
                     )}
                     onClick={() => setFilterStatus(status)}
                   >
                     <div className={cn(
                       "w-2 h-2 rounded-full transition-colors",
                       filterStatus === status ? "bg-primary" : "bg-border group-hover:bg-primary"
                     )} />
                     <span className={cn(
                       "text-xs font-black text-foreground uppercase tracking-tight italic opacity-60 group-hover:opacity-100",
                       filterStatus === status && "opacity-100"
                     )}>{status}</span>
                   </div>
                 ))}
               </div>
             </div>
          </Card>
        </div>

        {/* Right: Gallery Grid */}
        <div className="lg:col-span-3">
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCertificates.map((cert) => (
                <Card key={cert.id} className="border-border shadow-soft bg-card/50 backdrop-blur-md group hover:shadow-strong transition-all duration-500 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-8">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-500",
                        cert.type === 'pdf' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                      )}>
                        <FileText size={28} />
                      </div>
                      {cert.status === 'verified' ? (
                        <Badge variant="success" className="font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1.5 shadow-soft border-success/10">
                          <CheckCircle2 size={12} className="mr-1.5" /> VERIFIED
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1.5 shadow-soft border-warning/10">
                          QUEUED
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic mb-2 line-clamp-1 group-hover:text-primary transition-colors">{cert.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-8 opacity-60">
                      <ShieldCheck size={12} className="text-primary/40" />
                      {cert.issuer}
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-border pt-6 mt-4">
                      <div className="flex flex-col gap-1">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">TIMESTAMP</p>
                         <span className="text-xs font-black text-foreground uppercase italic">{new Date(cert.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <a href={cert.file_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-card border-border shadow-soft hover:text-primary transition-all">
                            <Download size={18} />
                          </Button>
                        </a>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl bg-card border-border shadow-soft hover:text-destructive transition-all"
                          onClick={() => deleteCertificate(cert.id, cert.file_url)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-[32px] bg-muted/5 space-y-6">
              <div className="w-20 h-20 bg-muted text-muted-foreground/30 rounded-[32px] flex items-center justify-center mx-auto border-2 border-dashed border-border group-hover:scale-110 transition-transform">
                < Award size={40} />
              </div>
              <div>
                <p className="text-foreground font-black uppercase text-lg tracking-tight italic">Vault empty</p>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1">No certificates found matching your current search or filter.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
