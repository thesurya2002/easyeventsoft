import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function cn(...inputs) { return twMerge(clsx(inputs)); }

export function inr(n) {
  if (n === null || n === undefined || n === '') return '—';
  const num = Number(n);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function fmtDate(d, pattern = 'dd MMM yyyy') {
  if (!d) return '—';
  const date = typeof d === 'string' ? parseISO(d) : d;
  try { return format(date, pattern); } catch { return '—'; }
}

export function fmtRelative(d) {
  if (!d) return '—';
  const date = typeof d === 'string' ? parseISO(d) : d;
  try { return formatDistanceToNow(date, { addSuffix: true }); } catch { return '—'; }
}

export const ROLE_LABEL = {
  SUPER_ADMIN:   'Super Admin',
  COMPANY_ADMIN: 'Company Admin',
  EVENT_MANAGER: 'Event Manager',
  STAFF:         'Staff Member',
  ACCOUNTANT:    'Accountant',
};

// Helper for static-export image/link paths under a basePath
export function withBase(path) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path.startsWith('/')) return path;
  return base + path;
}
