'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  BookOpen, 
  Code2, 
  Briefcase, 
  FolderGit2, 
  GraduationCap,
  Award,
  Shield,
  Edit3,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Zap,
  Plus as PlusIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Loader2, Check, X } from 'lucide-react';

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const editMode = searchParams.get('edit') === 'true';
  
  const [isEditing, setIsEditing] = useState(editMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    usn: profile?.usn || '',
    course: profile?.course || '',
    phone: profile?.phone || '',
    roll_number: profile?.roll_number?.toString() || '',
    bio: profile?.bio || '',
    expertise: profile?.expertise?.join(', ') || '',
    experience: profile?.experience || '',
    department: profile?.department || '',
    github: profile?.github || '',
    twitter: profile?.twitter || '',
    linkedin: profile?.linkedin || '',
    website: profile?.website || ''
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [mounted, setMounted] = useState(false);

  const role = profile?.role || 'student';
  const isStudent = role === 'student';
  const isTeacher = role === 'teacher';
  const isAdmin = role === 'admin';

  // Update formData when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        usn: profile.usn || '',
        course: profile.course || '',
        phone: profile.phone || '',
        roll_number: profile.roll_number?.toString() || '',
        bio: profile.bio || '',
        expertise: profile.expertise?.join(', ') || '',
        experience: profile.experience || '',
        department: profile.department || '',
        github: profile.github || '',
        twitter: profile.twitter || '',
        linkedin: profile.linkedin || '',
        website: profile.website || ''
      });
    }
  }, [profile]);

  // Sync isEditing with query param if it changes
  useEffect(() => {
    if (editMode) setIsEditing(true);
    setMounted(true);
  }, [editMode]);

  const handleSave = async () => {
    if (!profile?.id) return;
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          usn: formData.usn,
          course: formData.course,
          phone: formData.phone,
          roll_number: (formData.roll_number && !isNaN(parseInt(formData.roll_number))) ? parseInt(formData.roll_number) : null,
          bio: formData.bio,
          expertise: formData.expertise ? formData.expertise.split(',').map(s => s.trim()).filter(s => s !== '') : [],
          experience: formData.experience,
          department: formData.department,
          github: formData.github,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          website: formData.website
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      
      setIsEditing(false);
      // Update global auth state instead of reloading
      const updatedProfile = { 
        ...profile, 
        ...formData, 
        roll_number: (formData.roll_number && !isNaN(parseInt(formData.roll_number))) ? parseInt(formData.roll_number) : null,
        expertise: formData.expertise ? formData.expertise.split(',').map(s => s.trim()).filter(s => s !== '') : []
      };
      updateProfile(updatedProfile as any);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Error saving changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile?.id || !e.target.files || e.target.files.length === 0) return;
    
    setUploadingAvatar(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    try {
      // 1. Upload to Supabase Storage (using 'notes' bucket as it is verified to exist)
      const { error: uploadError } = await supabase.storage
        .from('notes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('notes')
        .getPublicUrl(filePath);

      // 3. Update Profile in DB
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // 4. Update global auth state instead of reloading
      const updatedProfile = { ...profile, avatar: publicUrl };
      updateProfile(updatedProfile as any);
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      alert('Failed to upload avatar: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Mock data fallbacks
  const mockUSN = formData.usn || profile?.usn || (isStudent ? "4JD24CS088" : null);
  const displayName = formData.name || profile?.name || (isStudent ? "Student Candidate" : isTeacher ? "Faculty Member" : "Administrator");
  
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* 1. Profile Identity Header */}
      <Card className="border-border shadow-strong overflow-hidden bg-card/50 backdrop-blur-md relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-muted text-muted-foreground flex items-center justify-center border-4 border-card shadow-strong overflow-hidden group-hover:scale-105 transition-transform duration-500">
               {(profile?.avatar || uploadingAvatar) ? (
                 <div className="relative w-full h-full">
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        <Loader2 className="animate-spin text-white" size={32} />
                      </div>
                    )}
                    <img src={profile?.avatar} alt="Profile" className="w-full h-full object-cover" />
                 </div>
               ) : (
                 <User size={64} className="opacity-20" />
               )}
            </div>
            <Button 
              size="icon" 
              variant="gradient" 
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl shadow-strong border-2 border-card"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? <Loader2 className="animate-spin" size={18} /> : <PlusIcon size={18} />}
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Badge variant="glass" className="text-[9px] font-black tracking-widest bg-primary/10 text-primary border-primary/20 px-3 py-1">
                {mounted && (isStudent ? <GraduationCap size={12} className="mr-1.5" /> : isTeacher ? <Award size={12} className="mr-1.5" /> : <Shield size={12} className="mr-1.5" />)}
                {mounted ? role.toUpperCase() : 'USER'} IDENTITY
              </Badge>
              <Badge variant="secondary" className="text-[9px] font-black tracking-widest bg-muted/50 border-border px-3 py-1">VERIFIED MEMBER</Badge>
            </div>
            
            <div>
              {!mounted ? (
                <span className="block h-12 w-64 bg-muted animate-pulse rounded-xl" />
              ) : isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      className="h-14 bg-background/50 border-border text-2xl font-black uppercase tracking-tighter italic"
                    />
                  </div>

                  {isStudent && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">USN ID</label>
                        <Input 
                          value={formData.usn}
                          onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                          placeholder="Enter USN"
                          className="h-10 bg-background/30 border-border text-xs font-bold uppercase tracking-widest"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                        <Input 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Contact Number"
                          className="h-10 bg-background/30 border-border text-xs font-bold uppercase tracking-widest"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Roll Number</label>
                        <Input 
                          value={formData.roll_number}
                          onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                          placeholder="Roll No"
                          className="h-10 bg-background/30 border-border text-xs font-bold uppercase tracking-widest"
                        />
                      </div>
                    </div>
                  )}

                  {isTeacher && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Department</label>
                        <Input 
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          placeholder="e.g. Computer Science"
                          className="h-10 bg-background/30 border-border text-xs font-bold uppercase tracking-widest"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Academic Tenure</label>
                        <Input 
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          placeholder="e.g. 2020 - Present"
                          className="h-10 bg-background/30 border-border text-xs font-bold uppercase tracking-widest"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">About (Bio)</label>
                        <textarea 
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Tell us about yourself..."
                          className="w-full min-h-[100px] p-4 bg-background/30 border border-border rounded-xl text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Expertise (Comma separated)</label>
                        <Input 
                          value={formData.expertise}
                          onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                          placeholder="e.g. AI, Cloud, Distributed Systems"
                          className="h-10 bg-background/30 border-border text-xs font-bold uppercase tracking-widest"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border mt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 mb-4">Social Presence (URLs)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">GitHub</label>
                        <Input 
                          value={formData.github}
                          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                          placeholder="https://github.com/..."
                          className="h-10 bg-background/30 border-border text-[10px] font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Twitter</label>
                        <Input 
                          value={formData.twitter}
                          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                          placeholder="https://twitter.com/..."
                          className="h-10 bg-background/30 border-border text-[10px] font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">LinkedIn</label>
                        <Input 
                          value={formData.linkedin}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="h-10 bg-background/30 border-border text-[10px] font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Website</label>
                        <Input 
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://..."
                          className="h-10 bg-background/30 border-border text-[10px] font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-5xl font-black text-foreground tracking-tighter italic uppercase leading-tight">{displayName}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-muted-foreground font-black uppercase text-[10px] tracking-widest">
                    {isStudent ? (
                      <>
                        <span className="flex items-center gap-2 bg-muted px-2.5 py-1 rounded-lg border border-border">ID: <span className="text-foreground italic">{mockUSN}</span></span>
                        <span className="flex items-center gap-2">Batch of 2026</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-2 bg-muted px-2.5 py-1 rounded-lg border border-border font-black italic">{profile?.department || 'COMPUTER SCIENCE'}</span>
                        <span className="flex items-center gap-2">{profile?.experience || 'Senior Faculty'}</span>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[180px]">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  variant="gradient" 
                  className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-strong"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Check size={16} className="mr-2" />}
                  Save Changes
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  variant="secondary" 
                  className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest"
                >
                  <X size={16} className="mr-2" />
                  Discard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="gradient" 
                  className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-strong"
                >
                  <Edit3 size={16} className="mr-2" />
                  Modify Profile
                </Button>
                   <div className="flex gap-2 justify-center md:justify-end">
                    {[
                      { icon: Github, url: profile?.github },
                      { icon: Twitter, url: profile?.twitter },
                      { icon: Linkedin, url: profile?.linkedin },
                      { icon: Globe, url: profile?.website }
                    ].map(({ icon: Icon, url }, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="icon" 
                        className={cn(
                          "h-10 w-10 rounded-xl bg-card border-border shadow-soft transition-all",
                          url ? "text-primary hover:text-primary hover:scale-110" : "opacity-20 cursor-not-allowed"
                        )}
                        onClick={() => url && window.open(url, '_blank')}
                      >
                        <Icon size={16} />
                      </Button>
                    ))}
                  </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Deep Details */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* About Section */}
          <Card className="border-border shadow-soft bg-card/50 backdrop-blur-md">
            <CardHeader className="p-8 border-b border-border bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
                  <User size={20} />
                </div>
                <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight italic">Biographical Abstract</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed font-medium text-base">
                {!mounted ? (
                  <span className="block h-4 w-full bg-muted animate-pulse rounded" />
                ) : profile?.bio || (isStudent 
                  ? "I am a high-performance candidate specializing in Computer Science, deeply integrated with the modern tech stack. Currently focused on building scalable cloud solutions and mastering distributed systems architecture."
                  : "Distinguished academician with over a decade of excellence in higher education and technical research. Spearheading the next generation of engineers through rigorous practical instruction and innovative curriculum design.")}
              </p>
            </CardContent>
          </Card>

          {/* Technical Arsenal */}
          <Card className="border-border shadow-soft bg-card/50 backdrop-blur-md">
            <CardHeader className="p-8 border-b border-border bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center shadow-inner">
                  {isStudent ? <Code2 size={20} /> : <BookOpen size={20} />}
                </div>
                <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight italic">
                  {isStudent ? "Technical Arsenal" : "Instructional Expertise"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-3">
                {!mounted ? (
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="h-8 w-20 bg-muted animate-pulse rounded-xl" />)}
                  </div>
                ) : ( (profile?.expertise && profile.expertise.length > 0) ? profile.expertise : (isStudent 
                  ? ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Git', 'Docker', 'AWS']
                  : ['Curriculum Design', 'Academic Research', 'Student Mentoring', 'Course Management', 'Educational Leadership', 'System Architecture'])
                ).map(skill => (
                  <Badge key={skill} variant="outline" className="px-4 py-2 border-border bg-muted/30 text-foreground font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all cursor-default">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Professional Trajectory */}
          <Card className="border-border shadow-soft bg-card/50 backdrop-blur-md">
            <CardHeader className="p-8 border-b border-border bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-warning/10 text-warning rounded-xl flex items-center justify-center shadow-inner">
                  <Briefcase size={20} />
                </div>
                <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight italic">
                  {isStudent ? "Professional Exposure" : "Academic Tenure"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-10">
                <div className="border-l-4 border-primary/20 pl-8 relative ml-2">
                  <div className="absolute w-5 h-5 bg-primary rounded-full -left-[12px] top-1 border-4 border-card shadow-strong" />
                  <div className="space-y-1">
                    <h3 className="font-black text-foreground uppercase text-lg tracking-tight italic leading-none">
                      {!mounted ? <span className="block h-6 w-32 bg-muted animate-pulse rounded" /> : (isStudent ? "Full-Stack Apprentice" : "Faculty Tenure")}
                    </h3>
                    <p className="text-xs font-black text-primary uppercase tracking-widest mt-2">
                      {!mounted ? <span className="block h-4 w-48 bg-muted animate-pulse rounded" /> : (isStudent ? "RAPTOR DEV SYSTEMS" : "GLOBAL INSTITUTE OF TECHNOLOGY")}
                    </p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                      {!mounted ? "LOADING..." : (isStudent ? "JUNE 2025 - AUGUST 2025" : (profile?.experience || "AUGUST 2020 - PRESENT"))}
                    </p>
                  </div>
                  <p className="text-muted-foreground font-medium mt-6 leading-relaxed bg-muted/20 p-5 rounded-2xl border border-border">
                    {!mounted ? (
                      <span className="block h-12 w-full bg-muted animate-pulse rounded" />
                    ) : (isStudent 
                      ? "Orchestrated complex frontend architectures and implemented reactive data-binding protocols. Streamlined API integration workflows by 40% using modern TypeScript patterns."
                      : "Architecting the technical foundation of the engineering department. Directing large-scale research initiatives in high-performance computing and student logic development.")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: Static Metrics */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Institutional Anchor */}
          <Card className="border-border shadow-soft bg-card/50 backdrop-blur-md">
            <CardHeader className="p-8 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
                  <BookOpen size={20} />
                </div>
                <CardTitle className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Academic Anchor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                  <div className="w-12 h-12 bg-white dark:bg-card border border-primary/20 rounded-xl flex items-center justify-center shadow-soft">
                     <Zap size={24} className="text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-foreground uppercase text-base tracking-tight italic leading-none">Global Institute</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-2">
                      {mounted ? (isStudent ? "B.TECH COMPUTER SCIENCE" : "PH.D. AI & ARCHITECTURE") : "ACADEMIC PROGRAM"}
                    </p>
                    <Badge variant="outline" className="mt-3 text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary opacity-80">
                      {mounted ? (isStudent ? "CLASS OF 2026 • SEM-VI" : "AI SPECIALIZATION") : "SPECIALIZATION"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secure Registry Details */}
          <Card className="border-border shadow-soft bg-card/50 backdrop-blur-md">
            <CardHeader className="p-8 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center shadow-inner">
                  <Shield size={20} />
                </div>
                <CardTitle className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Secure Registry</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border group">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-primary transition-colors shadow-soft">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Authenticated Domain</p>
                  <p className="text-sm font-black text-foreground truncate italic">
                    {mounted ? (profile?.email || (isStudent ? 'S-CANDIDATE@RAPTOR.EDU' : 'FACULTY@RAPTOR.AC.IN')) : 'AUTHENTICATING...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border group">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-primary transition-colors shadow-soft">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Verified Handset</p>
                  <p className="text-sm font-black text-foreground italic">{profile?.phone || '+91 98765 43210'}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border group">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-primary transition-colors shadow-soft">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Geo-Location Registry</p>
                  <p className="text-sm font-black text-foreground italic">BANGALORE, IN</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

