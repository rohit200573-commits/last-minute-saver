'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';
import TaskCard from '@/components/TaskCard';
import Link from 'next/link';
import { ArrowLeft, AlertOctagon, Clock, ShieldAlert } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Tilt from '@/components/Tilt';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function RescueMode() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  const loadData = async () => {
    try {
      const tasksData = await fetchWithAuth('/tasks', getToken);
      setTasks(tasksData);
    } catch (err) {
      console.error('Failed to load rescue tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [getToken]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === 'COMPLETED') {
      const confirm = window.confirm("Are you sure you want to mark this critical task as completed?");
      if (!confirm) return;
    }
    try {
      setTasks(current => current.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await fetchWithAuth(`/tasks/${id}/status`, getToken, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (newStatus === 'COMPLETED') toast.success('Task completed! Rescue Mode Deactivated.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update task');
      // Reload on error
      const tasksData = await fetchWithAuth('/tasks', getToken);
      setTasks(tasksData);
    }
  };

  // Sort tasks by urgency (deadline closest to now, then priority)
  const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  
  const sortedTasks = [...tasks].sort((a, b) => {
    const aTime = a.deadline?.date ? new Date(a.deadline.date).getTime() : Infinity;
    const bTime = b.deadline?.date ? new Date(b.deadline.date).getTime() : Infinity;
    
    if (aTime !== bTime) {
      return aTime - bTime;
    }
    return (priorityWeight[b.priority as keyof typeof priorityWeight] || 0) - 
           (priorityWeight[a.priority as keyof typeof priorityWeight] || 0);
  });

  const urgentTask = sortedTasks.find(t => t.status !== 'COMPLETED');

  useEffect(() => {
    if (!urgentTask?.deadline?.date) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(urgentTask.deadline.date).getTime() - now;
      
      if (distance < 0) {
        setTimeLeft('OVERDUE');
        clearInterval(interval);
        return;
      }
      
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [urgentTask]);

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex flex-col">
      {/* Background pulsing glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-danger/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

      <header className="p-6 relative z-10 flex items-center justify-between">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 text-danger font-bold tracking-widest uppercase text-sm border border-danger/30 bg-danger/10 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,82,82,0.4)]">
          <ShieldAlert className="w-4 h-4" /> Rescue Mode Active
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 relative z-10">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">
          
          {/* Urgent Task Focus Area */}
          <section className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight">
              Focus on ONE Thing.
            </h1>
            
            {loading ? (
              <p className="text-zinc-400">Analyzing priorities...</p>
            ) : urgentTask ? (
              <Tilt>
                <div className="max-w-2xl mx-auto bg-danger/5 border border-danger/20 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(255,82,82,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-danger/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3 text-danger mb-4">
                      <Clock className="w-6 h-6 animate-pulse" />
                      <span className="text-3xl md:text-4xl font-mono font-bold tracking-tight">
                        {timeLeft || '--:--:--'}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-4">{urgentTask.title}</h2>
                    {urgentTask.description && (
                      <p className="text-lg text-zinc-400 mb-8">{urgentTask.description}</p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link 
                        href={`/focus?taskId=${urgentTask.id}`}
                        className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(109,93,252,0.5)] hover:scale-105 active:scale-95"
                      >
                        Start Focus Session
                      </Link>
                      <button 
                        onClick={() => handleStatusChange(urgentTask.id, 'COMPLETED')}
                        className="px-8 py-4 bg-danger hover:bg-danger/90 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(255,82,82,0.5)] hover:scale-105 active:scale-95"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                </div>
              </Tilt>
            ) : (
              <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl">
                <AlertOctagon className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">You're All Caught Up!</h3>
                <p className="text-zinc-400 mt-2">No urgent tasks remaining. You survived.</p>
              </div>
            )}
          </section>

          {/* Other Tasks List */}
          {!loading && sortedTasks.length > 1 && (
            <section className="pt-12 border-t border-white/5">
              <h3 className="text-xl font-bold text-zinc-500 mb-6 tracking-tight">Other Tasks (Locked)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {sortedTasks.filter(t => t.id !== urgentTask?.id).map((task) => (
                  <motion.div key={task.id} variants={item}>
                    <TaskCard 
                      {...task} 
                      disabled={true} 
                      onStatusChange={handleStatusChange} 
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

        </motion.div>
      </main>
    </div>
  );
}
