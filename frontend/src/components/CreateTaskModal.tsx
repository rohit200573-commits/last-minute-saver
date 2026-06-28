import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateTaskModal({ onTaskCreated }: { onTaskCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      await fetchWithAuth('/tasks', getToken, {
        method: 'POST',
        body: JSON.stringify({ title, priority, description: '', deadline: deadline || undefined })
      });
      setIsOpen(false);
      setTitle('');
      setDeadline('');
      toast.success('Task created successfully!');
      onTaskCreated();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        aria-label="Create Task"
        onClick={() => setIsOpen(true)} 
        className="flex items-center justify-center w-12 h-12 bg-primary rounded-full hover:bg-primary/80 transition shadow-[0_0_20px_rgba(109,93,252,0.4)]"
      >
        <Plus className="text-white" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }} 
              className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Create New Task</h2>
                <button aria-label="Close Modal" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Task Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Finish Q3 Report" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Priority</label>
                  <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value)} 
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Deadline (Optional)</label>
                  <input 
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                  />
                </div>
                <button  
                  disabled={loading} 
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl disabled:opacity-50 transition"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}