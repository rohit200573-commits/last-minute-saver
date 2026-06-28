'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Zap } from 'lucide-react';

export default function ProductivityTwin3D() {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 bg-gradient-to-br from-black to-zinc-900/50">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
      
      {/* Central Node */}
      <div className="relative w-48 h-48">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-secondary/40"
        />
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-8 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-20 blur-xl"
        />
        
        {/* Floating Icons */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(109,93,252,0.3)] z-10"
        >
          <Target className="w-8 h-8 text-primary" />
        </motion.div>

        {/* Orbiting Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 origin-center"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-black border border-secondary/30 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
        </motion.div>

        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 origin-center"
        >
          <div className="absolute bottom-4 right-0 w-8 h-8 bg-black border border-accent/30 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
