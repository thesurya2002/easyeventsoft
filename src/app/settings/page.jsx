'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/Feedback';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABEL, fmtDate } from '@/lib/utils';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  );
}

function SettingsContent() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <>
      <PageHeader title="Settings" subtitle="Your profile and workspace details" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold mb-4">Your profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center text-xl font-bold">
              {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-display font-bold text-ink-900">{user.name}</div>
              <div className="text-sm text-ink-500">{user.email}</div>
              <div className="mt-1.5"><Badge color="brand" dot>{ROLE_LABEL[user.role]}</Badge></div>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Field label="Phone" value={user.phone || '—'} />
            <Field label="Last sign-in" value={fmtDate(user.lastLoginAt, 'dd MMM yyyy, HH:mm')} />
            <Field label="User ID" value={user.id} mono />
            <Field label="Role" value={ROLE_LABEL[user.role]} />
          </dl>

          <div className="mt-6 pt-6 border-t border-ink-100">
            <p className="text-sm text-ink-500 mb-3">In the demo, profile edits, password changes, and 2FA toggles are simulated only.</p>
            <button onClick={logout} className="btn-secondary">Switch to a different demo persona</button>
          </div>
        </div>

        {user.company && (
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Workspace</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-ink-500 uppercase tracking-wider font-semibold">Company</div>
                <div className="font-semibold text-ink-900 mt-0.5">{user.company.name}</div>
              </div>
              <Field label="Email"  value={user.company.email} />
              <Field label="Phone"  value={user.company.phone} />
              <Field label="City"   value={`${user.company.city}, ${user.company.state}`} />
              <Field label="GSTIN"  value={user.company.gstin || '—'} mono />
              <Field label="Status" value={<Badge color="green" dot>{user.company.status}</Badge>} />
              <Field label="Since"  value={fmtDate(user.company.createdAt)} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 card p-6">
        <h3 className="font-display text-lg font-semibold mb-2">About this demo</h3>
        <p className="text-sm text-ink-600 leading-relaxed">
          You're using a fully static build of EasyEventSoft. There's no backend — all data
          is hardcoded into the bundle and changes you make stay only in your browser tab
          until you refresh. To deploy your own copy, fork the repository on GitHub and
          enable Pages.
        </p>
      </div>
    </>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <div className="text-xs text-ink-500 uppercase tracking-wider font-semibold">{label}</div>
      <div className={`mt-0.5 ${mono ? 'font-mono text-xs' : ''}`}>{value}</div>
    </div>
  );
}
