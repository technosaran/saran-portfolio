'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Command } from 'lucide-react';

interface ScrollProgressBarProps {
  onOpenCommandMenu?: () => void;
}

export default function ScrollProgressBar({ onOpenCommandMenu }: ScrollProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
        setScrollProgress(progress);
      }
      setShowFloatingNav(totalScroll > 420);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Thin Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 transition-all duration-150 ease-out shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Bottom Quick Action Pill */}
      {showFloatingNav && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 p-1 rounded-2xl border border-white/[0.12] bg-[#0c0d16]/90 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 card-shine">
          {onOpenCommandMenu && (
            <button
              type="button"
              onClick={onOpenCommandMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              title="Open Spotlight Command Menu (⌘K)"
              aria-label="Open Spotlight Command Menu"
            >
              <Command className="h-3.5 w-3.5 text-blue-400" />
              <span className="hidden sm:inline">Spotlight</span>
            </button>
          )}

          <div className="h-4 w-px bg-white/[0.08]" />

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Back to top"
            aria-label="Scroll back to top"
          >
            <span className="text-[11px] text-zinc-400">{Math.round(scrollProgress)}%</span>
            <ArrowUp className="h-3.5 w-3.5 text-blue-400" />
          </button>
        </div>
      )}
    </>
  );
}
