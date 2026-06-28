'use client';

import TaskCard from '@/components/TaskCard';
import { Plus, Search, Filter, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import CreateTaskModal from '@/components/CreateTaskModal';
import toast from 'react-hot-toast';

const TasksBackground3D = dynamic(() => import('@/components/TasksBackground3D'), { ssr: false });

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

export default function TasksPage() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const tasksData = await fetchWithAuth('/tasks', getToken);
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [getToken]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === 'COMPLETED') {
      const confirm = window.confirm("Are you sure you want to mark this task as completed?");
      if (!confirm) return;
    }
    try {
      setTasks(current => current.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await fetchWithAuth(`/tasks/${id}/status`, getToken, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (newStatus === 'COMPLETED') toast.success('Task completed! XP Earned.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update task');
      loadData();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Lower opacity background so it doesn't distract from the tasks */}
      <div className="absolute inset-0 z-0 opacity-30">
        <TasksBackground3D />
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto p-6 md:p-10 space-y-10 relative z-10"
      >
        <motion.header variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Your Quests</h1>
            <p className="text-zinc-400 text-lg">Manage your active tasks and side-quests.</p>
          </div>
          <div className="flex items-center">
            <CreateTaskModal onTaskCreated={loadData} />
          </div>
        </motion.header>

        <motion.div variants={item} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search quests..." 
              className="w-full pl-14 pr-6 py-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-full focus:outline-none focus:border-primary text-white transition-colors text-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-full text-white font-bold hover:bg-white/10 transition-colors shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-lg">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-white gap-2">
              <Loader2 className="w-6 h-6 animate-spin" /> Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Your quest log is empty</h3>
              <p className="text-zinc-400 max-w-md mx-auto text-lg">You have no active tasks. Enjoy the peace, or click the plus button to add a new quest.</p>
            </div>
          ) : (
            tasks.map(task => (
              <motion.div key={task.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                  <TaskCard {...task} onStatusChange={handleStatusChange} />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
