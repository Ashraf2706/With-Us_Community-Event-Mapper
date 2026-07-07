import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { ProfileForm } from './profile-form';
import { LogoutButton } from '@/components/logout-button';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/profile');

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Your profile</h1>
        <LogoutButton />
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
        <span>{user.email}</span>
        {!user.emailVerified && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            Email not verified
          </span>
        )}
      </div>

      <ProfileForm
        initial={{
          name: user.name,
          bio: user.bio ?? '',
          avatarUrl: user.avatarUrl ?? '',
        }}
      />
    </main>
  );
}