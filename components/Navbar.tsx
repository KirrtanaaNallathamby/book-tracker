'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Navbar({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">📚 Book Tracker</h1>
        {userEmail && (
          <div className="flex items-center gap-4">
            <span className="text-sm">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}