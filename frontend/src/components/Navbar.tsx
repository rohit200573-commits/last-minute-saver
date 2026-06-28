import Link from 'next/link';
import { Home, CheckSquare, TrendingUp, LayoutDashboard, ShieldAlert, LogIn } from 'lucide-react';
import { SignInButton, Show, UserButton } from '@clerk/nextjs';

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
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-primary transition-colors md:hidden bg-transparent border-none p-0 cursor-pointer">
              <LogIn className="w-6 h-6" />
              <span className="text-[10px] font-medium">Log In</span>
            </button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <div className="md:hidden flex flex-col items-center justify-center">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-6 h-6" } }} />
            <span className="text-[10px] font-medium text-zinc-500 mt-1">Profile</span>
          </div>
        </Show>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Show when="signed-in">

          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }} />
        </Show>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              Sign In
            </button>
          </SignInButton>
        </Show>
      </div>
    </nav>
  );
}
