'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface XpParticlesProps {
  amount: number;
  trigger: number; // Increment this to trigger the animation
}

export default function XpParticles({ amount, trigger }: XpParticlesProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      // Generate 12 particles
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 200, // random spread x
        y: -100 - Math.random() * 100, // float upwards y
      }));
      setParticles(newParticles);
      
      // Clear after animation completes
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
      <AnimatePresence>
        {particles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 text-accent font-black text-4xl drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          >
            +{amount} XP
          </motion.div>
        )}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: 0, x: p.x, y: p.y, scale: Math.random() * 1.5 + 0.5 }}
            transition={{ duration: 1 + Math.random(), ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-accent blur-[1px]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
