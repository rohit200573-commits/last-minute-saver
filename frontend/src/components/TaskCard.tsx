import { Clock, CheckCircle2, Circle, Calendar, Flag } from 'lucide-react';
import Tilt from './Tilt';

interface TaskCardProps {
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function TaskCard({ title, description, priority, status }: TaskCardProps) {
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

  return (
    <Tilt>
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${status === 'COMPLETED' ? 'opacity-60 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' : 'bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_4px_15px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_0_rgba(0,0,0,0.2)]'}`}>
        <div className="flex items-start justify-between gap-4" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-start gap-3">
            <button className="mt-0.5 hover:scale-110 transition-transform">
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
            Today
          </span>
        </div>
      </div>
    </Tilt>
  );
}
