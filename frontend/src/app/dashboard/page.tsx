'use client';

import StatsWidget from '@/components/StatsWidget';
import TaskCard from '@/components/TaskCard';
import Link from 'next/link';
import { ArrowRight, Play, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Tilt from '@/components/Tilt';

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

export default function Dashboard() {
  const mockUser = {
    level: 12,
    xp: 350,
    nextLevelXp: 500,
    streak: 14
  };

  const mockTasks: Array<{id: string, title: string, priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL', status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'}> = [
    { id: '1', title: 'Finish Q3 Report', priority: 'CRITICAL', status: 'IN_PROGRESS' },
    { id: '2', title: 'Review PRs', priority: 'MEDIUM', status: 'PENDING' },
    { id: '3', title: 'Update dependencies', priority: 'LOW', status: 'COMPLETED' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto p-6 md:p-10 space-y-10"
    >
      {/* Emergency Rescue Mode Alert */}
      <motion.div variants={item} className="relative overflow-hidden bg-danger/10 border border-danger/30 backdrop-blur-2xl rounded-3xl p-6 flex items-start gap-4 shadow-[0_0_40px_rgba(255,82,82,0.2)] animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-danger/10 to-transparent opacity-50"></div>
        <div className="p-3 bg-danger/20 rounded-2xl text-danger border border-danger/30 relative z-10 shadow-[0_0_20px_rgba(255,82,82,0.4)]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-danger text-xl tracking-tight mb-1">Emergency Rescue Mode Activated</h3>
          <p className="text-zinc-300 text-base leading-relaxed">"Finish Q3 Report" is due in less than 24 hours. The AI has restructured your schedule and recommends entering Focus Mode immediately.</p>
        </div>
      </motion.div>

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
          <StatsWidget {...mockUser} />
        </div>
      </motion.div>

      <motion.section variants={item} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Prioritized Timeline</h2>
            <Link href="/tasks" className="text-sm px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white font-bold transition-all flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockTasks.map(task => (
              <motion.div key={task.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
                  <TaskCard {...task} />
                </div>
              </motion.div>
            ))}
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
