'use client';

import { Inbox, Loader2 } from 'lucide-react';

export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="card p-12 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-ink-500 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-ink-500">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function DemoBanner() {
  return (
    <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
      <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">Demo</span>
      <p>You're browsing a static preview. Create/edit/delete actions are simulated — changes are kept in-memory only and reset on refresh.</p>
    </div>
  );
}
