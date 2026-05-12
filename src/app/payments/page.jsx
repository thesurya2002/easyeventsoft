'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Filter, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import useDemoList from '@/hooks/useDemoList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/Feedback';
import { StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { inr, fmtDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { payments as seedPayments, events, vendors } from '@/data/seed';

const STATUSES = ['PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED'];
const METHODS  = ['CASH', 'BANK_TRANSFER', 'UPI', 'CARD', 'CHEQUE', 'OTHER'];

export default function PaymentsPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'ACCOUNTANT']}>
      <PaymentsContent />
    </DashboardLayout>
  );
}

function PaymentsContent() {
  const { user } = useAuth();
  const payments = useDemoList(seedPayments);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const canManage = user.role === 'COMPANY_ADMIN' || user.role === 'ACCOUNTANT';

  const columns = [
    {
      key: 'direction', header: 'Type',
      render: (r) => r.direction === 'INCOMING'
        ? <span className="inline-flex items-center gap-1.5 text-emerald-700 text-sm font-semibold"><ArrowDownCircle className="w-4 h-4" /> Received</span>
        : <span className="inline-flex items-center gap-1.5 text-rose-700 text-sm font-semibold"><ArrowUpCircle className="w-4 h-4" /> Paid out</span>,
    },
    { key: 'amount',  header: 'Amount',  render: (r) => <span className="font-semibold text-ink-900">{inr(r.amount)}</span> },
    { key: 'related', header: 'Related', render: (r) => r.event?.name || r.vendor?.name || '—' },
    { key: 'method',  header: 'Method',  render: (r) => <span className="text-sm">{r.method.replace('_', ' ').toLowerCase()}</span> },
    { key: 'paidAt',  header: 'Date',    render: (r) => fmtDate(r.paidAt) },
    { key: 'status',  header: 'Status',  render: (r) => <StatusBadge status={r.status} /> },
    ...(canManage ? [{
      key: 'actions', header: '', className: 'text-right w-24',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => setEditing(r)} className="btn-ghost p-2"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setConfirmDelete(r)} className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    }] : []),
  ];

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Client payments and vendor payouts"
        actions={canManage && <Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> Record payment</Button>}
      />

      <DataTable
        columns={columns}
        rows={payments.items}
        total={payments.total}
        page={payments.page}
        limit={payments.limit}
        onPageChange={payments.setPage}
        searchValue={payments.search}
        onSearchChange={payments.setSearch}
        searchPlaceholder="Search by reference..."
        toolbar={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select
              value={payments.filters.direction || ''}
              onChange={(e) => payments.setFilters({ ...payments.filters, direction: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">All types</option>
              <option value="INCOMING">Received</option>
              <option value="OUTGOING">Paid out</option>
            </select>
            <select
              value={payments.filters.status || ''}
              onChange={(e) => payments.setFilters({ ...payments.filters, status: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
            </select>
          </div>
        }
      />

      {editing !== null && (
        <PaymentForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            if (editing.id) payments.update(editing.id, data);
            else payments.create(data);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { payments.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Delete payment?"
        description="This payment will be removed."
      />
    </>
  );
}

function PaymentForm({ initial, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial ? {
      ...initial,
      paidAt: initial.paidAt ? initial.paidAt.split('T')[0] : '',
    } : { direction: 'INCOMING', status: 'PAID', method: 'BANK_TRANSFER', paidAt: new Date().toISOString().split('T')[0] },
  });
  const direction = watch('direction');

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit payment' : 'Record payment'} footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="payment-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save' : 'Record'}</Button>
      </>
    }>
      <form id="payment-form" onSubmit={handleSubmit((d) => onSubmit(stripEmpty(d)))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Direction *" {...register('direction')}>
          <option value="INCOMING">Incoming (from client)</option>
          <option value="OUTGOING">Outgoing (to vendor)</option>
        </Select>
        <Input label="Amount (₹) *" type="number" error={errors.amount?.message} {...register('amount', { required: 'Required' })} />
        <Select label="Method" {...register('method')}>
          {METHODS.map((m) => <option key={m} value={m}>{m.replace('_', ' ').toLowerCase()}</option>)}
        </Select>
        <Select label="Status" {...register('status')}>
          {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
        </Select>
        <Input label="Reference / TXN" {...register('reference')} />
        <Input label="Date" type="date" {...register('paidAt')} />
        <Select label="Event" {...register('eventId')}>
          <option value="">—</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </Select>
        {direction === 'OUTGOING' && (
          <Select label="Vendor" {...register('vendorId')}>
            <option value="">—</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </Select>
        )}
        <div className="sm:col-span-2"><Textarea label="Notes" rows={2} {...register('notes')} /></div>
      </form>
    </Modal>
  );
}

function stripEmpty(d) {
  return Object.fromEntries(Object.entries(d).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
}
