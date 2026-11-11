'use client';

import { useState, useEffect } from 'react';
import { Database, ShieldCheck, Zap, Radio, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface ServiceStatus {
  ok: boolean;
  status: string;
  latencyMs: number;
  details: Record<string, unknown>;
}

interface StatusResponse {
  success: boolean;
  timestamp: string;
  branch: string;
  services: {
    postgres?: ServiceStatus;
    auth?: ServiceStatus;
    functions?: ServiceStatus;
    realtime?: ServiceStatus;
  };
}

export default function NeonStatusDashboard() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/neon/status');
      const json = await res.json();
      setData(json);
      setLastChecked(new Date().toLocaleTimeString());
    } catch {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const services = [
    {
      id: 'postgres',
      name: 'Lakebase Postgres',
      icon: Database,
      env: 'DATABASE_URL',
      desc: 'Relational data store with serverless connection pooling',
      status: data?.services?.postgres,
    },
    {
      id: 'auth',
      name: 'Neon Managed Auth',
      icon: ShieldCheck,
      env: 'NEON_AUTH_BASE_URL',
      desc: 'Schema-isolated Managed Better Auth on Postgres',
      status: data?.services?.auth,
    },
    {
      id: 'functions',
      name: 'Neon Functions',
      icon: Zap,
      env: 'NEON_FUNCTION_HOST_SUFFIX',
      desc: 'Low-latency edge HTTP compute deployed next to data',
      status: data?.services?.functions,
    },
    {
      id: 'realtime',
      name: 'Neon Realtime',
      icon: Radio,
      env: 'NEON_REALTIME_URL',
      desc: 'Live SQL query engine with WebSocket synchronization',
      status: data?.services?.realtime,
    },
  ];

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0e0f15]/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight">Neon Cloud Telemetry</h3>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
              branch: {data?.branch || 'production'}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Live serverless backend services connected to AWS <span className="text-zinc-300 font-mono">ap-southeast-1</span>
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] px-4 py-2 text-xs font-semibold text-zinc-200 transition-all border border-white/[0.08] hover:border-white/[0.15] disabled:opacity-50 cursor-pointer shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-400' : 'text-zinc-400'}`} />
          {loading ? 'Probing Services...' : 'Run Diagnostics'}
        </button>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((svc) => {
          const Icon = svc.icon;
          const isOk = svc.status?.ok ?? false;
          return (
            <div
              key={svc.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-black/40 p-5 transition-all hover:border-white/[0.14] hover:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/15 transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  {isOk ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      {svc.status?.latencyMs ? `${svc.status.latencyMs}ms` : 'Online'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <AlertCircle className="h-3 w-3" />
                      Probing
                    </span>
                  )}
                </div>

                <h4 className="mt-3.5 text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {svc.name}
                </h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  {svc.desc}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px]">
                  <code className="text-zinc-500 font-mono text-[10px] truncate max-w-[130px]">{svc.env}</code>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium font-mono ${
                    isOk ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {isOk ? 'HEALTHY' : 'CONNECTING'}
                  </span>
                </div>
                {svc.status?.status && (
                  <p className="mt-1.5 text-[11px] text-zinc-400 font-mono truncate">
                    {svc.status.status}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {lastChecked && (
        <div className="mt-5 flex items-center justify-between text-[11px] text-zinc-500 font-mono border-t border-white/[0.04] pt-4">
          <span>Target: AWS ap-southeast-1 (Singapore)</span>
          <span>Last probe: {lastChecked}</span>
        </div>
      )}
    </div>
  );
}
