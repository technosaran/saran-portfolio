'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface Toast {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success', duration: number = 2800) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Render Portal */}
      <div 
        aria-live="polite" 
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              t.type === 'error'
                ? 'bg-[#1c0d12]/95 border-rose-500/40 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                : t.type === 'info'
                ? 'bg-[#090e24]/95 border-indigo-500/40 text-cyan-200 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                : 'bg-[#081614]/95 border-emerald-500/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {t.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              ) : t.type === 'info' ? (
                <Info className="h-4 w-4 text-cyan-400 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              )}
              <span className="text-xs font-medium font-sans text-white truncate">
                {t.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-zinc-400 hover:text-white p-0.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      toast: (msg: string) => {
        if (typeof console !== 'undefined') console.log('[Toast]', msg);
      }
    };
  }
  return context;
}
