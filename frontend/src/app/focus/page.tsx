'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Square, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FocusTimer() {
  const { getToken } = useAuth();
  
  const DEFAULT_MINUTES = 25;
  const [timeLeft, setTimeLeft] = useState(DEFAULT_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleComplete(DEFAULT_MINUTES);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_MINUTES * 60);
    setSessionCompleted(false);
  };

  const handleComplete = async (minutes: number) => {
    setIsActive(false);
    
    try {
      await fetchWithAuth('/gamification/focus-session', getToken, {
        method: 'POST',
        body: JSON.stringify({ duration: minutes })
      });
      setXpEarned(minutes);
      setSessionCompleted(true);
    } catch (err) {
      console.error('Failed to log focus session:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((DEFAULT_MINUTES * 60 - timeLeft) / (DEFAULT_MINUTES * 60)) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${isActive ? 'bg-primary/20' : sessionCompleted ? 'bg-accent/20' : 'bg-zinc-800/20'}`} />

      <Link href="/dashboard" className="absolute top-6 left-6 text-zinc-400 hover:text-white flex items-center gap-2 transition-colors z-10">
        <ArrowLeft className="w-5 h-5" /> Dashboard
      </Link>

      <AnimatePresence mode="wait">
        {!sessionCompleted ? (
          <motion.div 
            key="timer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-12 text-zinc-300">Deep Work Session</h1>
            
            {/* Circular Progress Timer */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center mb-12">
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="2" 
                />
                <motion.circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke={isActive ? '#6D5DFC' : '#52525b'} 
                  strokeWidth="2"
                  strokeDasharray="301.59" // 2 * PI * 48
                  strokeDashoffset={301.59 - (progress / 100) * 301.59}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              
              <div className="text-6xl md:text-8xl font-mono font-bold tracking-tighter">
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <button 
                onClick={resetTimer}
                className="w-14 h-14 rounded-full border border-zinc-700 bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
              >
                <Square className="w-5 h-5" />
              </button>
              
              <button 
                onClick={toggleTimer}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 ${isActive ? 'bg-warning text-black shadow-[0_0_40px_rgba(234,179,8,0.3)]' : 'bg-primary text-white shadow-[0_0_40px_rgba(109,93,252,0.4)]'}`}
              >
                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-2" />}
              </button>
            </div>

            {/* Dev Mode Demo Button */}
            <button 
              onClick={() => handleComplete(DEFAULT_MINUTES)}
              className="mt-12 text-xs font-bold text-zinc-600 hover:text-zinc-400 border border-zinc-800 rounded-full px-4 py-2 uppercase tracking-widest transition-colors"
            >
              Dev: Complete Instantly
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center text-center max-w-md"
          >
            <div className="w-24 h-24 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-accent blur-xl opacity-20 rounded-full animate-pulse"></div>
              <Trophy className="w-12 h-12 text-accent" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4">Session Complete!</h2>
            <p className="text-xl text-zinc-400 mb-8">You stayed focused and leveled up your productivity.</p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full flex items-center justify-center gap-4 mb-10 shadow-[0_0_30px_rgba(124,255,107,0.1)]">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="text-3xl font-bold text-white">+{xpEarned} XP</span>
            </div>

            <button 
              onClick={resetTimer}
              className="px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] w-full"
            >
              Start Another Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
