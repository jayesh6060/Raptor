'use client';

import React from 'react';
import { 
  CreditCard, 
  Wallet, 
  Receipt, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Calendar,
  X,
  Smartphone,
  QrCode,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentsPage() {
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState(0);
  
  const semesters = [
    { id: 1, name: 'Semester 1', amount: 85000, status: 'paid', date: '15 Aug 2023' },
    { id: 2, name: 'Semester 2', amount: 85000, status: 'paid', date: '10 Jan 2024' },
    { id: 3, name: 'Semester 3', amount: 85000, status: 'paid', date: '20 Aug 2024' },
    { id: 4, name: 'Semester 4', amount: 85000, status: 'paid', date: '15 Jan 2025' },
    { id: 5, name: 'Semester 5', amount: 90000, status: 'pending', date: '15 Aug 2025' },
    { id: 6, name: 'Semester 6', amount: 90000, status: 'upcoming', date: 'Jan 2026' },
    { id: 7, name: 'Semester 7', amount: 90000, status: 'upcoming', date: 'Aug 2026' },
    { id: 8, name: 'Semester 8', amount: 90000, status: 'upcoming', date: 'Jan 2027' },
  ];

  const totalFees = semesters.reduce((sum, sem) => sum + sem.amount, 0);
  const paidFees = semesters.filter(s => s.status === 'paid').reduce((sum, sem) => sum + sem.amount, 0);
  const pendingFees = semesters.filter(s => s.status === 'pending').reduce((sum, sem) => sum + sem.amount, 0);

  const upiId = "6361747047@ibl";
  const payeeName = "Jayesh Suthar";
  const finalAmount = paymentAmount || pendingFees;
  const transactionNote = encodeURIComponent(`Semester Fee Payment - INR ${finalAmount}`);
  const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${finalAmount}&cu=INR&tn=${transactionNote}`;

  React.useEffect(() => {
    if (showPaymentModal) {
      setPaymentAmount(pendingFees);
    }
  }, [showPaymentModal, pendingFees]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid': return <Badge variant="success" className="font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1">PAID</Badge>;
      case 'pending': return <Badge variant="destructive" className="font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1">DUE</Badge>;
      default: return <Badge variant="secondary" className="font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1">UPCOMING</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase leading-none">Fee Management</h1>
          <p className="text-muted-foreground font-medium mt-3">Securely track your academic investment and semester transaction history.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-soft border-border bg-card">
             <Download size={18} className="mr-3" /> 
             Download Statement
           </Button>
           <Button 
             variant="gradient" 
             className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-strong"
             onClick={() => setShowPaymentModal(true)}
             disabled={pendingFees <= 0}
           >
             <CreditCard size={18} className="mr-3" /> 
             Pay Dues Now
           </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center gap-6 group hover:shadow-strong transition-all duration-500">
          <div className="w-16 h-16 rounded-[24px] bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
            <Wallet size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Total Academic Value</p>
            <h3 className="text-3xl font-black text-foreground tracking-tight italic uppercase leading-none">₹{totalFees.toLocaleString()}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="glass" className="text-[8px] font-black tracking-widest bg-primary/5 uppercase border-primary/10">8 SEMESTERS</Badge>
            </div>
          </div>
        </Card>
        
        <Card className="p-8 border-border shadow-soft bg-card/50 backdrop-blur-md flex items-center gap-6 group hover:shadow-strong transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-bl-[100px] pointer-events-none" />
          <div className="w-16 h-16 rounded-[24px] bg-success/10 text-success flex items-center justify-center shrink-0 shadow-inner group-hover:bg-success group-hover:text-white transition-all">
            <CheckCircle2 size={32} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Finalized Ledger</p>
            <h3 className="text-3xl font-black text-foreground tracking-tight italic uppercase leading-none">₹{paidFees.toLocaleString()}</h3>
            <p className="text-[9px] font-black text-success uppercase tracking-widest mt-2">4 Cycles Cleared</p>
          </div>
        </Card>

        <Card className="p-8 border-border shadow-soft bg-primary text-white flex items-center gap-6 relative overflow-hidden group hover:shadow-strong transition-all duration-500">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none blur-3xl group-hover:bg-white/10 transition-colors" />
          <div className="w-16 h-16 rounded-[24px] bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md shadow-inner">
            <AlertCircle size={32} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Active Liability</p>
            <h3 className="text-3xl font-black tracking-tight italic uppercase leading-none">₹{pendingFees.toLocaleString()}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] font-black text-white/80 uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">Action Required</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Semesters Breakdown */}
      <Card className="border-border shadow-strong overflow-hidden bg-card/50 backdrop-blur-md">
        <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between bg-muted/30">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
                <Receipt size={24} />
             </div>
             <div>
                <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight italic leading-none">Detailed Breakdown</CardTitle>
                <CardDescription className="text-primary font-black text-[9px] uppercase tracking-[0.2em] mt-2">Full Course Duration</CardDescription>
             </div>
          </div>
          <Badge variant="outline" className="h-8 px-4 rounded-lg font-black uppercase text-[9px] tracking-widest border-border bg-card">8 CYCLES</Badge>
        </CardHeader>
        <div className="divide-y divide-border">
          {semesters.map((sem) => (
            <div key={sem.id} className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-muted/30 transition-all group">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground font-black text-lg shadow-inner group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                  {sem.id}
                </div>
                <div>
                  <h3 className="font-black text-foreground text-xl uppercase tracking-tight italic leading-none group-hover:text-primary transition-colors">{sem.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2 opacity-60">
                    <Calendar size={12} className="text-primary/40" />
                    Due: {sem.date}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full md:w-auto gap-12">
                <div className="text-right flex-1 md:flex-none">
                  <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em] mb-1">Fee Amount</p>
                  <p className="font-black text-foreground text-xl italic uppercase font-sans tracking-tight">₹{sem.amount.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center justify-end min-w-[120px]">
                  {getStatusBadge(sem.status)}
                </div>
                
                <div className="hidden md:flex items-center justify-center w-10">
                   {sem.status === 'paid' ? (
                     <div className="p-2 bg-success/10 text-success rounded-lg">
                       <ShieldCheck size={20} />
                     </div>
                   ) : sem.status === 'pending' ? (
                     <div className="p-2 bg-destructive/10 text-destructive rounded-lg animate-pulse">
                        <AlertCircle size={20} />
                     </div>
                   ) : (
                     <div className="p-2 bg-muted/50 text-muted-foreground rounded-lg">
                        <Clock size={20} opacity={0.4} />
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-strong">
                    <Smartphone size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase italic leading-none">Instant Payment</h2>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-2">Secure UPI Gateway</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Due Balance</p>
                        <h3 className="text-xl font-black text-slate-950 dark:text-slate-100 tracking-tighter italic">₹{pendingFees.toLocaleString()}</h3>
                      </div>
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Amount to Pay</p>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg text-slate-400">₹</span>
                          <input 
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                            className="w-full h-12 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-lg tracking-tight focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[10000, 20000, 100000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setPaymentAmount(amt)}
                            className={cn(
                              "py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                              paymentAmount === amt 
                                ? "bg-indigo-600 border-indigo-600 text-white" 
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-600"
                            )}
                          >
                            ₹{(amt/1000).toFixed(0)}K
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2">Pay Instantly via</p>
                       <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => window.location.href = upiUrl}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
                          >
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                                <span className="font-black text-indigo-600 text-xs italic">P</span>
                             </div>
                             <span className="text-[10px] font-black text-slate-600 uppercase">PhonePe</span>
                          </button>
                          <button 
                            onClick={() => window.location.href = upiUrl}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
                          >
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                                <span className="font-black text-indigo-600 text-xs italic">G</span>
                             </div>
                             <span className="text-[10px] font-black text-slate-600 uppercase">G-Pay</span>
                          </button>
                       </div>
                       <button 
                         onClick={() => window.location.href = upiUrl}
                         className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                       >
                         <Zap size={16} fill="white" />
                         Open All UPI Apps
                       </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800/50 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                    
                    <div className="relative mb-6">
                       <div className="w-48 h-48 bg-white dark:bg-slate-200 p-4 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-300 flex items-center justify-center">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`} 
                            alt="Payment QR Code"
                            className="w-full h-full object-contain"
                          />
                       </div>
                       <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white dark:bg-slate-200 rounded-2xl shadow-strong flex items-center justify-center border border-slate-50 dark:border-slate-300">
                          <QrCode size={24} className="text-indigo-600" />
                       </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[11px] font-black text-slate-950 dark:text-slate-100 uppercase tracking-widest mb-1 italic">Scan with any App</p>
                      <p className="text-[9px] font-medium text-slate-400 max-w-[140px] leading-relaxed">Point your camera at the QR code to finish paying.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
                         <ShieldCheck size={18} />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted</p>
                   </div>
                   <div className="flex items-center gap-2 grayscale opacity-40">
                      <span className="text-[8px] font-black tracking-tighter">BHIM</span>
                      <span className="text-[8px] font-black tracking-tighter">UPI</span>
                      <span className="text-[8px] font-black tracking-tighter">NPCI</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
