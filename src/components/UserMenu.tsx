'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-700">Logged in as: {user.email}</span>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}