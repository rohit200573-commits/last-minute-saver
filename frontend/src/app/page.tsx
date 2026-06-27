'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Brain, Clock, ShieldAlert, Sparkles, TrendingUp, Calendar, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';
import Tilt from '@/components/Tilt';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });
const FocusCoach3D = dynamic(() => import('@/components/FocusCoach3D'), { ssr: false });
const ProductivityTwin3D = dynamic(() => import('@/components/ProductivityTwin3D'), { ssr: false });
const TasksBackground3D = dynamic(() => import('@/components/TasksBackground3D'), { ssr: false });

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">
      
      {/* 3D Background */}
      <Scene />

      {/* Vertical Animated Grid Ribbons (Hero Background) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center opacity-20">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent ml-32" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent mr-32" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-8xl font-bold tracking-tight mb-6 max-w-5xl leading-tight"
        >
          The future of <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">productivity</span> is here.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl leading-relaxed"
        >
          We provide cutting-edge AI tools to optimize your workflow, automate planning, and eliminate missed deadlines.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard" className="px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Get Started <ChevronRight className="w-5 h-5" />
          </Link>
          <button className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-full font-bold transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-sm">
            Learn More
          </button>
        </motion.div>
      </section>

      {/* Solutions Showcase (Mockup) */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="text-cyan-400 font-bold tracking-widest text-sm mb-4 uppercase">Solutions</div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Revolutionize your workflows.</h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
            Our AI solutions automate complex task planning, reduce procrastination, and enhance strategic focus across your entire life.
          </p>
        </motion.div>

        {/* Dashboard Glassmorphic Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tilt>
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-2 md:p-8 overflow-hidden shadow-[0_0_100px_rgba(109,93,252,0.1)]">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Total Productivity Score</div>
                    <div className="text-2xl font-bold">9,842 XP <span className="text-sm text-green-400">+14.2%</span></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              
              {/* Fake UI Content */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-40 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex items-end p-4">
                    {/* Fake Chart bars */}
                    <div className="w-full flex items-end justify-between gap-2 h-full pt-8">
                      {[40, 60, 30, 80, 50, 90, 70, 100].map((h, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="w-full bg-primary/40 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-sm text-zinc-400 mb-1">Active Tasks</div>
                      <div className="text-xl font-bold">14</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-sm text-zinc-400 mb-1">Deep Work Hours</div>
                      <div className="text-xl font-bold">32.5h</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-secondary/10 to-transparent border border-secondary/20 h-full">
                    <div className="text-sm text-secondary font-bold mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> AI INSIGHT
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      You are highly productive on Tuesday mornings. We have automatically rescheduled your heavy coding tasks to align with your peak focus windows.
                    </p>
                    <button className="w-full mt-6 py-2 rounded-lg bg-secondary/20 text-secondary text-sm font-bold border border-secondary/30">
                      Apply Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tilt>
        </motion.div>
      </section>

      {/* Alternating Features Section */}
      <section className="relative z-10 py-32 overflow-hidden bg-black/40">
        <div className="max-w-7xl mx-auto px-6 space-y-40">
          
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-primary font-bold tracking-widest text-sm mb-4">01. PREDICTIVE ANALYTICS</div>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Gain foresight into your productivity trends.</h3>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Our Digital Twin technology clones your work habits, predicts when you will procrastinate, and calculates your exact success probabilities for any given deadline.
              </p>
              <Link href="/dashboard" className="inline-flex px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all items-center gap-2">
                Sign Up <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="h-[400px] w-full relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <ProductivityTwin3D />
            </motion.div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="h-[400px] w-full relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden order-2 md:order-1"
            >
              {/* We reuse TasksBackground3D but inside a relative container */}
              <div className="absolute inset-0">
                <TasksBackground3D />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2"
            >
              <div className="text-danger font-bold tracking-widest text-sm mb-4">02. EMERGENCY RESCUE</div>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Streamline crisis management.</h3>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                When a deadline is under 24 hours, the AI automatically drops low-priority work, creates an emergency rescue schedule, and locks you into Focus Mode until completion.
              </p>
              <Link href="/dashboard" className="inline-flex px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all items-center gap-2">
                Sign Up <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-cyan-400 font-bold tracking-widest text-sm mb-4">03. SMART SCHEDULING</div>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Enhance your daily execution.</h3>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Stop guessing what to do next. The Focus Coach AI dynamically reorders your tasks based on changing constraints, energy levels, and upcoming due dates.
              </p>
              <Link href="/dashboard" className="inline-flex px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all items-center gap-2">
                Sign Up <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="h-[400px] w-full relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center"
            >
              <div className="w-[80%] h-[80%]">
                 <FocusCoach3D />
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Metrics & Benefits */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-1">
            <div className="text-zinc-500 font-bold tracking-widest text-sm mb-4 uppercase">Benefits</div>
            <h2 className="text-3xl font-bold mb-4">Smart. Secure. Scalable.</h2>
            <p className="text-zinc-400">Welcome to the Last Minute Life Saver.</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-10">
            <div>
              <div className="text-5xl md:text-7xl font-bold text-white mb-2">+48%</div>
              <div className="text-zinc-400">Efficiency Boost</div>
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-bold text-white mb-2">-21%</div>
              <div className="text-zinc-400">Missed Deadlines</div>
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-bold text-white mb-2">10K+</div>
              <div className="text-zinc-400">Tasks Completed</div>
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-bold text-white mb-2">99%</div>
              <div className="text-zinc-400">Stress Reduction</div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative z-10 py-16 px-6 border-t border-white/10 bg-black text-center">
        <h2 className="text-3xl font-bold mb-8">Grow with AI. Start your journey today.</h2>
        <div className="flex justify-center gap-4 mb-16">
          <Link href="/dashboard" className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors">
            Get Started
          </Link>
          <button className="px-8 py-3 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-colors">
            Learn More
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-zinc-500 text-sm">
          <div>© 2026 Last Minute Life Saver. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
