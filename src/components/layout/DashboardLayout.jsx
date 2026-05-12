'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { DemoBanner } from '@/components/ui/Feedback';

export default function DashboardLayout({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(user.role === 'SUPER_ADMIN' ? '/admin/companies' : '/dashboard');
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
      </div>
    );
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return (
    <div className="min-h-screen bg-ink-50/40">
      <Sidebar />
      <main className="lg:pl-72 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" key={pathname}>
          <DemoBanner />
          {children}
        </div>
      </main>
    </div>
  );
}
