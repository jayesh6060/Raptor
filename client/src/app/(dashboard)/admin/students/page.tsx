'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Users, Search, Plus, UserPlus, Filter, MoreVertical, Mail, Phone, Trash2, X, Edit2, Shield, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Profile } from '@/types/database';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

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
          <h1 className="text-3xl font-black text-foreground tracking-tight">Student Directory</h1>
          <p className="text-muted-foreground font-medium">Manage, add, and review student accounts.</p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="gradient"
          className="rounded-2xl px-6 py-6 shadow-strong group"
        >
          <UserPlus size={20} className="mr-2 group-hover:scale-110 transition-transform" />
          New Student
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1 p-1 border-border shadow-soft relative group overflow-hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={18} />
          <Input 
            type="text" 
            placeholder="Search by name, email or ID..."
            className="w-full border-none bg-transparent focus-visible:ring-0 shadow-none pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>
        <Button variant="outline" className="px-6 py-7 rounded-2xl text-muted-foreground font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-muted transition-all border-border shadow-soft">
          <Filter size={18} />
          Filters
        </Button>
      </div>

      <Card className="border-border shadow-soft overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border">
              <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12">Student</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12">Contact Info</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12">Role</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12">Joined Date</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest h-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/30 group transition-colors border-border">
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
                      {student.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">{student.usn || 'NO USN'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <Mail size={14} className="text-primary/50" />
                      <span>{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <Phone size={14} className="text-primary/50" />
                      <span>{student.phone || 'NO PHONE'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <Badge variant="secondary" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground border-border">
                    {student.role}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-6 text-muted-foreground font-medium text-xs">
                  {new Date(student.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenEdit(student)}
                      className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(student.id)}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-border bg-card">
            <div className="px-8 py-6 bg-muted/30 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-strong">
                  {modalMode === 'add' ? <UserPlus size={24} /> : <Edit2 size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">
                    {modalMode === 'add' ? 'Add New Student' : 'Edit Student'}
                  </h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{modalMode === 'add' ? 'Onboard' : 'Update'} Profile</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-xl hover:bg-background border-border">
                <X size={20} />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-7">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <Input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter student name"
                    className="h-14 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="student@raptor.edu"
                    className="h-14 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20"
                  />
                </div>
                {(currentUserProfile?.role === 'admin' || currentUserProfile?.role === 'teacher') && (
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Mobile Number</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 12345 67890"
                      className="h-14 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20"
                    />
                  </div>
                )}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">USN (Student ID)</label>
                  <Input
                    required
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({...formData, usn: e.target.value})}
                    placeholder="e.g. 4JD24CS..."
                    className="h-14 rounded-2xl border-border bg-muted/10 font-bold focus-visible:ring-primary/20 uppercase"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-border"
                >
                  Cancel
                </Button>
                <Button
                  disabled={saving}
                  type="submit"
                  variant="gradient"
                  className="flex-1 h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-strong"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      {modalMode === 'add' ? 'Create Student' : 'Save Changes'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
