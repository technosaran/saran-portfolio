'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, UserCheck, Sparkles } from 'lucide-react';

interface GuestMessage {
  id: number;
  name: string;
  email: string | null;
  message: string;
  created_at: string;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/portfolio/guestbook');
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch {
      // Handled silently
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/portfolio/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setEmail('');
        setMessage('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
        fetchMessages();
      }
    } catch {
      // Handled silently
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0e0f15]/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl flex flex-col h-[520px]">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-2 text-base tracking-tight">
              Visitor Guestbook
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-blue-300 border border-blue-500/20">
                Neon Sync
              </span>
            </h3>
            <p className="text-xs text-zinc-400">Leave a note, feedback, or collaboration inquiry</p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 text-xs">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-zinc-500">
            <UserCheck className="h-8 w-8 mb-2 opacity-40" />
            <p>No messages yet. Be the first to leave a greeting!</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-white/[0.05] bg-black/30 p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.02]"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200">{m.name}</span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                  <Clock className="h-3 w-3" />
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1.5 text-zinc-300 leading-relaxed">{m.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="border-t border-white/[0.06] pt-4 space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name *"
            required
            className="rounded-xl bg-black/50 border border-white/[0.08] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/80 transition-colors"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email (Optional)"
            className="rounded-xl bg-black/50 border border-white/[0.08] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/80 transition-colors"
          />
        </div>
        <div className="flex gap-2.5">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message or thought..."
            required
            className="flex-1 rounded-xl bg-black/50 border border-white/[0.08] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/80 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-blue-600/20"
          >
            {submitting ? 'Sending...' : (
              <>
                <Send className="h-3.5 w-3.5" />
                Post
              </>
            )}
          </button>
        </div>
        {success && (
          <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Message saved into Neon Postgres database!
          </p>
        )}
      </form>
    </div>
  );
}
