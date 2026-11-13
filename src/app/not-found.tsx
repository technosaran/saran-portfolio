import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center px-4 text-center text-slate-100 selection:bg-blue-500/25 selection:text-blue-200">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/25 mb-6 shadow-lg shadow-blue-500/10">
        <Terminal className="h-7 w-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md mb-4">
        <span>ERROR 404 // RESOURCE_NOT_FOUND</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        Page Not Found
      </h1>

      <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
        The requested system endpoint does not exist or has been relocated within the architecture.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-5 py-2.5 text-xs font-bold text-zinc-950 transition-all shadow-md shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Systems Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
