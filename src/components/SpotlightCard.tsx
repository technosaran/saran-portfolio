'use client';

import React, { useRef, ReactNode, CSSProperties } from 'react';

export type SpotlightTone = 'emerald' | 'sky' | 'amber' | 'violet' | 'neutral';

const TONE_VARS: Record<SpotlightTone, { fill: string; border: string }> = {
  emerald: {
    fill: 'rgba(16, 185, 129, 0.06)',
    border: 'rgba(16, 185, 129, 0.35)',
  },
  sky: {
    fill: 'rgba(56, 189, 248, 0.06)',
    border: 'rgba(56, 189, 248, 0.35)',
  },
  amber: {
    fill: 'rgba(245, 158, 11, 0.06)',
    border: 'rgba(245, 158, 11, 0.35)',
  },
  violet: {
    fill: 'rgba(167, 139, 250, 0.06)',
    border: 'rgba(167, 139, 250, 0.35)',
  },
  neutral: {
    fill: 'rgba(255, 255, 255, 0.035)',
    border: 'rgba(255, 255, 255, 0.16)',
  },
};

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  tone?: SpotlightTone;
  onClick?: () => void;
}

export default function SpotlightCard({
  children,
  className = '',
  tone = 'emerald',
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const vars = TONE_VARS[tone];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={
        {
          '--spotlight-fill': vars.fill,
          '--spotlight-border': vars.border,
        } as CSSProperties
      }
      className={`card-spotlight card-bevel ${className}`}
    >
      {children}
    </div>
  );
}
