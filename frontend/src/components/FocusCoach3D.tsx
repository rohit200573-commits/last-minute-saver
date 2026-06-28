'use client';

import { motion } from 'framer-motion';
import { Brain, CheckCircle2, Clock } from 'lucide-react';

export default function FocusCoach3D() {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 bg-gradient-to-tr from-black to-zinc-900/40">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
      
      {/* Central Brain Core */}
      <div className="relative w-40 h-40">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-[2rem] border-2 border-accent/40 bg-accent/10 backdrop-blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(124,255,107,0.2)]"
        >
          <Brain className="w-16 h-16 text-accent" />
        </motion.div>

        {/* Orbiting Task nodes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-12 origin-center"
        >
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-black border border-white/20 rounded-xl flex items-center justify-center"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </motion.div>
          
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-4 right-2 w-10 h-10 bg-black border border-white/20 rounded-xl flex items-center justify-center"
          >
            <Clock className="w-5 h-5 text-warning" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
