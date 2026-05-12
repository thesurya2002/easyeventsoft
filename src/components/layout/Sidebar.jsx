'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Calendar, Briefcase, ListTodo, Receipt, FileText,
  Wallet, BarChart3, ScrollText, Building2, Settings, LogOut, Menu, X,
  Tags, ShieldCheck, CreditCard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn, ROLE_LABEL } from '@/lib/utils';

const NAV = [
  { href: '/dashboard',      label: 'Dashboard',      icon: LayoutDashboard, roles: ['COMPANY_ADMIN','EVENT_MANAGER','STAFF','ACCOUNTANT'] },
  { href: '/leads',          label: 'Leads (CRM)',    icon: Users,           roles: ['COMPANY_ADMIN','EVENT_MANAGER'] },
  { href: '/events',         label: 'Events',         icon: Calendar,        roles: ['COMPANY_ADMIN','EVENT_MANAGER','STAFF'] },
  { href: '/vendors',        label: 'Vendors',        icon: Briefcase,       roles: ['COMPANY_ADMIN','EVENT_MANAGER'] },
  { href: '/tasks',          label: 'Tasks',          icon: ListTodo,        roles: ['COMPANY_ADMIN','EVENT_MANAGER','STAFF'] },
  { href: '/payments',       label: 'Payments',       icon: Wallet,          roles: ['COMPANY_ADMIN','ACCOUNTANT'] },
  { href: '/expenses',       label: 'Expenses',       icon: Receipt,         roles: ['COMPANY_ADMIN','ACCOUNTANT'] },
  { href: '/invoices',       label: 'Invoices',       icon: FileText,        roles: ['COMPANY_ADMIN','ACCOUNTANT','EVENT_MANAGER'] },
  { href: '/categories',     label: 'Categories',     icon: Tags,            roles: ['COMPANY_ADMIN','EVENT_MANAGER'] },
  { href: '/reports',        label: 'Reports',        icon: BarChart3,       roles: ['COMPANY_ADMIN','ACCOUNTANT','EVENT_MANAGER'] },
  { href: '/staff',          label: 'Staff',          icon: ShieldCheck,     roles: ['COMPANY_ADMIN'] },
  { href: '/activity-logs',  label: 'Activity Logs',  icon: ScrollText,      roles: ['COMPANY_ADMIN'] },

  { href: '/admin/companies', label: 'Companies',     icon: Building2,       roles: ['SUPER_ADMIN'] },
  { href: '/admin/plans',     label: 'Plans',         icon: CreditCard,      roles: ['SUPER_ADMIN'] },
  { href: '/admin/analytics', label: 'Analytics',     icon: BarChart3,       roles: ['SUPER_ADMIN'] },
  { href: '/admin/logs',      label: 'Activity Logs', icon: ScrollText,      roles: ['SUPER_ADMIN'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;
  const items = NAV.filter((n) => n.roles.includes(user.role));

  return (
    <>
      <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-white border-b border-ink-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(true)} className="btn-ghost p-2 -ml-2" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <Brand />
        </div>
        <div className="text-xs text-ink-500 truncate max-w-[40%]">{user.company?.name || 'Platform'}</div>
      </div>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-ink-200 flex flex-col transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="px-5 py-5 flex items-center justify-between border-b border-ink-100">
          <Brand />
          <button onClick={() => setOpen(false)} className="lg:hidden btn-ghost p-1.5" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/40 border border-brand-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white grid place-items-center font-bold text-sm">
              {user.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-900 truncate">{user.name}</div>
              <div className="text-xs text-ink-600 truncate">{ROLE_LABEL[user.role]}</div>
            </div>
          </div>
          {user.company && (
            <div className="mt-3 pt-3 border-t border-brand-200/50 text-xs text-ink-600 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              <span className="truncate">{user.company.name}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-200'
                    : 'text-ink-700 hover:bg-ink-100 hover:text-ink-900'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.4 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-ink-100 space-y-0.5">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50">
            <LogOut className="w-4 h-4" /> Switch user
          </button>
        </div>
      </aside>

      {open && <div className="lg:hidden fixed inset-0 bg-ink-900/40 z-30" onClick={() => setOpen(false)} />}
    </>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 grid place-items-center text-white font-display font-bold text-base shadow-soft">
        E
      </div>
      <div className="leading-none">
        <div className="font-display font-bold text-ink-900 text-base tracking-tight">EasyEvent<span className="text-brand-600">Soft</span></div>
        <div className="text-[10px] uppercase tracking-widest text-ink-500 font-semibold mt-0.5">Event ERP</div>
      </div>
    </Link>
  );
}
