'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Filter, Search } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, EmptyState } from '@/components/ui/Feedback';
import Badge from '@/components/ui/Badge';
import { fmtRelative, fmtDate } from '@/lib/utils';
import { activityLogs } from '@/data/seed';

const ACTIONS  = ['CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'CONVERT', 'LOGIN'];
const ENTITIES = ['Lead', 'Event', 'Vendor', 'Task', 'Payment', 'Invoice', 'Auth'];

const ACTION_TONE = {
  CREATE: 'green', UPDATE: 'sky', DELETE: 'rose',
  ASSIGN: 'violet', CONVERT: 'amber', LOGIN: 'slate',
};

export default function ActivityLogsPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN']}>
      <ActivityLogsContent />
    </DashboardLayout>
  );
}

function ActivityLogsContent() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [expanded, setExpanded] = useState({});

  const filtered = useMemo(() => {
    let out = activityLogs;
    if (search) {
      const q = search.toLowerCase();
      out = out.filter((l) =>
        l.description?.toLowerCase().includes(q) || l.user?.name?.toLowerCase().includes(q)
      );
    }
    if (actionFilter) out = out.filter((l) => l.action === actionFilter);
    if (entityFilter) out = out.filter((l) => l.entity === entityFilter);
    return out;
  }, [search, actionFilter, entityFilter]);

  return (
    <>
      <PageHeader title="Activity Logs" subtitle="Audit trail of every change in this workspace" />

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search description or user..." className="input pl-9" />
          </div>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="input">
            <option value="">All actions</option>
            {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className="input">
            <option value="">All entities</option>
            {ENTITIES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matching logs" />
      ) : (
        <div className="card divide-y divide-ink-100">
          {filtered.map((log) => {
            const open = expanded[log.id];
            const hasDiff = log.previousValue || log.newValue;
            return (
              <div key={log.id}>
                <button onClick={() => hasDiff && setExpanded((e) => ({ ...e, [log.id]: !open }))} className="w-full flex items-start gap-3 p-4 text-left hover:bg-ink-50/60">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-xs font-bold shrink-0">
                    {(log.user?.name || '?').split(' ').map((p) => p[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-ink-900">{log.user?.name || 'System'}</span>
                      <Badge color={ACTION_TONE[log.action] || 'slate'} className="text-[10px]">{log.action}</Badge>
                      <Badge color="slate" className="text-[10px]">{log.entity}</Badge>
                    </div>
                    <p className="text-sm text-ink-700 mt-1">{log.description}</p>
                    <p className="text-xs text-ink-500 mt-1">{fmtRelative(log.createdAt)} • {fmtDate(log.createdAt, 'dd MMM yyyy, HH:mm')}</p>
                  </div>
                  {hasDiff && (open ? <ChevronDown className="w-4 h-4 text-ink-400 shrink-0 mt-1" /> : <ChevronRight className="w-4 h-4 text-ink-400 shrink-0 mt-1" />)}
                </button>
                {open && hasDiff && (
                  <div className="px-4 pb-4 pl-16 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {log.previousValue && (
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
                        <div className="font-bold text-rose-700 uppercase tracking-wider text-[10px] mb-1">Before</div>
                        <pre className="font-mono text-ink-800 whitespace-pre-wrap leading-relaxed">{JSON.stringify(log.previousValue, null, 2)}</pre>
                      </div>
                    )}
                    {log.newValue && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                        <div className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] mb-1">After</div>
                        <pre className="font-mono text-ink-800 whitespace-pre-wrap leading-relaxed">{JSON.stringify(log.newValue, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
