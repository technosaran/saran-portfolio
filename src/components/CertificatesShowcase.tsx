'use client';

import { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  Copy, 
  Check, 
  X,
  ExternalLink,
  ShieldCheck
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
    'Exception Handling & File Operations'
  ],
  'ORACLE-OCI-DS': [
    'Oracle Cloud Infrastructure',
    'Machine Learning Model Lifecycle',
    'Hyperparameter Optimization',
    'Model Deployment'
  ],
  'IBM-AI-FUND': [
    'Artificial Intelligence Concepts',
    'Supervised & Unsupervised Learning',
    'Deep Learning Fundamentals',
    'AI Ethics'
  ],
  'AWS-COURSERA': [
    'AWS Cloud Architecture',
    'Amazon EC2 Compute & S3 Storage',
    'Identity & Access Management (IAM)',
    'Virtual Private Cloud (VPC)'
  ],
  'GUVI-PROMPT': [
    'Prompt Engineering Techniques',
    'Context Window Strategies',
    'Few-Shot & Zero-Shot Prompting',
    'AI Model Integration'
  ],
  'NASSCOM-GOLD': [
    'Data Acquisition Fundamentals',
    'Data Cleansing & Transformation',
    'Feature Preparation',
    'Data Processing Workflows'
  ]
};

export default function CertificatesShowcase({ certificates }: CertificatesShowcaseProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

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

  const copyCredentialId = (cert: Certificate) => {
    if (!cert.credential_id) return;
    try {
      navigator.clipboard.writeText(cert.credential_id);
      setCopiedId(cert.id);
      toast('Credential ID copied', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast('Failed to copy ID', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Provider Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedProvider('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              selectedProvider === 'all'
                ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
                : 'border border-[#1b1f2b] bg-[#0f1118] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Providers
          </button>
          {providers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedProvider(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                selectedProvider === p
                  ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
                  : 'border border-[#1b1f2b] bg-[#0f1118] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search credentials..."
            className="w-full rounded-lg border border-[#1b1f2b] bg-[#0f1118] pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCertificates.map((cert) => {
          const competencies = cert.credential_id ? CERT_COMPETENCIES[cert.credential_id] : undefined;

          return (
            <div
              key={cert.id}
              className="flex flex-col justify-between rounded-xl border border-[#1f2432] bg-[#0f1118] p-5 hover:border-[#2d3448] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <BrandLogo name={cert.provider} size={32} badgeVariant="none" />
                  <span className="text-[10px] font-mono text-zinc-500">
                    {cert.issue_date || '2025'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-100 leading-snug">
                    {cert.title}
                  </h4>
                  <div className="text-xs text-emerald-400 font-medium mt-1">
                    {cert.provider}
                  </div>
                </div>

                {/* Competencies */}
                {competencies && (
                  <div className="pt-2 border-t border-[#1b1f2b] space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Curriculum Competencies
                    </div>
                    <ul className="text-[11px] text-zinc-400 space-y-1">
                      {competencies.slice(0, 3).map((comp, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-zinc-600" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom ID / Action */}
              <div className="pt-4 mt-3 border-t border-[#20222a] flex items-center justify-between text-[11px] font-mono">
                {cert.credential_id ? (
                  <button
                    type="button"
                    onClick={() => copyCredentialId(cert)}
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer"
                    title="Click to copy ID"
                  >
                    <span>ID: {cert.credential_id}</span>
                    {copiedId === cert.id ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-zinc-500" />
                    )}
                  </button>
                ) : (
                  <span className="text-zinc-600">Credential</span>
                )}

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white inline-flex items-center gap-1"
                  >
                    <span>Verify</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12 border border-dashed border-[#20222a] rounded-xl text-zinc-500 text-xs font-mono">
          {certificates.length === 0 
            ? "No certificates in database. Add certifications in admin panel to stream here in real time."
            : `No certificates found matching "${searchQuery}"`}
        </div>
      )}

    </div>
  );
}
