'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  User, 
  Briefcase, 
  Layers, 
  Code2, 
  Award, 
  Lock, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Database
} from 'lucide-react';
import { Profile, Project, Experience, Skill, Certificate } from '@/lib/neon/db';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'experience' | 'skills' | 'certificates' | 'settings'>('profile');
  
  // Data State
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Feedback State
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal / Form state for new items
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
    highlights: ''
  });

  const [newExp, setNewExp] = useState({
    intern_id: '',
    role: '',
    company: '',
    period: '',
    location: '',
    description: ''
  });

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Programming Languages',
    level: 'Proficient'
  });

  const [newCert, setNewCert] = useState({
    credential_id: '',
    title: '',
    provider: '',
    issue_date: '2025',
    url: ''
  });

  const [newPassword, setNewPassword] = useState('');

  const notify = useCallback((type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.profile) setProfile(json.data.profile);
        if (json.data.projects) setProjects(json.data.projects);
        if (json.data.experience) setExperience(json.data.experience);
        if (json.data.skills) setSkills(json.data.skills);
        if (json.data.certificates) setCertificates(json.data.certificates);
      }
    } catch {
      notify('error', 'Failed to load portfolio data from Neon');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  // 1. Verify Auth
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (data.authenticated) {
          setAdminEmail(data.email);
          loadData();
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      }
    };
    verifyAuth();
  }, [router, loadData]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Profile updated successfully in Neon database!');
      } else {
        notify('error', data.error || 'Failed to update profile');
      }
    } catch {
      notify('error', 'Network error while saving profile');
    } finally {
      setSaving(false);
    }
  };

  // Add Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        tech_stack: newProject.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        github_url: newProject.github_url.trim() || null,
        live_url: newProject.live_url.trim() || null,
        highlights: newProject.highlights.split('\n').map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Project added to Neon database!');
        setNewProject({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', highlights: '' });
        loadData();
      } else {
        notify('error', data.error || 'Failed to add project');
      }
    } catch {
      notify('error', 'Error adding project');
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project from the database?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('success', 'Project deleted from Neon database');
        loadData();
      }
    } catch {
      notify('error', 'Failed to delete project');
    }
  };

  // Add Experience
  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    setSaving(true);
    try {
      const fallbackId = `exp-${Math.random().toString(36).slice(2, 8)}`;
      const payload = {
        intern_id: newExp.intern_id || fallbackId,
        role: newExp.role.trim(),
        company: newExp.company.trim(),
        period: newExp.period.trim(),
        location: newExp.location.trim() || 'Remote',
        description: newExp.description.split('\n').map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Experience added to Neon database!');
        setNewExp({ intern_id: '', role: '', company: '', period: '', location: '', description: '' });
        loadData();
      } else {
        notify('error', data.error || 'Failed to add experience');
      }
    } catch {
      notify('error', 'Error adding experience');
    } finally {
      setSaving(false);
    }
  };

  // Delete Experience
  const handleDeleteExp = async (id: number) => {
    if (!confirm('Delete this experience entry?')) return;
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('success', 'Experience deleted');
        loadData();
      }
    } catch {
      notify('error', 'Failed to delete');
    }
  };

  // Add Skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', `Skill "${newSkill.name}" added to Neon!`);
        setNewSkill({ ...newSkill, name: '' });
        loadData();
      } else {
        notify('error', data.error || 'Failed to add skill');
      }
    } catch {
      notify('error', 'Failed to add skill');
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to remove this skill from the database?')) return;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('success', 'Skill removed from database');
        loadData();
      }
    } catch {
      notify('error', 'Failed to delete skill');
    }
  };

  // Add Certificate
  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.provider) return;
    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Certificate added to Neon!');
        setNewCert({ credential_id: '', title: '', provider: '', issue_date: '2025', url: '' });
        loadData();
      } else {
        notify('error', data.error || 'Failed to add certificate');
      }
    } catch {
      notify('error', 'Failed to add certificate');
    }
  };

  // Delete Certificate
  const handleDeleteCert = async (id: number) => {
    if (!confirm('Delete certificate?')) return;
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('success', 'Certificate deleted');
        loadData();
      }
    } catch {
      notify('error', 'Failed to delete');
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      notify('error', 'Password must be at least 6 characters');
      return;
    }
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Admin password updated in Neon database!');
        setNewPassword('');
      } else {
        notify('error', data.error || 'Failed to update password');
      }
    } catch {
      notify('error', 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-xs text-neutral-400">Connecting to Neon Database & Verifying Auth...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-base">Saran R · Admin Control Panel</h1>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  <Database className="h-2.5 w-2.5" /> Neon Synced
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Authenticated as: {adminEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Portfolio
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Status notification toast */}
      {statusMsg && (
        <div className="fixed top-20 right-6 z-50">
          <div className={`rounded-xl border px-4 py-3 shadow-2xl flex items-center gap-2 text-xs font-medium backdrop-blur-xl ${
            statusMsg.type === 'success' 
              ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-300' 
              : 'border-red-500/30 bg-red-950/90 text-red-300'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {statusMsg.text}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-4 mb-8">
          {[
            { id: 'profile', name: 'Profile & Bio', icon: User },
            { id: 'projects', name: `Projects (${projects.length})`, icon: Layers },
            { id: 'experience', name: `Experience (${experience.length})`, icon: Briefcase },
            { id: 'skills', name: `Skills (${skills.length})`, icon: Code2 },
            { id: 'certificates', name: `Certifications (${certificates.length})`, icon: Award },
            { id: 'settings', name: 'Security & Auth', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* 1. PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-400" />
                Personal Profile & Header Details
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Changes are saved directly to the Neon Postgres profile table</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300">Full Name</label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">Professional Title</label>
                <input
                  type="text"
                  value={profile.title || ''}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300">Headline</label>
                <input
                  type="text"
                  value={profile.headline || ''}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300">Professional Summary / Bio</label>
                <textarea
                  rows={4}
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">Contact Email</label>
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">Contact Phone</label>
                <input
                  type="text"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">Location</label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">College / University</label>
                <input
                  type="text"
                  value={profile.college || ''}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">Degree</label>
                <input
                  type="text"
                  value={profile.degree || ''}
                  onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">Graduation Year</label>
                <input
                  type="text"
                  value={profile.graduation_year || ''}
                  onChange={(e) => setProfile({ ...profile, graduation_year: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">GitHub Profile URL</label>
                <input
                  type="url"
                  value={profile.github_url || ''}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profile.linkedin_url || ''}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">Portfolio Website URL</label>
                <input
                  type="url"
                  value={profile.website_url || ''}
                  onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">LeetCode Profile URL</label>
                <input
                  type="url"
                  value={profile.leetcode_url || ''}
                  onChange={(e) => setProfile({ ...profile, leetcode_url: e.target.value })}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://leetcode.com/u/technosaran"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-800">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-2.5 text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* 2. PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* New Project Form */}
            <form onSubmit={handleAddProject} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" />
                Add New Project to Neon Database
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. arthaX – Enterprise Financial Terminal"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short summary of what this project does..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Next.js, TypeScript, PostgreSQL, TailwindCSS"
                    value={newProject.tech_stack}
                    onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/technosaran/project"
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Live URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://project.vercel.app"
                    value={newProject.live_url}
                    onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300">Key Highlights / Bullets (one per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Architected real-time wealth terminal&#10;Engineered PostgreSQL RLS schemas&#10;Cut load time by 35%"
                    value={newProject.highlights}
                    onChange={(e) => setNewProject({ ...newProject, highlights: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !newProject.title.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Project
              </button>
            </form>

            {/* Existing Projects List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
                Current Projects ({projects.length})
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-sm">{p.title}</h4>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                          title="Delete Project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-neutral-300 leading-relaxed">{p.description}</p>
                      
                      <div className="mt-3 flex flex-wrap gap-1">
                        {p.tech_stack?.map((t) => (
                          <span key={t} className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300">
                            {t}
                          </span>
                        ))}
                      </div>

                      {p.highlights && p.highlights.length > 0 && (
                        <ul className="mt-3 space-y-1 text-[11px] text-neutral-400 border-t border-neutral-800 pt-2">
                          {p.highlights.map((h, i) => (
                            <li key={i}>• {h}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>ID: {p.id}</span>
                      {p.github_url && <span className="truncate max-w-[150px]">{p.github_url}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            <form onSubmit={handleAddExp} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" />
                Add Work / Internship Experience
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Role / Position *</label>
                  <input
                    type="text"
                    required
                    placeholder="AI & ML Intern"
                    value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="Edunet Foundation (IBM SkillsBuild)"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Period *</label>
                  <input
                    type="text"
                    required
                    placeholder="June 2025 – July 2025"
                    value={newExp.period}
                    onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Location</label>
                  <input
                    type="text"
                    placeholder="Remote / Chennai"
                    value={newExp.location}
                    onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300">Description / Responsibilities (one per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Engineered machine learning models using Python and Scikit-Learn&#10;Architected an end-to-end AIML capstone project"
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !newExp.role || !newExp.company}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Experience
              </button>
            </form>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
                Current Experience Records ({experience.length})
              </h3>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                        <span className="text-xs text-emerald-400 font-medium">@{exp.company}</span>
                        <span className="text-[11px] text-neutral-500">({exp.period})</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">{exp.location}</p>
                      <ul className="mt-2 space-y-1 text-xs text-neutral-300">
                        {exp.description?.map((d, i) => (
                          <li key={i}>• {d}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleDeleteExp(exp.id)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                      title="Delete Experience"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <form onSubmit={handleAddSkill} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PyTorch, Next.js, Docker"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="min-w-[200px]">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Web & Backend Frameworks">Web & Backend Frameworks</option>
                  <option value="AI/ML & Cloud">AI/ML & Cloud</option>
                  <option value="Databases & Developer Tools">Databases & Developer Tools</option>
                  <option value="Core CS Fundamentals">Core CS Fundamentals</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!newSkill.name.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Skill
              </button>
            </form>

            <div className="space-y-6">
              {['Programming Languages', 'Web & Backend Frameworks', 'AI/ML & Cloud', 'Databases & Developer Tools', 'Core CS Fundamentals'].map((cat) => {
                const catSkills = skills.filter((s) => s.category === cat);
                return (
                  <div key={cat} className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                    <h3 className="font-bold text-white text-sm border-b border-neutral-800 pb-2 mb-3 flex items-center justify-between">
                      <span>{cat}</span>
                      <span className="text-xs text-neutral-500">{catSkills.length} skills</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200"
                        >
                          {s.name}
                          <button
                            onClick={() => handleDeleteSkill(s.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors ml-1"
                            title="Remove skill"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div className="space-y-8">
            <form onSubmit={handleAddCert} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" />
                Add Verified Certificate
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oracle Cloud Infrastructure Certified Data Science Professional"
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Issuing Organization / Provider *</label>
                  <input
                    type="text"
                    required
                    placeholder="Oracle University / IBM SkillsBuild"
                    value={newCert.provider}
                    onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Credential ID (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. OCI-DS-2025"
                    value={newCert.credential_id}
                    onChange={(e) => setNewCert({ ...newCert, credential_id: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300">Issue Year / Date</label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={newCert.issue_date}
                    onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!newCert.title || !newCert.provider}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Certificate
              </button>
            </form>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{cert.provider}</span>
                    <h4 className="font-bold text-white text-xs mt-1 leading-snug">{cert.title}</h4>
                    {cert.credential_id && (
                      <p className="text-[10px] text-neutral-500 mt-1">ID: {cert.credential_id}</p>
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400">{cert.issue_date}</span>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                      title="Delete Certificate"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-md bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" />
              Update Admin Password
            </h3>
            <p className="text-xs text-neutral-400">
              Change the password required to access this admin panel. Stored with SHA-256 in Neon Postgres.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300">New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={newPassword.length < 6}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2.5 text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
