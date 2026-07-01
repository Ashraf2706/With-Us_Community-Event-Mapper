export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">With Us-Community Event Mapper</h1>
      <p className="text-sm text-gray-500">Phase 1 scaffold.</p>
      <a className="text-sm underline" href="/api/health">
        Check API health
      </a>
    </main>
  );
}