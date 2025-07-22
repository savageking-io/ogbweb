'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';

export default function Home() {
  const router = useRouter();
  const { token, user } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in
    if (token && user) {
      // If logged in, redirect to dashboard
      router.push('/dashboard');
    } else {
      // If not logged in, redirect to login
      router.push('/login');
    }
  }, [token, user, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}