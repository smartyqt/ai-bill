// src/app/signup/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/login'); // Redirect to login after signup
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form className="space-y-4" onSubmit={handleSignup}>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Sign Up
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </main>
  );
}