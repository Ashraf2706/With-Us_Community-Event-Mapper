'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const input =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30';

export function ProfileForm({
  initial,
}: {
  initial: { name: string; bio: string; avatarUrl: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus('idle');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setError(null);
    try {
      const payload: Record<string, string> = { name: form.name };
      if (form.bio) payload.bio = form.bio;
      if (form.avatarUrl) payload.avatarUrl = form.avatarUrl;

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Could not save your changes.');
        setStatus('error');
        return;
      }
      setStatus('saved');
      router.refresh();
    } catch {
      setError('Network error. Try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
        <input id="name" className={input} value={form.name}
          onChange={(e) => set('name', e.target.value)} required maxLength={100} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="bio" className="block text-sm font-medium text-slate-700">Bio</label>
        <textarea id="bio" rows={3} className={input} value={form.bio}
          onChange={(e) => set('bio', e.target.value)} maxLength={500}
          placeholder="A sentence or two about you." />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700">Avatar URL</label>
        <input id="avatarUrl" type="url" className={input} value={form.avatarUrl}
          onChange={(e) => set('avatarUrl', e.target.value)} placeholder="https://…" />
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === 'saving'}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60">
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
        {status === 'saved' && <span className="text-sm text-emerald-600">Saved</span>}
      </div>
    </form>
  );
}