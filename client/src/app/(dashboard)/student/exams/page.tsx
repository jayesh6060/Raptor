'use client';

import React from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  CreditCard,
  History,
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

export default function ExamsPage() {
  // Hardcoded mock data for Exam Results
  const examResults = [
    { id: 1, subject: 'Database Management Systems', code: 'CS501', score: 88, maxScore: 100, pass: true, date: '10 Dec 2025' },
    { id: 2, subject: 'Operating Systems', code: 'CS502', score: 92, maxScore: 100, pass: true, date: '12 Dec 2025' },
    { id: 3, subject: 'Computer Networks', code: 'CS503', score: 74, maxScore: 100, pass: true, date: '15 Dec 2025' },
    { id: 4, subject: 'Software Engineering', code: 'CS504', score: 85, maxScore: 100, pass: true, date: '18 Dec 2025' }
  ];

  // Hardcoded mock data for Exam Fees
  const examFees = [
    { term: 'Semester 1', amount: 1500, paidOn: '10 Aug 2023', status: 'paid', receiptNo: 'EXM-23-0142' },
    { term: 'Semester 2', amount: 1500, paidOn: '05 Jan 2024', status: 'paid', receiptNo: 'EXM-24-0089' },
    { term: 'Semester 3', amount: 1500, paidOn: '12 Aug 2024', status: 'paid', receiptNo: 'EXM-24-0551' },
    { term: 'Semester 4', amount: 1500, paidOn: '08 Jan 2025', status: 'paid', receiptNo: 'EXM-25-0220' },
    { term: 'Semester 5', amount: 1800, paidOn: '14 Aug 2025', status: 'paid', receiptNo: 'EXM-25-0982' },
    { term: 'Semester 6', amount: 1800, paidOn: null, status: 'pending', receiptNo: '-' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Examinations</h1>
          <p className="text-muted-foreground font-medium mt-3">View your academic grades and track your exam registration fees.</p>
        </div>
        <Link href="/student/payments">
          <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-soft border-border bg-card">
            <CreditCard size={18} className="mr-3" /> 
            View College Fees
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Col: Results */}
        <div className="xl:col-span-8 space-y-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-primary" size={24} />
            <h2 className="text-xl font-black text-foreground tracking-tight uppercase italic">Latest Exam Results</h2>
          </div>
          
          <Card className="border-border shadow-strong overflow-hidden bg-card/50 backdrop-blur-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12">Subject</TableHead>
                  <TableHead className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12">Session Date</TableHead>
                  <TableHead className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12 text-right">Performance</TableHead>
                  <TableHead className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest h-12 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examResults.map((res) => (
                  <TableRow key={res.id} className="hover:bg-muted/30 transition-colors border-border group">
                    <TableCell className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="font-black text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors">{res.subject}</p>
                        <Badge variant="outline" className="text-[9px] font-black border-border bg-muted/30 text-muted-foreground uppercase px-2 py-0.5">{res.code}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                        <Clock size={14} className="text-primary/40" />
                        {res.date}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-xl font-black text-foreground italic">{res.score}</span>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">/ {res.maxScore}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-center">
                      <Badge variant={res.pass ? 'success' : 'destructive'} className="font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1">
                        {res.pass ? <CheckCircle2 size={12} className="mr-1.5" /> : <AlertCircle size={12} className="mr-1.5" />}
                        {res.pass ? 'PASS' : 'FAIL'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right Col: Fees */}
        <div className="xl:col-span-4 space-y-8">
          <div className="flex items-center gap-3">
            <History className="text-primary" size={24} />
            <h2 className="text-xl font-black text-foreground tracking-tight uppercase italic">Fee Registry</h2>
          </div>
          
          <div className="space-y-6">
            {examFees.map((fee, idx) => (
              <Card key={idx} className="border-border shadow-soft bg-card/50 backdrop-blur-md group hover:shadow-strong transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-black text-foreground uppercase tracking-tight italic">{fee.term}</h3>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {fee.status === 'paid' ? `Finalized: ${fee.paidOn}` : 'Action Required'}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-xl font-black text-foreground italic">₹{fee.amount}</p>
                      <Badge variant={fee.status === 'paid' ? 'success' : 'destructive'} className={cn(
                        "font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1",
                        fee.status !== 'paid' && "cursor-pointer hover:bg-destructive/90 transition-colors"
                      )}>
                        {fee.status === 'paid' ? 'Paid' : 'Pay Now'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
