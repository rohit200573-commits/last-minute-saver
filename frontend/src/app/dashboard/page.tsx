'use client';

import StatsWidget from '@/components/StatsWidget';
import TaskCard from '@/components/TaskCard';
import Link from 'next/link';
import { ArrowRight, Play, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Tilt from '@/components/Tilt';
import CreateTaskModal from '@/components/CreateTaskModal';

const FocusCoach3D = dynamic(() => import('@/components/FocusCoach3D'), { ssr: false });

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { getToken } = useAuth();
  const [user, setUser] = useState({ level: 1, xp: 0, nextLevelXp: 100, streak: 0 });
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, tasksData] = await Promise.all([
          fetchWithAuth('/users/me', getToken),
          fetchWithAuth('/tasks', getToken)
        ]);
        
        setUser({
          level: userData.level || 1,
          xp: userData.xp || 0,
          nextLevelXp: (userData.level || 1) * 100, // simple calc
          streak: userData.streak || 0
        });
        setTasks(tasksData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [getToken]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === 'COMPLETED') {
      const confirm = window.confirm("Are you sure you want to mark this task as completed?");
      if (!confirm) return;
    }
    try {
      // Optimistic update
      setTasks(current => current.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await fetchWithAuth(`/tasks/${id}/status`, getToken, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (newStatus === 'COMPLETED') toast.success('Task completed! XP Earned.');
      else toast.success(`Task status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error('Failed to update task status');
      // Revert on failure by reloading
      const tasksData = await fetchWithAuth('/tasks', getToken);
      setTasks(tasksData);
    }
  };

  const urgentTask = tasks.find(task => {
    if (!task.deadline?.date) return false;
    const timeDiff = new Date(task.deadline.date).getTime() - new Date().getTime();
    return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000;
  });

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto p-6 md:p-10 space-y-10"
    >
      {/* Emergency Rescue Mode Alert */}
      {urgentTask && (
        <motion.div variants={item} className="relative overflow-hidden bg-danger/10 border border-danger/30 backdrop-blur-2xl rounded-3xl p-6 flex items-start gap-4 shadow-[0_0_40px_rgba(255,82,82,0.2)] animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-danger/10 to-transparent opacity-50"></div>
          <div className="p-3 bg-danger/20 rounded-2xl text-danger border border-danger/30 relative z-10 shadow-[0_0_20px_rgba(255,82,82,0.4)]">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="relative z-10 flex-1">
            <h3 className="font-bold text-danger text-xl tracking-tight mb-1">Emergency Rescue Mode Activated</h3>
            <p className="text-zinc-300 text-base leading-relaxed mb-4">"{urgentTask.title}" is due in less than 24 hours. The AI has restructured your schedule and recommends entering Focus Mode immediately.</p>
            <div className="flex gap-3">
              <Link href="/rescue" className="px-4 py-2 bg-danger text-white rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(255,82,82,0.4)]">
                Enter Rescue Mode
              </Link>
              <Link href={`/focus?taskId=${urgentTask.id}`} className="px-4 py-2 border border-danger/30 text-danger hover:bg-danger/10 rounded-lg font-bold text-sm transition-colors">
                Start Focus Session
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <motion.header variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Life Dashboard</h1>
          <p className="text-zinc-400 text-lg">Your AI Copilot has planned your day for maximum efficiency.</p>
        </div>
      </motion.header>

      <motion.div variants={item}>
        {/* We can wrap StatsWidget in a deep glass panel if it doesn't already have one, but we assume StatsWidget is self-contained. 
            We'll add a wrapper just in case. */}
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl p-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <StatsWidget {...user} />
        </div>
      </motion.div>

      <motion.section variants={item} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Prioritized Timeline</h2>
            <div className="flex items-center gap-4">
              <CreateTaskModal onTaskCreated={() => {
                // simple reload for now
                window.location.reload();
              }} />
              <Link href="/tasks" className="text-sm px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white font-bold transition-all flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-white">Loading tasks...</div>
            ) : (
              <div className="flex-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-10">
              {tasks.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
                  <p className="text-zinc-400 mb-6 max-w-sm">There are no pending tasks in your queue. Take a break, or add a new task to stay productive.</p>
                </div>
              ) : (
                tasks.map((task: any) => (
                  <motion.div key={task.id} variants={item} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
                      <TaskCard {...task} onStatusChange={handleStatusChange} />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Tilt>
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl p-8 shadow-[0_0_50px_rgba(109,93,252,0.15)] text-center relative overflow-hidden group h-full flex flex-col">
              {/* Animated glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="h-48 w-full rounded-2xl bg-black/20 border border-white/5 mb-6 overflow-hidden flex items-center justify-center shadow-inner">
                  <div className="w-[120%] h-[120%]">
                    <FocusCoach3D />
                  </div>
                </div>
                <h3 className="font-bold text-2xl tracking-tight text-white mb-3">AI Focus Coach</h3>
                <p className="text-base text-zinc-400 mb-8 leading-relaxed flex-1">
                  The predictive engine suggests a 45-minute deep work session to complete your critical task before fatigue sets in.
                </p>
                <button className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold transition-all shadow-[0_0_25px_rgba(109,93,252,0.4)] flex justify-center items-center gap-2 text-lg">
                  <Play className="w-5 h-5 fill-current" /> Start Session
                </button>
              </div>
            </div>
          </Tilt>
        </div>
      </motion.section>
    </motion.div>
  );
}
