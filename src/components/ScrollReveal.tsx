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
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => el.classList.add('is-visible'), delay);
          } else {
            el.classList.add('is-visible');
          }
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
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
