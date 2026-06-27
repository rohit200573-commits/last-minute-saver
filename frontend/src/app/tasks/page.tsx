'use client';

import TaskCard from '@/components/TaskCard';
import { Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

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
  const mockTasks: Array<{id: string, title: string, description?: string, priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL', status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'}> = [
    { id: '1', title: 'Finish Q3 Report', description: 'Complete the financial overview for Q3 and submit to Sarah.', priority: 'CRITICAL', status: 'IN_PROGRESS' },
    { id: '2', title: 'Review PRs', priority: 'MEDIUM', status: 'PENDING' },
    { id: '3', title: 'Update dependencies', description: 'Update all Next.js and React dependencies to the latest version to patch security vulnerabilities.', priority: 'HIGH', status: 'COMPLETED' },
    { id: '4', title: 'Write blog post', priority: 'LOW', status: 'PENDING' },
    { id: '5', title: 'Team Sync', description: 'Weekly sync with the engineering team.', priority: 'MEDIUM', status: 'IN_PROGRESS' },
  ];

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
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 text-lg"
          >
            <Plus className="w-5 h-5" />
            New Quest
          </motion.button>
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
          {mockTasks.map(task => (
            <motion.div key={task.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                <TaskCard {...task} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
