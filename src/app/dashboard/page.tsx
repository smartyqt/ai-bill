'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import * as React from 'react';
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded mb-8 transition"
            onClick={() => router.push('/check-bill')}>
              + Add Bill
            </button>
        {/* List of bills will go here */}
      </main>
    </ProtectedRoute>
  );
}