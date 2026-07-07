'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const input =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Could not create your account. Try again.');
        return;
      }
      router.push('/profile');
      router.refresh();
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          <span className="text-sm font-semibold tracking-tight text-slate-900">With Us</span>
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Find and organize events near you.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
            <input id="name" className={input} value={name}
              onChange={(e) => setName(e.target.value)} required maxLength={100} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input id="email" type="email" autoComplete="email" className={input} value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input id="password" type="password" autoComplete="new-password" className={input}
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <p className="text-xs text-slate-400">At least 8 characters.</p>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">Log in</Link>
        </p>
      </div>
    </main>
  );
}