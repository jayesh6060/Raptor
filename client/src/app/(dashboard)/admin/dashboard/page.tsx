'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Trophy, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeExams: 0,
    totalNotes: 0,
    avgAttendance: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // New states for admin tools
  const [newEmail, setNewEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementStatus, setAnnouncementStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  const handleAllowEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setEmailStatus({ type: null, msg: '' });
    const { error } = await supabase.from('allowed_emails').insert([{ email: newEmail.trim().toLowerCase() }]);
    
    if (error) {
      if (error.code === '23505') { // Unique violation
        setEmailStatus({ type: 'error', msg: 'Email is already authorized.' });
      } else {
        setEmailStatus({ type: 'error', msg: 'Failed to authorize email.' });
      }
    } else {
      setEmailStatus({ type: 'success', msg: `Successfully whitelisted ${newEmail}` });
      setNewEmail('');
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementContent) return;

    setAnnouncementStatus({ type: null, msg: '' });
    const { error } = await supabase.from('announcements').insert([{
      title: announcementTitle.trim(),
      content: announcementContent.trim()
    }]);

    if (error) {
      setAnnouncementStatus({ type: 'error', msg: 'Failed to post announcement.' });
    } else {
      setAnnouncementStatus({ type: 'success', msg: 'Announcement posted to all students.' });
      setAnnouncementTitle('');
      setAnnouncementContent('');
    }
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: studentCount },
          { count: examCount },
          { count: notesCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('exams').select('*', { count: 'exact', head: true }),
          supabase.from('notes').select('*', { count: 'exact', head: true })
        ]);

        // Fetch recent activities (joined students)
        const { data: activitiesData } = await supabase
          .from('profiles')
          .select('id, name, created_at')
          .eq('role', 'student')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalStudents: studentCount || 0,
          activeExams: examCount || 0,
          totalNotes: notesCount || 0,
          avgAttendance: 85 // Mocked for now
        });
        
        setRecentActivities(activitiesData || []);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Exams', value: stats.activeExams, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Notes', value: stats.totalNotes, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-3">Welcome to <span className="gradient-text">Raptor</span></h1>
        <p className="text-muted-foreground font-medium tracking-wide">Your intelligent campus management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="group card-hover cursor-pointer overflow-hidden border-border relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <CardContent className="p-7 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300", card.bg, card.color)}>
                    <Icon size={28} />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <TrendingUp size={14} />
                    +12%
                  </div>
                </div>
                <p className="text-muted-foreground text-sm font-bold tracking-wide">{card.label}</p>
                <h3 className="text-4xl font-black text-foreground mt-2 tracking-tighter">{card.value}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 p-8 border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Recent Activities</h2>
            <Button variant="secondary" className="text-primary hover:text-primary">View All</Button>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent pointer-events-none">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pointer-events-auto">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-primary/10 text-primary shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <UserCheck size={20} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl bg-muted/40 border border-border/50 shadow-sm group-hover:shadow-md transition-shadow group-hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-foreground text-sm">New Student</p>
                      <time className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">
                        {new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </time>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">Account created for <span className="font-bold text-foreground">{activity.name}</span></p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border relative z-10 pointer-events-auto">
                <Clock size={40} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-base text-muted-foreground font-bold">No recent activities — Raptor is ready when you are.</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-8 border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors pointer-events-none" />
            <h2 className="text-xl font-bold text-foreground mb-2 relative z-10 tracking-tight">Authorize Email</h2>
            <p className="text-sm font-medium text-muted-foreground mb-6 relative z-10">Only students with emails in the whitelist can sign up.</p>
            
            <form onSubmit={handleAllowEmail} className="space-y-4 relative z-10">
              <div className="relative group/input">
                 <Input 
                   type="email" 
                   id="auth-email"
                   placeholder="Student Email" 
                   value={newEmail}
                   onChange={(e) => setNewEmail(e.target.value)}
                   required
                 />
              </div>
              <Button type="submit" variant="gradient" className="w-full">
                Whitelist Email
              </Button>
              {emailStatus.msg && (
                <p className={cn("text-xs font-bold px-2 text-center py-2 rounded-xl mt-2", emailStatus.type === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
                  {emailStatus.msg}
                </p>
              )}
            </form>
          </Card>

          <Card className="p-8 border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-warning/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-warning/20 transition-colors pointer-events-none" />
            <h2 className="text-xl font-bold text-foreground mb-2 relative z-10 tracking-tight">Global Announcement</h2>
            <p className="text-sm font-medium text-muted-foreground mb-6 relative z-10">Broadcast updates directly to student dashboards.</p>
            
            <form onSubmit={handlePostAnnouncement} className="space-y-4 relative z-10">
               <div className="relative group/input">
                 <Input 
                   type="text" 
                   id="ann-title"
                   placeholder="Announcement Title" 
                   value={announcementTitle}
                   onChange={(e) => setAnnouncementTitle(e.target.value)}
                   required
                 />
              </div>
              <textarea 
                placeholder="Message body..." 
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all resize-none shadow-sm placeholder:text-muted-foreground"
              />
              <Button type="submit" variant="gradient" className="w-full">
                Post Update
              </Button>
              {announcementStatus.msg && (
                <p className={cn("text-xs font-bold px-2 text-center py-2 rounded-xl mt-2", announcementStatus.type === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
                  {announcementStatus.msg}
                </p>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
