'use client';

import React, { useState } from 'react';
import { getCandidateLogoUrls, getEntityInfo } from '@/lib/logos';
import { getSkillLogo } from './TechLogos';

export interface BrandLogoProps {
  name: string;
  size?: number;
  className?: string;
  badgeVariant?: 'glass' | 'white' | 'dark' | 'none';
  showGlow?: boolean;
  alt?: string;
}

export default function BrandLogo({
  name,
  size = 28,
  className = '',
  badgeVariant = 'glass',
  showGlow = false,
  alt,
}: BrandLogoProps) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const info = getEntityInfo(name);
  const candidateUrls = React.useMemo(() => getCandidateLogoUrls(name, size), [name, size]);
  const activeUrl = candidateIndex < candidateUrls.length ? candidateUrls[candidateIndex] : null;

  const handleImageError = () => {
    setCandidateIndex((prev) => prev + 1);
  };

  const FallbackComponent = getSkillLogo(name);

  // Badge styles
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'white':
        return 'bg-white border border-white/20 shadow-sm';
      case 'dark':
        return 'bg-[#0f111a] border border-white/[0.08] shadow-inner';
      case 'none':
        return 'bg-transparent border-0';
      case 'glass':
      default:
        return 'bg-white/[0.06] backdrop-blur-md border border-white/[0.1] shadow-sm hover:border-blue-500/30';
    }
  };

  // Border radius proportional to size
  const borderRadius = Math.max(6, Math.floor(size * 0.26));
  const padding = badgeVariant === 'none' ? 0 : Math.max(2, Math.floor(size * 0.12));

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-all duration-200 overflow-hidden ${getBadgeStyle()} ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: `${borderRadius}px`,
        boxShadow: showGlow && info?.brandColor ? `0 0 16px ${info.brandColor}33` : undefined,
      }}
      title={name}
    >
      {activeUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={activeUrl}
          src={activeUrl}
          alt={alt || `${name} logo`}
          onError={handleImageError}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ padding: `${padding}px` }}
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full p-0.5">
          <FallbackComponent className="w-full h-full object-contain" />
        </div>
      )}
    </div>
  );
}
