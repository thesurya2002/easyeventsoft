'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { users, company } from '@/data/seed';

const AuthContext = createContext(null);
const PUBLIC_PATHS = ['/login'];
const STORAGE_KEY = 'demo:userId';

function hydrate(userId) {
  const u = users.find((u) => u.id === userId);
  if (!u) return null;
  return {
    ...u,
    company: u.companyId ? company : null,
  };
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = localStorage.getItem(STORAGE_KEY);
    if (id) setUser(hydrate(id));
    setLoading(false);
  }, []);

  // Redirect protection
  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));
    if (!user && !isPublic) router.replace('/login');
  }, [loading, user, pathname, router]);

  const loginAs = useCallback((userId) => {
    const u = hydrate(userId);
    if (!u) return null;
    localStorage.setItem(STORAGE_KEY, userId);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    router.replace('/login');
  }, [router]);

  const value = { user, loading, loginAs, logout, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
