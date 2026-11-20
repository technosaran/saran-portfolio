'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Profile, Project, Skill, Experience, Certificate } from '@/lib/neon/db';

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  certificates: Certificate[];
}

interface RealtimeContextType extends PortfolioData {
  isRealtimeConnected: boolean;
  lastUpdated: number;
  refreshNow: () => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export function useRealtimeData() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtimeData must be used within RealtimePortfolioProvider');
  }
  return context;
}

interface RealtimePortfolioProviderProps {
  initialData: PortfolioData;
  children: ReactNode;
}

export default function RealtimePortfolioProvider({
  initialData,
  children,
}: RealtimePortfolioProviderProps) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  // Function to pull latest data from un-cached API
  const refreshNow = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio/data', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        setData({
          profile: json.data.profile || initialData.profile,
          projects: json.data.projects || [],
          skills: json.data.skills || [],
          experience: json.data.experience || [],
          certificates: json.data.certificates || [],
        });
        setLastUpdated(Date.now());
      }
    } catch (err) {
      console.warn('[REALTIME CLIENT SYNC NOTE]', err);
    }
  }, [initialData.profile]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let broadcastChannel: BroadcastChannel | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    // 1. Setup Server-Sent Events (SSE) Stream
    try {
      eventSource = new EventSource('/api/portfolio/stream');

      eventSource.onopen = () => {
        setIsRealtimeConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'connected') {
            setIsRealtimeConnected(true);
          } else if (payload.type === 'update') {
            refreshNow();
          }
        } catch {
          // ignore parse errors
        }
      };

      eventSource.onerror = () => {
        setIsRealtimeConnected(false);
      };
    } catch {
      // EventSource failed to instantiate, fallback gracefully
    }

    // 2. Setup Cross-Tab Instant BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        broadcastChannel = new BroadcastChannel('portfolio_realtime_channel');
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'portfolio_updated') {
            refreshNow();
          }
        };
      } catch {
        // ignore BroadcastChannel fallback
      }
    }

    // 3. Fallback Polling (Every 4 seconds) to guarantee sync even on reconnects
    pollInterval = setInterval(refreshNow, 4000);

    // 4. Instant sync on Tab Focus or Visibility Change
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshNow();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', refreshNow);

    return () => {
      if (eventSource) eventSource.close();
      if (broadcastChannel) broadcastChannel.close();
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', refreshNow);
    };
  }, [refreshNow]);

  return (
    <RealtimeContext.Provider
      value={{
        ...data,
        isRealtimeConnected,
        lastUpdated,
        refreshNow,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
