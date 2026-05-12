'use client';

import {
  Building2, Users as UsersIcon, Sparkles, AlertTriangle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/Feedback';
import { StatusBadge } from '@/components/ui/Badge';
import { fmtDate } from '@/lib/utils';
import { platformAnalytics } from '@/data/seed';

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <AnalyticsContent />
    </DashboardLayout>
  );
}

function AnalyticsContent() {
  const data = platformAnalytics;

  return (
    <>
      <PageHeader title="Platform Analytics" subtitle="Health of the EasyEventSoft business" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total companies"     value={data.totalCompanies}     icon={Building2}     tone="brand" />
        <StatCard label="Active"              value={data.activeCompanies}    icon={Sparkles}      tone="green" />
        <StatCard label="On trial"            value={data.trialCompanies}     icon={Sparkles}      tone="amber" />
        <StatCard label="Suspended"           value={data.suspendedCompanies} icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold mb-4">New companies by month</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data.companiesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-display text-lg font-semibold mb-2">Recent signups</h3>
          <ul className="space-y-3 mt-3">
            {data.recentSignups.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 grid place-items-center text-xs font-bold shrink-0">
                  {c.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-ink-900 truncate">{c.name}</div>
                  <div className="text-xs text-ink-500">{fmtDate(c.createdAt)}</div>
                  <div className="mt-1"><StatusBadge status={c.status} /></div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/admin/companies" className="block mt-4 text-sm link">View all companies →</Link>
        </div>
      </div>

      <div className="mt-6 card p-5">
        <h3 className="font-display text-lg font-semibold mb-2">Platform users</h3>
        <p className="text-sm text-ink-600">
          <span className="text-2xl font-display font-bold text-ink-900">{data.totalUsers}</span> users across all tenant companies (including super admins).
        </p>
      </div>
    </>
  );
}

function StatCard({ label, value, icon: Icon, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-600',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose:  'bg-rose-500',
  };
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-xl ${tones[tone]} text-white grid place-items-center shadow-sm mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-display font-bold text-ink-900">{value}</div>
      <div className="text-xs text-ink-500 font-medium uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
