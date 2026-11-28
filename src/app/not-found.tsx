import type { Metadata } from 'next';
import Link from 'next/link';
import { Terminal, ArrowLeft, Home, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description:
    'The requested page could not be found. Return to the Saran R engineering portfolio homepage.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center px-4 text-center text-slate-100 selection:bg-blue-500/25 selection:text-blue-200 overflow-hidden">
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
        The requested page does not exist or has been relocated. Try returning to the homepage or getting in touch directly.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-5 py-2.5 text-xs font-bold text-zinc-950 transition-all shadow-md shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Return to Homepage</span>
        </Link>

        <a
          href="mailto:iamsaran.ai@gmail.com"
          className="inline-flex items-center gap-2 rounded-xl border border-[#262b3a] bg-[#12151e] hover:bg-[#181c28] hover:border-zinc-500 px-5 py-2.5 text-xs font-medium text-zinc-200 transition-all"
        >
          <Mail className="h-3.5 w-3.5 text-emerald-400" />
          <span>Get in Touch</span>
        </a>
      </div>
    </div>
  );
}
