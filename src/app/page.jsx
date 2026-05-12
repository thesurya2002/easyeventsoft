'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login');
    else if (user.role === 'SUPER_ADMIN') router.replace('/admin/companies');
    else router.replace('/dashboard');
  }, [user, loading, router]);

  return (
    <div className="min-h-screen grid place-items-center">
      <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
    </div>
  );
}
