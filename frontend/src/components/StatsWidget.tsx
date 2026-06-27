import { Flame, Trophy, Star } from 'lucide-react';
import Tilt from './Tilt';

interface StatsWidgetProps {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
}

export default function StatsWidget({ level, xp, nextLevelXp, streak }: StatsWidgetProps) {
  const progress = Math.round((xp / nextLevelXp) * 100);

  return (
    <Tilt>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ transform: "translateZ(30px)" }}>
          
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(109,93,252,0.3)]">
              <Trophy className="w-8 h-8 text-primary" />
              <div className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                {level}
              </div>
            </div>
            <div>
              <h3 className="text-zinc-400 font-medium mb-1 text-sm">Current Level</h3>
              <div className="text-2xl font-bold text-white">Master Planner</div>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-primary">{xp} XP</span>
              <span className="text-zinc-500">{nextLevelXp} XP</span>
            </div>
            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-warning/10 px-4 py-3 rounded-xl border border-warning/20">
            <Flame className="w-6 h-6 text-warning" />
            <div>
              <div className="text-xl font-bold text-warning">{streak} Days</div>
              <div className="text-xs text-warning/80 font-medium">Focus Streak</div>
            </div>
          </div>

        </div>
      </div>
    </Tilt>
  );
}
