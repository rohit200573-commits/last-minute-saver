'use client';

import RiskRadar from '@/components/RiskRadar';
import ProductivityTwin3D from '@/components/ProductivityTwin3D';
import { Brain, TrendingUp, Target } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AnalyticsPage() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto p-6 md:p-10 space-y-10 relative z-10"
    >
      <motion.header variants={item} className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Productivity Analytics</h1>
        <p className="text-zinc-400 text-lg">AI-powered insights into your work habits.</p>
      </motion.header>

      <motion.div variants={item} className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-zinc-300 text-lg">Completion Rate</h3>
          </div>
          <p className="text-5xl font-bold text-white">94%</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20">
              <Brain className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-bold text-zinc-300 text-lg">AI Success Prob.</h3>
          </div>
          <p className="text-5xl font-bold text-white">88%</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-zinc-300 text-lg">Deep Work Time</h3>
          </div>
          <p className="text-5xl font-bold text-white">14h <span className="text-base font-normal text-zinc-500">this week</span></p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-2xl font-bold mb-8 text-white tracking-tight z-10 relative">Deadline Risk Radar</h2>
          <div className="relative z-10 bg-black/20 rounded-2xl p-4 border border-white/5">
            <RiskRadar />
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col relative overflow-hidden">
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-2xl font-bold mb-2 text-white tracking-tight z-10 relative">AI Productivity Twin</h2>
          <p className="text-zinc-400 mb-6 z-10 relative">Live simulation of your work habits.</p>
          
          <div className="-mt-12 -mb-8 opacity-90 flex-1 relative z-10 border border-white/5 bg-black/20 rounded-2xl overflow-hidden shadow-inner">
            <ProductivityTwin3D />
          </div>

          <div className="space-y-4 z-10 relative mt-8">
            <div className="p-5 bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-zinc-300 font-medium">Procrastination Risk</span>
                <span className="text-sm font-bold text-danger">High (72%)</span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-danger w-[72%] shadow-[0_0_10px_rgba(255,82,82,0.8)]"></div>
              </div>
            </div>
            
            <div className="p-5 bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-zinc-300 font-medium">Optimal Focus Time</span>
                <span className="text-sm font-bold text-primary">10:00 AM - 1:00 PM</span>
              </div>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">Your twin suggests scheduling your hardest tasks during this window for maximum output.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
