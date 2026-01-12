'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
 
  const currentStatus = searchParams.get('status') || '';
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const handleNavigation = (status: string) => {
    if (status === '') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard?status=${status}`);
    }
  };

  const navItems = [
    { name: 'All Books', status: '', icon: '📚' },
    { name: 'Reading', status: 'Reading', icon: '📖' },
    { name: 'Completed', status: 'Completed', icon: '✅' },
    { name: 'Wishlist', status: 'Wishlist', icon: '⭐' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Book Tracker</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = currentStatus === item.status;
            return (
              <button
                key={item.status}
                onClick={() => handleNavigation(item.status)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Signed in as</p>
          <p className="text-sm font-medium text-gray-900 truncate" title={userEmail}>
            {userEmail}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}