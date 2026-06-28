'use client';

import { motion } from 'framer-motion';

export default function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="w-full bg-white/[0.02] border border-white/5 backdrop-blur-sm rounded-3xl p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-3 flex-1 mr-6">
              <div className="h-6 bg-white/10 rounded-lg w-3/4 animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded-lg w-1/2 animate-pulse"></div>
            </div>
            <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
