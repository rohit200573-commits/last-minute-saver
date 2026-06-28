import { Clock, CheckCircle2, Circle, Calendar, Flag, Flame } from 'lucide-react';
import Tilt from './Tilt';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  deadline?: { date: string } | null;
  disabled?: boolean;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export default function TaskCard({ id, title, description, priority, status, createdAt, deadline, disabled, onStatusChange }: TaskCardProps) {
  const priorityColors = {
    CRITICAL: 'bg-danger/20 text-danger border-danger/30',
    HIGH: 'bg-warning/20 text-warning border-warning/30',
    MEDIUM: 'bg-primary/20 text-primary border-primary/30',
    LOW: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
  };

  const statusIcons = {
    PENDING: <Circle className="w-5 h-5 text-zinc-400" />,
    IN_PROGRESS: <Clock className="w-5 h-5 text-warning" />,
    COMPLETED: <CheckCircle2 className="w-5 h-5 text-accent" />
  };

  const cycleStatus = () => {
    if (disabled || !onStatusChange) return;
    const nextStatus = status === 'PENDING' ? 'IN_PROGRESS' : status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
    onStatusChange(id, nextStatus);
  };

  // Calculate Procrastination Risk Score
  let procScore = 0;
  if (status === 'PENDING' && deadline?.date) {
    const createdTime = new Date(createdAt).getTime();
    const deadlineTime = new Date(deadline.date).getTime();
    const nowTime = new Date().getTime();
    
    const createdToDeadline = deadlineTime - createdTime;
    const nowToDeadline = deadlineTime - nowTime;
    
    // Created > 3 days before deadline, and now < 24 hours away
    if (createdToDeadline > 3 * 24 * 60 * 60 * 1000 && nowToDeadline > 0 && nowToDeadline < 24 * 60 * 60 * 1000) {
      procScore = 95;
    } else if (createdToDeadline > 0 && nowToDeadline > 0) {
      // Just a simple linear scale for other pending tasks
      const elapsed = nowTime - createdTime;
      const progress = elapsed / createdToDeadline;
      procScore = Math.min(85, Math.floor(progress * 100));
    }
  }

  return (
    <Tilt>
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''} ${status === 'COMPLETED' ? 'opacity-60 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' : 'bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_4px_15px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_0_rgba(0,0,0,0.2)]'}`}>
        <div className="flex items-start justify-between gap-4" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-start gap-3">
            <button onClick={cycleStatus} className="mt-0.5 hover:scale-110 transition-transform cursor-pointer disabled:cursor-not-allowed" disabled={disabled}>
              {statusIcons[status]}
            </button>
            <div>
              <h3 className={`font-semibold text-lg ${status === 'COMPLETED' ? 'line-through text-zinc-500' : 'text-zinc-900 dark:text-white'}`}>
                {title}
              </h3>
              {description && (
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 mb-3 line-clamp-2">{description}</p>
              )}
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
        
        <div className="flex items-center gap-3 ml-8 mt-2" style={{ transform: "translateZ(20px)" }}>
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider flex items-center gap-1 ${priorityColors[priority]}`}>
            <Flag className="w-3 h-3" />
            {priority}
          </span>
          
          <span className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-3 h-3" />
            {deadline ? new Date(deadline.date).toLocaleDateString() : new Date(createdAt).toLocaleDateString()}
          </span>
          
          {procScore > 0 && (
            <span className={`ml-auto flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${procScore >= 90 ? 'bg-danger/20 text-danger border border-danger/30 animate-pulse' : 'bg-warning/10 text-warning border border-warning/20'}`}>
              <Flame className="w-3 h-3" />
              {procScore}% RISK
            </span>
          )}
        </div>
      </div>
    </Tilt>
  );
}
