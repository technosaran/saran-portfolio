'use client';

import { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  Copy, 
  Check, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { Certificate } from '@/lib/neon/db';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';

interface CertificatesShowcaseProps {
  certificates: Certificate[];
}

const CERT_COMPETENCIES: Record<string, string[]> = {
  'INFOSYS-JAVA': [
    'Java Programming Fundamentals',
    'Object-Oriented Programming (OOP)',
    'Collections Framework & Generics',
    'Exception Handling & File Operations',
    'Design Principles & Clean Code'
  ],
  'ORACLE-OCI-DS': [
    'Oracle Cloud Infrastructure',
    'Data Science Environment & Tools',
    'Machine Learning Model Lifecycle',
    'Hyperparameter Optimization',
    'Model Deployment'
  ],
  'IBM-AI-FUND': [
    'Artificial Intelligence Core Concepts',
    'Supervised & Unsupervised Learning',
    'Deep Learning Basics',
    'AI Ethics & Applications',
    'IBM SkillsBuild Curriculum'
  ],
  'AWS-COURSERA': [
    'AWS Cloud Fundamentals',
    'Amazon EC2 Compute & VPC',
    'Amazon S3 Object Storage',
    'Identity & Access Management (IAM)',
    'Cloud Architecture Principles'
  ],
  'GUVI-PROMPT': [
    'Prompt Engineering Techniques',
    'Few-Shot & Zero-Shot Prompting',
    'Context Window Strategies',
    'AI Model Integration',
    'Practical AI Applications'
  ],
  'NASSCOM-GOLD': [
    'Data Acquisition Fundamentals',
    'Data Cleansing & Transformation',
    'Feature Preparation',
    'FutureSkills Prime Gold Standard',
    'Data Processing Workflows'
  ]
};

export default function CertificatesShowcase({ certificates }: CertificatesShowcaseProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [inspectingCert, setInspectingCert] = useState<Certificate | null>(null);

  // Card mouse movement for spotlight
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // Extract unique providers
  const providers = useMemo(() => {
    const set = new Set<string>();
    certificates.forEach((c) => {
      const p = c.provider.split('/')[0].split('(')[0].trim();
      set.add(p);
    });
    return Array.from(set);
  }, [certificates]);

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        cert.title.toLowerCase().includes(q) ||
        cert.provider.toLowerCase().includes(q) ||
        (cert.credential_id && cert.credential_id.toLowerCase().includes(q));

      const matchesProvider = selectedProvider === 'all' || 
        cert.provider.toLowerCase().includes(selectedProvider.toLowerCase());

      return matchesSearch && matchesProvider;
    });
  }, [certificates, searchQuery, selectedProvider]);

  const copyCredentialId = (id: number, credId: string) => {
    try {
      navigator.clipboard.writeText(credId);
      setCopiedId(id);
      toast(`Credential ID "${credId}" copied!`, 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast('Failed to copy ID', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Credential Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center card-shine">
          <div className="text-xl font-bold font-mono text-white">{certificates.length}</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Certifications</div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center card-shine">
          <div className="text-xl font-bold font-mono text-emerald-400">Verified</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Credential Status</div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center card-shine">
          <div className="text-xl font-bold font-mono text-blue-400">{providers.length}</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Issuing Organizations</div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center card-shine">
          <div className="text-xl font-bold font-mono text-amber-400">2025</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Latest Issued</div>
        </div>
      </div>

      {/* Controls Bar: Provider Chips & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        
        {/* Provider Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedProvider('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              selectedProvider === 'all'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white bg-white/[0.02] border border-white/[0.06]'
            }`}
          >
            All Providers ({certificates.length})
          </button>
          {providers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedProvider(selectedProvider === p ? 'all' : p)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                selectedProvider === p
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-white/[0.02] border border-white/[0.06]'
              }`}
            >
              <BrandLogo name={p} size={15} badgeVariant="none" />
              <span>{p}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certification or ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 font-mono"
          />
        </div>
      </div>

      {/* Grid of Certificates */}
      {filteredCertificates.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/60 p-10 text-center font-mono text-xs text-zinc-400">
          No certifications match your search filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              onMouseMove={handleCardMouseMove}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d15]/85 p-5 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-300 shadow-md group card-shine hover:shadow-xl hover:shadow-blue-950/20 card-spotlight"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <BrandLogo
                      name={cert.provider}
                      size={38}
                      badgeVariant="glass"
                      showGlow
                      className="group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-400 truncate block">
                        {cert.provider}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Verified Credential
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 shrink-0 mt-0.5" title="Verified Credential">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-mono hidden group-hover:inline">Verified</span>
                  </div>
                </div>

                <h3 
                  onClick={() => setInspectingCert(cert)}
                  className="mt-3.5 text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug cursor-pointer flex items-center justify-between"
                >
                  <span>{cert.title}</span>
                  <ExternalLink className="h-3 w-3 text-zinc-500 group-hover:text-blue-400 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                </h3>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-zinc-400 font-mono">
                <button
                  type="button"
                  onClick={() => copyCredentialId(cert.id, cert.credential_id || 'VERIFIED')}
                  className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Click to copy credential ID"
                >
                  {copiedId === cert.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-zinc-500" />
                      <span>ID: {cert.credential_id || 'VERIFIED'}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInspectingCert(cert)}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-mono hover:underline cursor-pointer"
                  >
                    Details
                  </button>
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300 font-medium border border-blue-500/20">
                    {cert.issue_date || '2025'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREDENTIAL DETAILS MODAL */}
      {inspectingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#0c0d16] p-6 sm:p-7 shadow-2xl card-shine">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <BrandLogo
                  name={inspectingCert.provider}
                  size={42}
                  badgeVariant="glass"
                  showGlow
                  className="shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold block">
                    {inspectingCert.provider}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                    {inspectingCert.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingCert(null)}
                className="p-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs font-mono text-zinc-300">
              <div className="space-y-1.5">
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Key Topics &amp; Competencies</span>
                <div className="space-y-1 font-sans">
                  {(CERT_COMPETENCIES[inspectingCert.credential_id || ''] || [
                    'Core technical principles and implementation',
                    'Demonstrated problem-solving proficiency',
                    'Practical coursework & assessment',
                    'Issued upon successful completion'
                  ]).map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-zinc-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/50 p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-500">Credential Identifier</div>
                  <div className="text-white font-bold">{inspectingCert.credential_id || 'VERIFIED'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyCredentialId(inspectingCert.id, inspectingCert.credential_id || 'VERIFIED')}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] hover:bg-blue-500/20 transition-colors cursor-pointer"
                >
                  Copy ID
                </button>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400 font-sans">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified Certification</span>
                </span>
                <button
                  type="button"
                  onClick={() => setInspectingCert(null)}
                  className="px-3 py-1 rounded-lg bg-white/[0.06] text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
