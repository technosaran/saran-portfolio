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
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-transparent pointer-events-none">
        <div
          className="h-full bg-emerald-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Bottom Quick Action Pill */}
      {showFloatingNav && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 p-1 rounded-lg border border-[#20222a] bg-[#111216]/90 shadow-lg backdrop-blur-md transition-all">
          {onOpenCommandMenu && (
            <button
              type="button"
              onClick={onOpenCommandMenu}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
              title="Search (⌘K)"
              aria-label="Open Command Menu"
            >
              <Command className="h-3 w-3 text-emerald-400" />
              <span className="hidden sm:inline">Search</span>
            </button>
          )}

          <div className="h-3.5 w-px bg-zinc-800" />

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            title="Back to top"
            aria-label="Scroll back to top"
          >
            <span className="text-[11px] text-zinc-500">{Math.round(scrollProgress)}%</span>
            <ArrowUp className="h-3 w-3 text-zinc-300" />
          </button>
        </div>
      )}
    </>
  );
}
