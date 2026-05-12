'use client';

import { useState } from 'react';
import { Wallet, Receipt, Calendar, Users as UsersIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/Feedback';
import { cn, inr } from '@/lib/utils';
import { reports } from '@/data/seed';

const TABS = [
  { id: 'revenue',  label: 'Revenue',  icon: Wallet },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'events',   label: 'Events',   icon: Calendar },
  { id: 'leads',    label: 'Leads',    icon: UsersIcon },
];

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#06b6d4', '#ef4444', '#a855f7'];

export default function ReportsPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'ACCOUNTANT', 'EVENT_MANAGER']}>
      <ReportsContent />
    </DashboardLayout>
  );
}

function ReportsContent() {
  const [tab, setTab] = useState('revenue');
  const data = reports[tab];

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Insights across revenue, expenses, events and leads"
      />

      <div className="flex flex-wrap gap-2 mb-6 border-b border-ink-200">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 -mb-px text-sm font-semibold border-b-2 transition-colors',
                active ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-600 hover:text-ink-900 hover:border-ink-300'
              )}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'revenue'  && <RevenueReport  data={data} />}
      {tab === 'expenses' && <ExpensesReport data={data} />}
      {tab === 'events'   && <EventsReport   data={data} />}
      {tab === 'leads'    && <LeadsReport    data={data} />}
    </>
  );
}

function Kpi({ label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="text-xs text-ink-500 font-medium uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-display font-bold text-ink-900 tracking-tight mt-1">{value}</div>
      {sub && <div className="text-xs text-ink-500 mt-1">{sub}</div>}
    </div>
  );
}

function RevenueReport({ data }) {
  if (!data) return null;
  const byMethod = data.byMethod || [];
  const byMonth  = data.byMonth  || [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi label="Total revenue" value={inr(data.total)} />
        <Kpi label="By method" value={`${byMethod.length} channels`} />
        <Kpi label="Avg per month" value={inr(byMonth.reduce((a, b) => a + Number(b.total || 0), 0) / Math.max(byMonth.length, 1))} />
      </div>
      <div className="card p-5">
        <h3 className="font-display text-lg font-semibold mb-4">Revenue by month</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => v >= 100000 ? `${(v/100000).toFixed(1)}L` : v >= 1000 ? `${v/1000}k` : v} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="total" fill="#4f46e5" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-5">
        <h3 className="font-display text-lg font-semibold mb-4">By payment method</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={byMethod.map((m) => ({ name: m.method, value: Number(m.total || 0) }))} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {byMethod.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => inr(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ExpensesReport({ data }) {
  if (!data) return null;
  const byCategory = data.byCategory || [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Kpi label="Total expenses" value={inr(data.total)} />
        <Kpi label="Categories" value={byCategory.length} />
      </div>
      <div className="card p-5">
        <h3 className="font-display text-lg font-semibold mb-4">Expenses by category</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={byCategory.map((c) => ({ category: c.category || 'Uncategorized', total: Number(c.total || 0) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => v >= 100000 ? `${(v/100000).toFixed(1)}L` : v >= 1000 ? `${v/1000}k` : v} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="total" fill="#f97316" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function EventsReport({ data }) {
  if (!data) return null;
  const byStatus = data.byStatus || [];
  const byType   = data.byType   || [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-display text-lg font-semibold mb-4">By status</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byStatus.map((s) => ({ name: s.status, value: s._count }))} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85}>
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-display text-lg font-semibold mb-4">By type</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={byType.map((t) => ({ type: t.eventType || 'Other', count: t._count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip /><Bar dataKey="count" fill="#22c55e" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadsReport({ data }) {
  if (!data) return null;
  const byStatus = data.byStatus || [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Kpi label="Conversion rate" value={`${(data.conversionRate || 0).toFixed(1)}%`} sub="Confirmed / total" />
        <Kpi label="Total leads" value={byStatus.reduce((a, b) => a + b._count, 0)} />
      </div>
      <div className="card p-5">
        <h3 className="font-display text-lg font-semibold mb-4">Funnel by status</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={byStatus.map((s) => ({ status: s.status, count: s._count }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
