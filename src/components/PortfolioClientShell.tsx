'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';
import Navbar from './Navbar';
import CommandMenu from './CommandMenu';
import ScrollProgressBar from './ScrollProgressBar';
import { ToastProvider } from './Toast';
import RealtimePortfolioProvider, { useRealtimeData, PortfolioData } from './RealtimePortfolioProvider';

interface CommandMenuContextType {
  openCommandMenu: () => void;
  closeCommandMenu: () => void;
}

const CommandMenuContext = createContext<CommandMenuContextType>({
  openCommandMenu: () => {},
  closeCommandMenu: () => {},
});

export function useCommandMenu() {
  return useContext(CommandMenuContext);
}

interface PortfolioClientShellProps {
  initialData: PortfolioData;
  children: ReactNode;
}

function PortfolioClientShellInner({ children }: { children: ReactNode }) {
  const { profile } = useRealtimeData();
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  const openCommandMenu = () => setCommandMenuOpen(true);
  const closeCommandMenu = () => setCommandMenuOpen(false);

  return (
    <ToastProvider>
      <CommandMenuContext.Provider value={{ openCommandMenu, closeCommandMenu }}>
        <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-200">
          {/* Top Reading Progress Bar */}
          <ScrollProgressBar />

          {/* Sticky Modern Navbar with Live Realtime Profile */}
          <Navbar 
            profile={profile} 
            onOpenCommandMenu={openCommandMenu} 
          />

          {/* Command Menu Spotlight Dialog */}
          {commandMenuOpen && (
            <CommandMenu
              isOpen={commandMenuOpen}
              onClose={closeCommandMenu}
              email={profile.email}
              phone={profile.phone}
              resumeUrl="/resume.pdf"
            />
          )}

          {/* Page Content */}
          <main id="main-content">
            {children}
          </main>
        </div>
      </CommandMenuContext.Provider>
    </ToastProvider>
  );
}

export default function PortfolioClientShell({ initialData, children }: PortfolioClientShellProps) {
  return (
    <RealtimePortfolioProvider initialData={initialData}>
      <PortfolioClientShellInner>
        {children}
      </PortfolioClientShellInner>
    </RealtimePortfolioProvider>
  );
}
