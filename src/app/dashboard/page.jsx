'use client';

import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Wallet, IndianRupee, AlertCircle, ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/Feedback';
import { StatusBadge } from '@/components/ui/Badge';
import { inr, fmtDate, fmtRelative } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { dashboardSummary } from '@/data/seed';

const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#06b6d4', '#ef4444'];

export default function DashboardPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'EVENT_MANAGER', 'STAFF', 'ACCOUNTANT']}>
      <DashboardContent />
    </DashboardLayout>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const data = dashboardSummary;

  const months = lastNMonths(6);
  const revenueChart = months.map((m) => ({
    month: m.label,
    revenue: data.revenueByMonth.find((r) => r.month === m.key)?.total || 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${user.name.split(' ')[0]}`}
        subtitle={fmtDate(new Date(), 'EEEE, dd MMMM yyyy')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Revenue (YTD)"     value={inr(data.revenueYTD)}  icon={IndianRupee} tone="brand" trend="+12.4%" />
        <KpiCard label="Expenses (YTD)"    value={inr(data.expensesYTD)} icon={Wallet}      tone="amber" />
        <KpiCard label="Profit (YTD)"      value={inr(data.profitYTD)}   icon={data.profitYTD >= 0 ? TrendingUp : TrendingDown} tone={data.profitYTD >= 0 ? 'green' : 'rose'} />
        <KpiCard label="Pending payments"  value={data.pendingPayments.length} icon={AlertCircle} tone="sky" suffix="open" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink-900">Revenue trend</h3>
              <p className="text-xs text-ink-500">Last 6 months</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={revenueChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false}
                       tickFormatter={(v) => v >= 100000 ? `${(v/100000).toFixed(1)}L` : v >= 1000 ? `${v/1000}k` : v} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} formatter={(v) => inr(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-display text-lg font-semibold text-ink-900">Lead funnel</h3>
          <p className="text-xs text-ink-500 mb-4">Last 30 days</p>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.leadFunnel.map((l) => ({ name: l.status, value: l._count }))}
                  dataKey="value" nameKey="name"
                  innerRadius={45} outerRadius={75} paddingAngle={2}
                >
                  {data.leadFunnel.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <SectionHead title="Upcoming events" href="/events" />
          <ul className="space-y-3 mt-3">
            {data.upcomingEvents.map((e) => (
              <li key={e.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-ink-50 transition-colors">
                <DateBadge date={e.startDate} />
                <div className="min-w-0 flex-1">
                  <Link href={`/events/${e.id}`} className="font-semibold text-sm text-ink-900 hover:text-brand-600 truncate block">
                    {e.name}
                  </Link>
                  <div className="text-xs text-ink-500 truncate">{e.clientName} • {e.venue || '—'}</div>
                  <div className="mt-1.5"><StatusBadge status={e.status} /></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <SectionHead title="Pending payments" href="/payments" />
          {data.pendingPayments.length === 0 ? (
            <p className="text-sm text-ink-500 py-6 text-center">All caught up.</p>
          ) : (
            <ul className="space-y-3 mt-3">
              {data.pendingPayments.map((p) => (
                <li key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-ink-50">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-900 truncate">{p.event?.name || p.vendor?.name || 'Payment'}</div>
                    <div className="text-xs text-ink-500">{p.direction === 'INCOMING' ? 'From client' : 'To vendor'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ink-900">{inr(p.amount)}</div>
                    <StatusBadge status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <SectionHead title="Recent activity" href="/activity-logs" />
          <ul className="space-y-3 mt-3">
            {data.recentActivities.map((a) => (
              <li key={a.id} className="flex gap-3 p-2.5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-xs font-bold shrink-0">
                  {(a.user?.name || '?').split(' ').map((p) => p[0]).slice(0,2).join('')}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-ink-800 line-clamp-2">{a.description || `${a.action} ${a.entity}`}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{fmtRelative(a.createdAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, tone = 'brand', trend, suffix }) {
  const tones = {
    brand: 'bg-brand-600 text-white',
    green: 'bg-emerald-500 text-white',
    amber: 'bg-amber-500 text-white',
    rose:  'bg-rose-500 text-white',
    sky:   'bg-sky-500 text-white',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${tones[tone]} grid place-items-center shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-display font-bold text-ink-900 tracking-tight">
          {value}{suffix && <span className="text-sm text-ink-500 font-sans font-medium ml-1.5">{suffix}</span>}
        </div>
        <div className="text-xs text-ink-500 font-medium uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  );
}

function SectionHead({ title, href }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
      {href && <Link href={href} className="text-xs link inline-flex items-center gap-0.5">View all <ArrowUpRight className="w-3 h-3" /></Link>}
    </div>
  );
}

function DateBadge({ date }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 grid place-items-center shrink-0 leading-none">
      <div className="text-[10px] font-bold uppercase text-brand-700 tracking-wider">{fmtDate(date, 'MMM')}</div>
      <div className="text-base font-display font-bold text-brand-900 mt-0.5">{fmtDate(date, 'dd')}</div>
    </div>
  );
}

function lastNMonths(n) {
  const now = new Date();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
    });
  }
  return out;
}
