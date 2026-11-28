'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: 'slide' | 'scale' | 'stagger';
  delay?: number;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  variant = 'slide',
  delay = 0,
  threshold = 0.05,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      if (delay > 0) {
        timeoutId = setTimeout(() => el.classList.add('is-visible'), delay);
      } else {
        el.classList.add('is-visible');
      }
    };

    // Immediately reveal if already within or above the viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      reveal();
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -16px 0px' }
    );

    observer.observe(el);

    // Safety fallback so sections never stay permanently invisible on ultra-tall containers
    const safetyTimer = setTimeout(() => {
      el.classList.add('is-visible');
    }, 1800);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(safetyTimer);
    };
  }, [delay, threshold]);

  const animClass =
    variant === 'scale'
      ? 'animate-on-scroll-scale'
      : variant === 'stagger'
      ? 'stagger-children'
      : 'animate-on-scroll';

  return (
    <div ref={ref} className={`${animClass} ${className}`}>
      {children}
    </div>
  );
}
