'use client';

import React from 'react';
import { FileText, Upload, Download, Eye, Sparkles, CheckCircle2, ArrowLeft, Plus, Zap, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function ResumePage() {
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
            <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Resume Builder</h1>
            <p className="text-muted-foreground font-medium mt-3">Engineer a professional ATS-optimized profile or manage your existing credentials.</p>
          </div>
        </div>
        
        <Button variant="gradient" className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-strong">
           <Sparkles size={18} className="mr-3" /> 
           Auto-Generate Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Upload Current Resume */}
        <Card className="border-border shadow-soft bg-card/50 backdrop-blur-md overflow-hidden group">
          <CardHeader className="p-8 border-b border-border bg-muted/30">
            <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight italic">Document Registry</CardTitle>
            <CardDescription className="text-muted-foreground font-medium mt-1">Direct upload for verified candidate portfolios.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="border-2 border-dashed border-border rounded-[32px] p-10 bg-muted/5 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group/upload shadow-inner">
              <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center shadow-soft border border-border text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all mb-6">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic mb-2">Initialize Upload</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 opacity-60">Accepts .PDF and .DOCX artifacts (Max 5.0 MB)</p>
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-border bg-card">LOCAL FILESYSTEM</Badge>
            </div>

            <div className="bg-success/5 border border-success/10 rounded-2xl p-6 flex items-center justify-between group-hover:shadow-soft transition-all">
              <div className="flex items-center gap-5">
                 <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0 shadow-inner">
                   <ShieldCheck size={24} />
                 </div>
                 <div>
                   <p className="text-sm font-black text-foreground uppercase tracking-tight italic leading-none mb-2">Candidate_Profile_X.pdf</p>
                   <div className="flex items-center gap-2">
                     <Badge variant="success" className="text-[8px] font-black tracking-widest px-2 py-0.5">ACTIVE</Badge>
                     <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Verified 48h ago</p>
                   </div>
                 </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-card border-border shadow-soft hover:text-primary transition-all">
                  <Eye size={18} />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-card border-border shadow-soft hover:text-success transition-all">
                  <Download size={18} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Status / Info */}
        <Card className="bg-foreground text-background border-none shadow-strong overflow-hidden flex flex-col group">
           <CardHeader className="p-8 border-b border-background/5 bg-background/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[100px] pointer-events-none group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative z-10 flex items-center gap-4">
                 <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shadow-inner">
                    <Sparkles size={20} />
                 </div>
                 <div>
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tight italic leading-none">Smart Data Node</CardTitle>
                    <CardDescription className="text-primary font-black text-[9px] uppercase tracking-[0.2em] mt-2">Cross-Platform Profile Synchronization</CardDescription>
                 </div>
              </div>
           </CardHeader>
           
           <CardContent className="p-10 flex-1 space-y-10">
              <p className="text-sm font-medium text-background/60 leading-relaxed italic border-l-2 border-primary/20 pl-6">
                The Raptor AI engine automatically synthesizes your documented technical skills, instructional history, and project archives into a standardized resume format.
              </p>

              <div className="space-y-6">
                {[
                  { label: 'Profile integrity', value: '92%', color: 'text-success' },
                  { label: 'Technical Arsenal', value: '8 NODES', color: 'text-white' },
                  { label: 'Project Artifacts', value: '2 ACTIVE', color: 'text-white' },
                  { label: 'Professional Tenure', value: '2 ROLES', color: 'text-white' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group/row">
                    <span className="text-[10px] font-black text-background/40 uppercase tracking-widest group-hover/row:text-primary transition-colors">{item.label}</span>
                    <span className={cn("text-base font-black italic tracking-tight uppercase leading-none", item.color)}>{item.value}</span>
                  </div>
                ))}
              </div>
           </CardContent>
           
           <CardFooter className="p-8 border-t border-background/5 bg-background/5">
              <Link href="/profile" className="w-full">
                <Button variant="outline" className="w-full h-12 rounded-xl group/btn border-background/10 bg-background/5 text-white hover:bg-background hove:text-foreground hover:border-primary transition-all font-black uppercase text-[10px] tracking-widest">
                  Calibrate Profile Intelligence
                  <ChevronRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
           </CardFooter>
        </Card>

      </div>
    </div>
  );
}
