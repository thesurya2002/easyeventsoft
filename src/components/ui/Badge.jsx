'use client';

import { cn } from '@/lib/utils';

const tone = {
  neutral: 'bg-ink-100 text-ink-700',
  brand:   'bg-brand-100 text-brand-800',
  green:   'bg-emerald-100 text-emerald-700',
  amber:   'bg-amber-100 text-amber-800',
  rose:    'bg-rose-100 text-rose-700',
  sky:     'bg-sky-100 text-sky-700',
  violet:  'bg-violet-100 text-violet-700',
  slate:   'bg-slate-100 text-slate-700',
};

export const STATUS_TONE = {
  NEW:'sky', CONTACTED:'amber', NEGOTIATION:'violet', CONFIRMED:'green', LOST:'rose',
  PLANNING:'amber', ONGOING:'sky', COMPLETED:'green', CANCELLED:'rose',
  TODO:'slate', IN_PROGRESS:'sky', DONE:'green', BLOCKED:'rose',
  PENDING:'amber', PARTIAL:'sky', PAID:'green', OVERDUE:'rose',
  DRAFT:'slate', SENT:'sky', REFUNDED:'violet',
  ACTIVE:'green', TRIAL:'amber', SUSPENDED:'rose',
  LOW:'slate', MEDIUM:'sky', HIGH:'amber', URGENT:'rose',
};

const dotColor = (color) => (
  color === 'green' ? 'bg-emerald-500'
  : color === 'rose'  ? 'bg-rose-500'
  : color === 'amber' ? 'bg-amber-500'
  : color === 'sky'   ? 'bg-sky-500'
  : color === 'violet'? 'bg-violet-500'
  : color === 'brand' ? 'bg-brand-500'
  : 'bg-ink-400'
);

export default function Badge({ children, color = 'neutral', className, dot }) {
  return (
    <span className={cn('badge', tone[color] || tone.neutral, className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColor(color))} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }) {
  if (!status) return null;
  const color = STATUS_TONE[status] || 'neutral';
  return <Badge color={color} dot className={className}>{status.replace(/_/g, ' ').toLowerCase()}</Badge>;
}
