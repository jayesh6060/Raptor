'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Award, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  Activity,
  ShieldCheck,
  ChevronRight,
  Bell
} from 'lucide-react';
import { motion as _motion, AnimatePresence } from 'framer-motion';
const motion: any = _motion;
import { cn } from '@/lib/utils';
import { Exam } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

// Caching helper
const getCached = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const setCached = (key: string, val: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(val));
};

export default function StudentDashboard() {
  const { profile } = useAuth();
  
  const [stats, setStats] = useState({
    attendance: 0,
    courses: 0,
    gpa: 3.8
  });
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setAcknowledgedIds(getCached('acknowledged_announcements', []));
    // Load from cache on mount
    const cachedStats = getCached('student_stats', null);
    if (cachedStats) {
      setStats(cachedStats);
      setRecentAttendance(getCached('student_recent_attendance', []));
      setUpcomingExams(getCached('student_upcoming_exams', []));
      setAnnouncements(getCached('student_announcements', []));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
      if (!isPreview && (!profile?.id || !isMounted)) return;
      
      try {
        if (isPreview) {
          // Mock data for preview mode
          setAnnouncements([{
            id: 'mock-ann-1',
            title: 'URGENT SYSTEM UPDATE',
            content: 'The Raptor Node will undergo maintenance at 22:00. Please save your work.',
            created_at: new Date().toISOString()
          }]);
          setLoading(false);
          return;
        }

        const [attendanceRes, enrollmentsRes, examsRes, annRes] = await Promise.all([
          supabase.from('attendance').select('*').eq('student_id', profile?.id),
          supabase.from('enrollments').select('course_id').eq('student_id', profile?.id),
          supabase.from('exams').select('*').gte('date', new Date().toISOString()).order('date').limit(3),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(2)
        ]);

        const attendanceData = attendanceRes.data || [];
        const presentDays = attendanceData.filter(a => a.status === 'present').length;
        const totalDays = attendanceData.length;
        
        const newStats = {
          attendance: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
          courses: enrollmentsRes.data?.length || 0,
          gpa: 3.8 
        };
        
        const newAttendance = attendanceData.slice(0, 5);
        const newExams = examsRes.data || [];
        // Filter out placeholder/test data
        const newAnnouncements = (annRes.data || []).filter(a => 
          !a.title.toLowerCase().includes('lohit') && 
          !a.content.toLowerCase().includes('lohit')
        );

        // Update state
        setStats(newStats);
        setRecentAttendance(newAttendance);
        setUpcomingExams(newExams);
        setAnnouncements(newAnnouncements);
        
        // Persist to cache
        setCached('student_stats', newStats);
        setCached('student_recent_attendance', newAttendance);
        setCached('student_upcoming_exams', newExams);
        setCached('student_announcements', newAnnouncements);
      } catch (err) {
        console.error('Dashboard node telemetry failure:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [profile?.id, isMounted]);

  const statsData = [
    { label: 'Attendance', value: `${stats.attendance}%`, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Exams', value: upcomingExams.length.toString(), icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Courses', value: stats.courses.toString(), icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/student/courses' },
    { label: 'GPA Trace', value: stats.gpa.toFixed(1), icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');

  if (loading && !isPreview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold txt-future text-[10px]">Initializing Student Node...</p>
      </div>
    );
  }

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-none mx-auto space-y-12 pb-20 px-4 md:px-0"
    >
      {/* Global Announcements Alerts */}
      <AnimatePresence>
        {isMounted && announcements
          .filter(ann => !acknowledgedIds.includes(ann.id))
          .slice(0, 1) // Show only the most recent unacknowledged one as an alert
          .map((ann) => (
            <motion.div
              key={`alert-${ann.id}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="mb-10"
            >
              <Alert 
                variant="info" 
                title={ann.title}
                onClose={() => {
                  const newIds = [...acknowledgedIds, ann.id];
                  setAcknowledgedIds(newIds);
                  setCached('acknowledged_announcements', newIds);
                }}
                className="bg-indigo-600 text-white border-none shadow-strong rounded-[40px] px-10 py-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <p className="text-lg font-medium text-white/90 leading-relaxed max-w-3xl">
                    {ann.content}
                  </p>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[10px] txt-future font-black text-white/50 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                      {new Date(ann.created_at).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => {
                        const newIds = [...acknowledgedIds, ann.id];
                        setAcknowledgedIds(newIds);
                        setCached('acknowledged_announcements', newIds);
                      }}
                      className="bg-white text-indigo-600 hover:bg-slate-100 rounded-xl font-bold txt-future text-[10px] px-6"
                    >
                      Dismiss Portal
                    </Button>
                  </div>
                </div>
              </Alert>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Hero Header */}
      <motion.div variants={itemVariants}>
        <Card className="bg-indigo-600 text-white border-none shadow-strong overflow-hidden relative group rounded-[48px]">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[140px] -mr-64 -mt-64 pointer-events-none group-hover:bg-white/10 transition-colors" />
          <CardContent className="p-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-8 text-center md:text-left">
              <Badge variant="outline" className="text-[12px] txt-future text-white border-white/20 px-4 py-1.5 backdrop-blur-sm">Candidate Interface</Badge>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none font-display">
                Welcome, {isMounted ? profile?.name?.split(' ')[0] : '...'}
              </h1>
              <p className="text-white/80 font-medium text-xl leading-relaxed max-w-2xl">
                Your academic trajectory is currently <span className="text-white font-bold underline underline-offset-8 decoration-white/20">optimized</span>. You have {upcomingExams.length} examinations queued for the current cycle.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4">
                <Link href="/student/results">
                  <Button variant="secondary" className="h-16 px-10 rounded-2xl font-bold font-display shadow-strong group/btn bg-white text-indigo-600 hover:bg-slate-50 border-none transition-all text-lg">
                    <span>View Trajectory</span>
                    <ArrowRight size={22} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/student/notes">
                  <Button variant="secondary" className="h-16 px-10 rounded-2xl font-bold font-display shadow-strong group/btn bg-white text-indigo-600 hover:bg-slate-50 border-none transition-all text-lg">
                    <span>View Notes</span>
                    <ArrowRight size={22} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-48 h-48 bg-white/10 rounded-[56px] flex items-center justify-center backdrop-blur-md shadow-inner group-hover:rotate-12 transition-all duration-300 border border-white/5">
              <Zap size={96} className="text-white drop-shadow-2xl" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <motion.div variants={itemVariants} className="h-full">
              <Card className="h-full group border-slate-100 dark:border-slate-800 shadow-soft bg-white/50 dark:bg-slate-900/50 backdrop-blur-md hover:shadow-strong transition-all duration-200 overflow-hidden relative rounded-[40px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-600/10 transition-colors" />
                <CardContent className="p-10">
                  <div className={cn("inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-xl shadow-soft border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-600")}>
                    <Icon size={24} />
                    <span className="text-[11px] txt-future opacity-70 font-black">Active</span>
                  </div>
                  <p className="text-[12px] txt-future text-slate-400 font-bold mb-4 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-6xl font-black text-slate-950 dark:text-slate-100 tracking-tighter font-display leading-none">{stat.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          );

          if (stat.href) {
             return <Link href={stat.href} key={stat.label}>{content}</Link>;
          }
          return <div key={stat.label}>{content}</div>;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Announcements */}
          {announcements.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 overflow-hidden relative group rounded-[40px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <CardHeader className="p-12 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-soft border border-indigo-100/50">
                          <Activity size={28} />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-slate-950 dark:text-slate-100 tracking-tight font-display">System Broadcasts</CardTitle>
                        <p className="text-[11px] txt-future text-slate-400 font-black tracking-widest uppercase">Node Communications</p>
                      </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-6 relative z-10">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 hover:shadow-strong transition-all duration-200 group/ann">
                      <div className="flex items-center justify-between mb-4">
                          <h4 className="font-black text-slate-950 dark:text-slate-100 text-xl tracking-tight font-display group-hover/ann:text-indigo-600 dark:group-hover/ann:text-indigo-400 transition-colors">{ann.title}</h4>
                          <Badge variant="outline" className="text-[8px] txt-future px-2 py-1 border-rose-100 text-rose-500 bg-rose-50/50">CRITICAL</Badge>
                      </div>
                      <p className="text-slate-500 text-base font-medium leading-relaxed mb-6 pl-6 border-l-2 border-slate-100 group-hover/ann:border-indigo-100 transition-colors">{ann.content}</p>
                      <div className="flex items-center justify-between pt-2">
                          <span className="text-[10px] txt-future text-slate-400">
                            {new Date(ann.created_at).toLocaleDateString()}
                          </span>
                          <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl hover:bg-slate-50 text-[10px] txt-future font-bold">Acknowledge</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Attendance Ledger */}
          <motion.div variants={itemVariants}>
            <Card className="border-slate-100 dark:border-slate-800 shadow-strong bg-white dark:bg-slate-900 overflow-hidden rounded-[40px]">
              <CardHeader className="p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex flex-row items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-soft border border-indigo-100/50">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-black text-slate-950 dark:text-slate-100 tracking-tight font-display">Presence History</CardTitle>
                    <p className="text-[11px] txt-future text-slate-400 font-black tracking-widest uppercase">Data Logs</p>
                  </div>
                </div>
                <Link href="/student/attendance">
                  <Button variant="link" className="text-indigo-600 font-bold txt-future text-[11px]">Expand Ledger</Button>
                </Link>
              </CardHeader>
              <div className="divide-y divide-slate-50">
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((record) => (
                    <div key={record.id} className="p-10 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                      <div className="flex items-center gap-8">
                        <div className={cn(
                          "w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 shadow-soft border transition-all duration-300 group-hover:scale-110",
                          record.status === 'present' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                          {record.status === 'present' ? <ShieldCheck size={32} /> : <XCircle size={32} />}
                        </div>
                        <div>
                          <p className="text-2xl font-black text-slate-950 dark:text-slate-100 tracking-tight font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-none">{record.subject}</p>
                          <div className="flex items-center gap-2 text-[10px] txt-future text-slate-400 mt-3 opacity-60">
                            <Clock size={12} />
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={cn(
                        "h-10 px-6 rounded-xl font-bold txt-future text-[10px] shadow-sm",
                        record.status === 'present' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      )}>
                        {record.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24">
                    <Calendar size={64} className="mx-auto text-slate-100 mb-6" />
                    <p className="text-slate-400 txt-future font-bold text-[10px]">No activity logs discovered</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Exam Queue */}
        <div className="lg:col-span-4">
          <motion.div variants={itemVariants} className="h-full">
            <Card className="border-slate-100 dark:border-slate-800 shadow-strong bg-white dark:bg-slate-900 overflow-hidden h-full rounded-[40px]">
              <CardHeader className="p-10 bg-slate-50/30 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-soft border border-indigo-100/50">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-950 dark:text-slate-100 font-display">Active Assessments</CardTitle>
                    <p className="text-[10px] txt-future text-slate-400">Examination Queue</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {upcomingExams.length > 0 ? (
                  upcomingExams.map((exam) => {
                    const examDate = new Date(exam.date);
                    const month = examDate.toLocaleString('default', { month: 'short' }).toUpperCase();
                    const day = examDate.getDate();
                    
                    return (
                      <div key={exam.id} className="group p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 shadow-soft hover:shadow-strong relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-600/10 transition-colors" />
                        <div className="flex gap-8 relative z-10">
                          <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-[24px] shrink-0 group-hover:bg-white dark:group-hover:bg-slate-900 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-200 shadow-inner border border-slate-100/50 dark:border-slate-800/50">
                            <span className="text-[10px] txt-future font-bold opacity-60 mb-1">{month}</span>
                            <span className="text-4xl font-black leading-none font-display italic">{day}</span>
                          </div>
                          <div className="pt-2 flex-1">
                            <h4 className="font-black text-slate-950 dark:text-slate-100 text-lg leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-display line-clamp-2">{exam.title}</h4>
                            <div className="flex items-center gap-3 mt-4">
                               <Badge variant="outline" className="text-[9px] txt-future px-3 py-1 border-slate-100 bg-slate-50/50 group-hover:border-indigo-100 group-hover:text-indigo-600">{exam.duration} MINS</Badge>
                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                            </div>
                          </div>
                        </div>
                        <Link href={`/student/exams/${exam.id}`} className="block mt-8">
                          <Button variant="outline" className="w-full h-12 rounded-2xl group/btn border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-soft transition-all font-bold txt-future text-[10px]">
                             <span>Initialize Portal</span>
                             <ChevronRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-24 bg-slate-50/30 dark:bg-slate-900/30 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px]">
                     <GraduationCap size={48} className="mx-auto text-slate-200 mb-6" />
                     <p className="text-slate-400 txt-future font-bold text-[10px]">Queue Empty</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-10 pt-0">
                <Link href="/student/exams" className="w-full">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft font-bold txt-future text-[11px] hover:bg-slate-50 dark:hover:bg-slate-800">
                    Full Index
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
