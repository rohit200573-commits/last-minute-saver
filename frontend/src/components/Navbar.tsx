import Link from 'next/link';
import { Home, CheckSquare, TrendingUp, User, LayoutDashboard, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 w-full bg-black/20 backdrop-blur-xl border-t border-white/10 md:relative md:border-t-0 md:border-b md:h-16 flex items-center justify-between px-6 z-50">
      <div className="hidden md:flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <ShieldAlert className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">LMLS</span>
      </div>

      <div className="flex w-full md:w-auto justify-around md:justify-end md:gap-6 py-3 md:py-0">
        <Link href="/" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-primary transition-colors">
          <Home className="w-6 h-6 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-sm font-medium">Home</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-primary transition-colors">
          <LayoutDashboard className="w-6 h-6 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-sm font-medium">Dashboard</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-primary transition-colors">
          <CheckSquare className="w-6 h-6 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-sm font-medium">Tasks</span>
        </Link>
        <Link href="/analytics" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-primary transition-colors">
          <TrendingUp className="w-6 h-6 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-sm font-medium">Analytics</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-primary transition-colors md:hidden">
          <User className="w-6 h-6 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-sm font-medium">Profile</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">Level 12</span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">350 / 500 XP</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
          <User className="w-6 h-6 text-zinc-500" />
        </div>
      </div>
    </nav>
  );
}
