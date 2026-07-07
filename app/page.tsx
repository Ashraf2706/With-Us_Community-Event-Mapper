import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-center">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-indigo-600" />
        <span className="text-lg font-semibold tracking-tight text-slate-900">With Us</span>
      </div>
      <p className="max-w-xs text-slate-500">
        Discover and organize local events, where you are.
      </p>
      <div className="flex gap-3">
        <Link href="/register"
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700">
          Get started
        </Link>
        <Link href="/login"
          className="rounded-md border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-white">
          Log in
        </Link>
      </div>
    </main>
  );
}