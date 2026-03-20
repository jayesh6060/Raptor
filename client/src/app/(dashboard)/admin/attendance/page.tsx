'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, UserCheck, Calendar as CalendarIcon, Save, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function AttendanceMarking() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      // Fetch Students
      const { data: studentData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');
      setStudents(studentData || []);
      
      // Fetch Courses assigned to this teacher
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', user?.id)
        .order('name', { ascending: true });
      setCourses(courseData || []);
      
      if (courseData && courseData.length > 0) {
        setSubject(courseData[0].name);
      } else {
        setSubject('');
      }

      // Initialize attendance state with 'present'
      const initial: Record<string, string> = {};
      studentData?.forEach(s => initial[s.id] = 'present');
      setAttendance(initial);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: studentId,
      subject,
      date,
      status
    }));

    const { error } = await supabase.from('attendance').upsert(records, {
      onConflict: 'student_id, date, subject'
    });

    if (error) {
      alert('Error saving attendance: ' + error.message);
    } else {
      alert('Attendance saved successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mark Attendance</h1>
          <p className="text-slate-500">Record daily attendance for students.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-all"
        >
          <Save size={18} />
          Save All
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {courses.map(course => (
              <option key={course.id} value={course.name}>{course.code} - {course.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tight">
                          {student.usn || 'No USN'}
                        </span>
                        <p className="text-xs text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
                        attendance[student.id] === 'present'
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                          : "bg-white border-slate-100 text-slate-300 hover:border-emerald-200 hover:text-emerald-400"
                      )}
                    >
                      <Check size={20} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
                        attendance[student.id] === 'absent'
                          ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200"
                          : "bg-white border-slate-100 text-slate-300 hover:border-red-200 hover:text-red-400"
                      )}
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
