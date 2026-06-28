'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Clock } from 'lucide-react';

export default function EmergencyRescueGraphic() {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 bg-gradient-to-br from-danger/20 to-black overflow-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,82,82,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,82,82,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
      
      {/* Flashing Warning Background */}
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-danger/10"
      />

      {/* Central Node */}
      <div className="relative w-48 h-48">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-danger shadow-[0_0_50px_rgba(255,82,82,0.5)]"
        />
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border border-dashed border-danger/60"
        />

        {/* Floating Core Icon */}
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black border border-danger/50 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,82,82,0.6)] z-10"
        >
          <ShieldAlert className="w-10 h-10 text-danger" />
        </motion.div>

        {/* Orbiting Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 origin-center"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-black border border-danger/40 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,82,82,0.5)]">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
        </motion.div>

        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-6 origin-center"
        >
          <div className="absolute bottom-6 right-0 w-8 h-8 bg-black border border-danger/40 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,82,82,0.5)]">
            <Clock className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
