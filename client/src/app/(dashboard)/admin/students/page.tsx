'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Users, Search, Plus, UserPlus, Filter, MoreVertical, Mail, Phone, Trash2, X, Edit2, Shield, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Profile } from '@/types/database';

export default function StudentManagement() {
  const { profile: currentUserProfile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    usn: '',
    roll_number: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('name', { ascending: true });
    setStudents(data || []);
    setLoading(false);
  }

  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedStudent(null);
    setFormData({ 
      name: '', 
      email: '', 
      usn: '', 
      roll_number: '',
      phone: '' 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: any) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      usn: student.usn || '',
      roll_number: student.roll_number?.toString() || '',
      phone: student.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    
    setLoading(true);
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert('Error deleting student: ' + error.message);
    } else {
      fetchStudents();
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      usn: formData.usn,
      roll_number: parseInt(formData.roll_number) || null,
      phone: formData.phone,
      role: 'student'
    };

    if (modalMode === 'add') {
      try {
        const { error } = await supabase.from('profiles').insert([{
          ...payload,
          id: crypto.randomUUID()
        }]);
        
        if (error) {
          if (error.code === '23503') {
            alert('Cannot add student: Authentication account must be created first. Please ask the student to sign up on the registration page.');
          } else {
            alert('Error adding student: ' + error.message);
          }
        } else {
          setIsModalOpen(false);
          fetchStudents();
        }
      } catch (err) {
        console.error(err);
        alert('An unexpected error occurred.');
      }
    } else {
      const { error } = await supabase.from('profiles').update(payload).eq('id', selectedStudent.id);
      if (error) alert('Error updating student: ' + error.message);
      else {
        setIsModalOpen(false);
        fetchStudents();
      }
    }
    setSaving(false);
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.usn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Student Directory</h1>
          <p className="text-slate-500">Manage, add, and review student accounts.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all scale-100 active:scale-95"
        >
          <UserPlus size={20} />
          New Student
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 group transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{student.name}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{student.usn || 'NO USN'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail size={14} className="text-slate-300" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone size={14} className="text-slate-300" />
                        <span>{student.phone || 'NO PHONE'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {student.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-400 font-medium">
                    {new Date(student.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(student)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                  {modalMode === 'add' ? <UserPlus size={20} /> : <Edit2 size={20} />}
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {modalMode === 'add' ? 'Add New Student' : 'Edit Student'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter student name"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="student@college.edu"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
                {currentUserProfile?.role === 'admin' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 12345 67890"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">USN (Student ID)</label>
                    <input
                      required
                      type="text"
                      value={formData.usn}
                      onChange={(e) => setFormData({...formData, usn: e.target.value})}
                      placeholder="e.g. 4JD24CS..."
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all font-bold text-slate-900 uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Roll Number</label>
                    <input
                      required
                      type="number"
                      value={formData.roll_number}
                      onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
                      placeholder="123"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={16} />
                      {modalMode === 'add' ? 'Create Student' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
