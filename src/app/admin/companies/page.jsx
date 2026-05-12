'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Filter, Users as UsersIcon, MapPin } from 'lucide-react';
import useDemoList from '@/hooks/useDemoList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/Feedback';
import { StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { fmtDate } from '@/lib/utils';
import { companies as seedCompanies, plans } from '@/data/seed';

const STATUSES = ['ACTIVE', 'TRIAL', 'SUSPENDED'];

export default function AdminCompaniesPage() {
  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <CompaniesContent />
    </DashboardLayout>
  );
}

function CompaniesContent() {
  const cos = useDemoList(seedCompanies);
  const [assigning, setAssigning] = useState(null);

  const columns = [
    {
      key: 'name', header: 'Company',
      render: (r) => (
        <div>
          <div className="font-semibold text-ink-900">{r.name}</div>
          <div className="text-xs text-ink-500 mt-0.5 flex items-center gap-2 flex-wrap">
            <span>{r.email}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.city}, {r.state}</span>
          </div>
        </div>
      ),
    },
    { key: 'plan',   header: 'Plan',   render: (r) => r.subscriptionPlan?.name || <span className="text-rose-600 text-xs">No plan</span> },
    { key: 'users',  header: 'Users',  render: (r) => <span className="inline-flex items-center gap-1"><UsersIcon className="w-3.5 h-3.5 text-ink-400" /> {r._count?.users || 0}</span> },
    { key: 'billing',header: 'Billing',render: (r) => <span className="text-sm capitalize">{r.billingCycle?.toLowerCase() || '—'}</span> },
    { key: 'expires',header: 'Expires',render: (r) => fmtDate(r.subscriptionEnd) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions', header: '', className: 'text-right w-24',
      render: (r) => (
        <Button variant="ghost" onClick={() => setAssigning(r)} className="text-xs">
          <Pencil className="w-3.5 h-3.5" /> Assign plan
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Companies" subtitle="All tenants on the platform" />

      <DataTable
        columns={columns}
        rows={cos.items}
        total={cos.total}
        page={cos.page}
        limit={cos.limit}
        onPageChange={cos.setPage}
        searchValue={cos.search}
        onSearchChange={cos.setSearch}
        searchPlaceholder="Search by name or email..."
        toolbar={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select
              value={cos.filters.status || ''}
              onChange={(e) => cos.setFilters({ ...cos.filters, status: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
            </select>
          </div>
        }
      />

      {assigning && (
        <AssignPlanModal
          company={assigning}
          onClose={() => setAssigning(null)}
          onSubmit={(data) => {
            const plan = plans.find((p) => p.id === data.subscriptionPlanId);
            cos.update(assigning.id, { subscriptionPlanId: data.subscriptionPlanId, subscriptionPlan: plan, status: data.status, billingCycle: data.billingCycle });
            setAssigning(null);
          }}
        />
      )}
    </>
  );
}

function AssignPlanModal({ company, onClose, onSubmit }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      subscriptionPlanId: company.subscriptionPlanId || plans[0].id,
      status: company.status,
      billingCycle: company.billingCycle,
    },
  });

  return (
    <Modal open onClose={onClose} title={`Manage "${company.name}"`} size="sm" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="plan-form" type="submit" loading={isSubmitting}>Save</Button>
      </>
    }>
      <form id="plan-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Select label="Subscription plan" {...register('subscriptionPlanId')}>
          {plans.map((p) => <option key={p.id} value={p.id}>{p.name} — ₹{p.priceMonthly}/mo</option>)}
        </Select>
        <Select label="Status" {...register('status')}>
          {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
        </Select>
        <Select label="Billing cycle" {...register('billingCycle')}>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </Select>
      </form>
    </Modal>
  );
}
