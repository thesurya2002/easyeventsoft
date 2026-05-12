'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, EmptyState } from '@/components/ui/Feedback';
import Badge from '@/components/ui/Badge';
import { fmtRelative, fmtDate } from '@/lib/utils';
import { activityLogs, company, companies } from '@/data/seed';

const ACTIONS  = ['CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'CONVERT', 'LOGIN'];

const ACTION_TONE = {
  CREATE: 'green', UPDATE: 'sky', DELETE: 'rose',
  ASSIGN: 'violet', CONVERT: 'amber', LOGIN: 'slate',
};

export default function AdminLogsPage() {
  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <AdminLogsContent />
    </DashboardLayout>
  );
}

function AdminLogsContent() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  // In the demo every log is from the Demo Events company. We simulate cross-tenant view by tagging.
  const allLogs = useMemo(() =>
    activityLogs.map((l) => ({ ...l, companyId: company.id, companyName: company.name })),
  []);

  const filtered = useMemo(() => {
    let out = allLogs;
    if (search) {
      const q = search.toLowerCase();
      out = out.filter((l) =>
        l.description?.toLowerCase().includes(q) || l.user?.name?.toLowerCase().includes(q)
      );
    }
    if (actionFilter) out = out.filter((l) => l.action === actionFilter);
    if (companyFilter) out = out.filter((l) => l.companyId === companyFilter);
    return out;
  }, [allLogs, search, actionFilter, companyFilter]);

  return (
    <>
      <PageHeader title="Platform Activity" subtitle="Audit log across every tenant" />

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input pl-9" />
          </div>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="input">
            <option value="">All actions</option>
            {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="input">
            <option value="">All companies</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matching logs" />
      ) : (
        <div className="card divide-y divide-ink-100">
          {filtered.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-4">
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-xs font-bold shrink-0">
                {(log.user?.name || '?').split(' ').map((p) => p[0]).slice(0,2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-ink-900">{log.user?.name || 'System'}</span>
                  <Badge color={ACTION_TONE[log.action] || 'slate'} className="text-[10px]">{log.action}</Badge>
                  <Badge color="slate" className="text-[10px]">{log.entity}</Badge>
                  <Badge color="brand" className="text-[10px]">{log.companyName}</Badge>
                </div>
                <p className="text-sm text-ink-700 mt-1">{log.description}</p>
                <p className="text-xs text-ink-500 mt-1">{fmtRelative(log.createdAt)} • {fmtDate(log.createdAt, 'dd MMM yyyy, HH:mm')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
