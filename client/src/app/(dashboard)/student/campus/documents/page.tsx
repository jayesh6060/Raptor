'use client';

import React, { useState } from 'react';
import { Files, Upload, Download, Trash2, ShieldCheck, AlertTriangle, FileBadge, ArrowLeft, Search, Filter, HardDrive, CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import html2canvas from 'html2canvas';

// Dynamically import the high-fidelity synthesis node to avoid hydration mismatches
const ResumeTemplate = dynamic(() => import('@/components/ResumeTemplate').then(mod => mod.ResumeTemplate), { ssr: false });
import jsPDF from 'jspdf';

export default function DocumentsPage() {
  const { profile } = useAuth();
  const [academicData, setAcademicData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch academic marks (consistent with resume page)
  React.useEffect(() => {
    async function loadMarks() {
      if (!profile?.id) return;
      const { data } = await supabase
        .from('submissions')
        .select(`score, total_possible`)
        .eq('student_id', profile.id);
      
      if (data && data.length > 0) {
        setAcademicData(data);
      } else {
        setAcademicData([
          { subject: 'Database Management Systems', score: 88, total_possible: 100 },
          { subject: 'Operating Systems', score: 92, total_possible: 100 },
          { subject: 'Computer Networks', score: 74, total_possible: 100 },
          { subject: 'Software Engineering', score: 85, total_possible: 100 }
        ]);
      }
    }
    loadMarks();
  }, [profile?.id]);

  const [documents, setDocuments] = useState([
    { id: 99, name: 'Professional Resume', category: 'Academic Artifact', date: 'Just Now', status: 'verified', type: 'pdf', size: '0.8 MB' },
    { id: 1, name: 'Aadhaar Card', category: 'Identity Proof', date: '10 Aug 2023', status: 'verified', type: 'pdf', size: '1.2 MB' },
    { id: 2, name: '10th Marksheet', category: 'Academic', date: '12 Aug 2023', status: 'verified', type: 'image', size: '3.1 MB' },
    { id: 3, name: '12th Marksheet', category: 'Academic', date: '12 Aug 2023', status: 'verified', type: 'pdf', size: '2.8 MB' },
    { id: 4, name: 'Income Certificate', category: 'Financial', date: '15 Jan 2025', status: 'pending', type: 'pdf', size: '1.5 MB' }
  ]);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to permanently delete this institutional artifact from your vault?")) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const handleRetrieve = async (docName: string) => {
    if (docName !== 'Professional Resume') {
      alert(`Retrieving ${docName}...`);
      return;
    }

    setIsGenerating(true);
    // console.log("Initializing high-fidelity capture node...");
    
    try {
      const originalResume = document.getElementById('resume-document');
      if (!originalResume) {
        alert('Vault Error: Generation Node not found in DOM.');
        setIsGenerating(false);
        return;
      }
      
      // Clone and append to body to ensure visibility and avoid layout tainting
      const captureNode = originalResume.cloneNode(true) as HTMLElement;
      captureNode.style.display = 'flex';
      captureNode.style.position = 'fixed';
      captureNode.style.left = '0';
      captureNode.style.top = '0';
      captureNode.style.zIndex = '-9999';
      document.body.appendChild(captureNode);
      
      const canvas = await html2canvas(captureNode, {
        scale: 1.2, // Balanced for stability and high quality
        useCORS: true,
        allowTaint: false,
        logging: true,
        backgroundColor: '#ffffff',
        width: 794, // Standard A4 width in pixels at 96dpi (approx)
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Remove temporary capture node immediately
      document.body.removeChild(captureNode);

      // Robust Validation with Length Check
      if (!imgData || imgData.length < 1000 || !imgData.startsWith('data:image/jpeg')) {
        throw new Error(`Archival Signature Invalid (${imgData?.length || 0} bytes).`);
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `${profile?.name || 'MALLI'}_Official_Portfolio.pdf`;
      pdf.save(fileName);
      alert('SYNTHESIS COMPLETE: Your professional portfolio has been exported successfully.');
      
    } catch (err: any) {
      console.error("Critical Synthesis Error:", err);
      alert('Synthesis Engine Failure: ' + err.message + '\n\nPlease ensure your institutional profile is fully synchronized.');
    } finally {
      setIsGenerating(false);
    }
  };

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
            <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Official Documents</h1>
            <p className="text-muted-foreground font-medium mt-3">Securely upload and manage your verified institutional archives and identity artifacts.</p>
          </div>
        </div>
        
        <Button variant="gradient" className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-strong">
           <Upload size={18} className="mr-3" /> 
           Initialize Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Alerts & Upload */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Missing Required Documents Alert */}
          <Card className="bg-warning text-warning-foreground border-none shadow-strong overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] pointer-events-none group-hover:bg-white/20 transition-all duration-500" />
            <CardContent className="p-8 space-y-6 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-inner backdrop-blur-md">
                     <AlertTriangle size={24} />
                  </div>
                  <h4 className="font-black text-lg uppercase tracking-tight italic leading-none">Action Required</h4>
               </div>
               <p className="text-sm font-medium leading-relaxed italic opacity-80 border-l-2 border-white/20 pl-4">
                 Your <span className="text-white font-black underline underline-offset-4 decoration-white/30 truncate">Transfer Certificate (TC)</span> is missing from the registry. Finalize upload to avoid registration latency.
               </p>
               <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white hover:text-warning transition-all font-black uppercase text-[9px] tracking-widest">
                 Upload Missing Artifact
               </Button>
            </CardContent>
          </Card>

          {/* Upload Node */}
          <Card className="border-2 border-dashed border-border rounded-[40px] p-10 bg-muted/5 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group shadow-soft">
            <div className="w-20 h-20 bg-card rounded-[28px] flex items-center justify-center shadow-soft border border-border text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all mb-8">
              <HardDrive size={36} />
            </div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic mb-3">Initialize Archive</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-8 opacity-60">PDF / JPG / PNG (Max 10.0 MB)</p>
            <div className="flex flex-wrap justify-center gap-2">
               {['Identity', 'Academic', 'Finance'].map(tag => (
                 <Badge key={tag} variant="outline" className="text-[8px] font-black uppercase tracking-widest border-border bg-card">{tag}</Badge>
               ))}
            </div>
          </Card>
        </div>

        {/* Right: Repository List */}
        <Card className="lg:col-span-8 border-border shadow-strong bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="p-8 border-b border-border bg-muted/30 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
                  <Files size={20} />
               </div>
               <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight italic">Document Vault</CardTitle>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="h-10 rounded-xl bg-card border-border"><Filter size={14} className="mr-2" /> Filter</Button>
               <Button variant="outline" size="sm" className="h-10 rounded-xl bg-card border-border"><Search size={14} className="mr-2" /> Search</Button>
            </div>
          </CardHeader>
          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div key={doc.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/30 transition-all group">
                <div className="flex items-center gap-6 border-l-4 border-transparent group-hover:border-primary pl-4 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-muted/50 border border-border text-muted-foreground flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <FileBadge size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-xl uppercase tracking-tight italic flex items-center gap-3">
                      {doc.name}
                      {doc.status === 'verified' && (
                        <div className="p-1 bg-success/10 text-success rounded-md shadow-inner">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                      <Badge variant="glass" className={cn(
                        "text-[9px] font-black tracking-widest uppercase border-primary/20",
                        doc.category === 'Identity Proof' ? 'text-primary' : 'text-success'
                      )}>{doc.category}</Badge>
                      <span className="flex items-center gap-2"><Calendar size={12} className="text-primary/40" /> {doc.date}</span>
                      <span className="flex items-center gap-2"><HardDrive size={12} className="text-primary/40" /> {doc.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500">
                  <Button 
                    variant="outline" 
                    onClick={() => handleRetrieve(doc.name)}
                    className="h-11 px-5 rounded-[14px] bg-card border-border shadow-soft hover:text-primary transition-all font-black uppercase text-[9px] tracking-widest"
                  >
                    <Download size={16} className="mr-2" /> Retrieve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDelete(doc.id)}
                    className="h-11 w-11 rounded-[14px] bg-card border-border shadow-soft hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <CardFooter className="p-6 bg-muted/10 border-t border-border flex justify-center text-center">
             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 italic">End of document registry</p>
          </CardFooter>
        </Card>
      </div>
      <div className="hidden">
         <ResumeTemplate profile={profile} academicData={academicData} />
      </div>

    </div>
  );
}
