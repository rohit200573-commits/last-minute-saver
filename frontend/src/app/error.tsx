'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6">
      <div className="max-w-md w-full bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-sm text-center">
        <div className="w-16 h-16 bg-danger/10 border border-danger/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
        <p className="text-zinc-400 mb-8 text-sm">
          {error.message || "An unexpected error occurred in the application."}
        </p>
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl font-medium transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
