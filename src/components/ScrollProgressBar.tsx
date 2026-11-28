'use client';

import React, { useState, useEffect } from 'react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = Math.min(1, Math.max(0, totalScroll / windowHeight));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-transparent pointer-events-none"
    >
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 shadow-[0_0_10px_rgba(16,185,129,0.55)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    </div>
  );
}
