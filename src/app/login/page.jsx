'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ShieldCheck, Sparkles, CalendarCheck, ChartLine, ArrowRight,
  Crown, Briefcase, ClipboardList, Wallet,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { users } from '@/data/seed';
import { ROLE_LABEL } from '@/lib/utils';

const ROLE_META = {
  SUPER_ADMIN: {
    icon: Crown,
    color: 'from-amber-400 to-amber-600',
    blurb: 'Platform-wide view: companies, plans, analytics, cross-tenant audit log.',
    cta: 'Sign in as Super Admin',
    redirect: '/admin/companies',
  },
  COMPANY_ADMIN: {
    icon: ShieldCheck,
    color: 'from-brand-500 to-brand-700',
    blurb: 'Full tenant access: everything inside the company workspace.',
    cta: 'Sign in as Company Admin',
    redirect: '/dashboard',
  },
  EVENT_MANAGER: {
    icon: CalendarCheck,
    color: 'from-sky-500 to-sky-700',
    blurb: 'Leads, events, vendors, tasks, invoices, reports.',
    cta: 'Sign in as Event Manager',
    redirect: '/dashboard',
  },
  STAFF: {
    icon: ClipboardList,
    color: 'from-slate-500 to-slate-700',
    blurb: 'See only the events and tasks assigned to you.',
    cta: 'Sign in as Staff',
    redirect: '/tasks',
  },
  ACCOUNTANT: {
    icon: Wallet,
    color: 'from-violet-500 to-violet-700',
    blurb: 'Finance focus: payments, expenses, invoices, reports.',
    cta: 'Sign in as Accountant',
    redirect: '/payments',
  },
};

export default function LoginPage() {
  const { loginAs } = useAuth();
  const router = useRouter();

  const handle = (userId) => {
    const u = loginAs(userId);
    if (!u) return toast.error('Could not sign in');
    toast.success(`Welcome, ${u.name.split(' ')[0]}!`);
    router.replace(ROLE_META[u.role].redirect);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      {/* Marketing pane */}
      <aside className="hidden lg:flex lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white p-12 flex-col">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-brand-400/20 blur-3xl" />

        <div className="relative flex items-center gap-2.5 w-fit">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur grid place-items-center font-display font-bold text-lg border border-white/15">E</div>
          <div className="font-display font-bold text-xl">EasyEvent<span className="text-accent-400">Soft</span></div>
        </div>

        <div className="relative mt-auto mb-auto pt-12">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-200/80 font-semibold mb-4">Live Demo</p>
          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
            Five roles.<br/>One <em className="not-italic text-accent-300">workspace</em>.
          </h1>
          <p className="mt-5 text-brand-100/80 max-w-md leading-relaxed">
            Pick any persona on the right and explore the full ERP/CRM — every screen tailored to that role's access level.
          </p>

          <ul className="mt-10 space-y-4 max-w-md">
            {[
              [Sparkles,       'Multi-tenant by design',  'Each company gets an isolated workspace'],
              [CalendarCheck,  'Plan to billing in one place', 'Events, tasks, payments, invoices'],
              [ChartLine,      'Insights that matter',    'Revenue, expenses, conversion — live'],
              [ShieldCheck,    'Full audit log',          'Every change is captured and searchable'],
            ].map(([Icon, t, d], i) => (
              <li key={i} className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 grid place-items-center shrink-0 border border-white/10">
                  <Icon className="w-4 h-4 text-accent-300" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t}</div>
                  <div className="text-xs text-brand-100/70">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-brand-200/70">
          © {new Date().getFullYear()} EasyEventSoft · Static demo
        </div>
      </aside>

      {/* Picker pane */}
      <section className="flex flex-col lg:col-span-3 justify-center px-6 sm:px-10 py-12 bg-grid">
        <div className="w-full max-w-3xl mx-auto">
          {/* mobile brand */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white grid place-items-center font-display font-bold">E</div>
            <span className="font-display font-bold text-lg">EasyEvent<span className="text-brand-600">Soft</span></span>
          </Link>

          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-bold">Demo Sign In</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 mt-2 tracking-tight">Choose a role to explore</h2>
          <p className="mt-2 text-sm text-ink-600 max-w-2xl">
            No password needed — this is a static demo. Each persona below shows a different slice of the same workspace, governed by role-based access control.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
            {users.map((u) => {
              const meta = ROLE_META[u.role];
              const Icon = meta.icon;
              return (
                <button
                  key={u.id}
                  onClick={() => handle(u.id)}
                  className="group text-left p-5 card hover:border-brand-300 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${meta.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                  <div className="flex items-center gap-3 relative">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} text-white grid place-items-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-ink-900 truncate">{u.name}</div>
                      <div className="text-xs text-ink-500 truncate">{u.email}</div>
                    </div>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded">
                    {ROLE_LABEL[u.role]}
                  </div>

                  <p className="mt-3 text-xs text-ink-600 leading-relaxed min-h-[2.5rem]">{meta.blurb}</p>

                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
                    Sign in <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-ink-100/70 border border-ink-200 text-xs text-ink-700">
            <strong className="font-semibold text-ink-900">About this demo:</strong> all data is hardcoded and lives in your browser. Create, edit, and delete actions appear to work but only update an in-memory copy — refresh the page and changes are gone. Built with Next.js + Tailwind.
          </div>
        </div>
      </section>
    </div>
  );
}
