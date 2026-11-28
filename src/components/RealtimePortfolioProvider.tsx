'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Profile, Project, Skill, Experience, Certificate } from '@/lib/neon/db';

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  certificates: Certificate[];
  dataSource?: 'database' | 'fallback';
}

interface RealtimeContextType extends PortfolioData {
  isRealtimeConnected: boolean;
  dataSource: 'database' | 'fallback';
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
  const [dataSource, setDataSource] = useState<'database' | 'fallback'>(
    initialData.dataSource || 'fallback'
  );
  const [sseConnected, setSseConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  // Pull latest data from un-cached API
  const refreshNow = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio/data', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        if (json.source === 'database' || json.source === 'fallback') {
          setDataSource(json.source);
        }
        setData({
          profile: json.data.profile || initialData.profile,
          projects: json.data.projects || [],
          skills: json.data.skills || [],
          experience: json.data.experience || [],
          certificates: json.data.certificates || [],
          dataSource: json.source,
        });
        setLastUpdated(Date.now());
      }
    } catch {
      // Preserve existing snapshot cleanly on transient network errors
    }
  }, [initialData.profile]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let broadcastChannel: BroadcastChannel | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    // Only establish SSE & background sync when backed by a live database, or perform a single initial check
    if (dataSource === 'database') {
      try {
        eventSource = new EventSource('/api/portfolio/stream');

        eventSource.onopen = () => {
          setSseConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.type === 'connected') {
              setSseConnected(true);
            } else if (payload.type === 'update') {
              refreshNow();
            }
          } catch {
            // ignore parse errors
          }
        };

        eventSource.onerror = () => {
          setSseConnected(false);
        };
      } catch {
        // EventSource failed to instantiate
      }

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

      // Gentle backup poll only when page is visible (SSE handles real-time updates)
      pollInterval = setInterval(() => {
        if (typeof document === 'undefined' || document.visibilityState === 'visible') {
          refreshNow();
        }
      }, 15000);

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
    }

    return undefined;
  }, [dataSource, refreshNow]);

  const isRealtimeConnected = dataSource === 'database' && sseConnected;

  return (
    <RealtimeContext.Provider
      value={{
        ...data,
        dataSource,
        isRealtimeConnected,
        lastUpdated,
        refreshNow,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
