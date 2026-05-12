'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Plus, Pencil, Trash2, Phone, Mail, ArrowRightCircle, Filter,
} from 'lucide-react';
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
import { leads as seedLeads } from '@/data/seed';

const STATUSES = ['NEW', 'CONTACTED', 'NEGOTIATION', 'CONFIRMED', 'LOST'];

export default function LeadsPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'EVENT_MANAGER']}>
      <LeadsContent />
    </DashboardLayout>
  );
}

function LeadsContent() {
  const leads = useDemoList(seedLeads);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [converting, setConverting] = useState(null);

  const columns = [
    {
      key: 'name', header: 'Lead',
      render: (r) => (
        <div>
          <div className="font-semibold text-ink-900">{r.name}</div>
          <div className="text-xs text-ink-500 flex items-center gap-2 mt-0.5 flex-wrap">
            {r.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span>}
            {r.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</span>}
          </div>
        </div>
      ),
    },
    { key: 'eventType', header: 'Event', render: (r) => r.eventType || '—' },
    { key: 'eventDate', header: 'Date', render: (r) => fmtDate(r.eventDate) },
    { key: 'estimatedBudget', header: 'Budget', render: (r) => inr(r.estimatedBudget) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'owner',  header: 'Owner',  render: (r) => r.owner?.name || '—' },
    {
      key: 'actions', header: '', className: 'text-right w-32',
      render: (r) => (
        <div className="flex justify-end gap-1">
          {!r.convertedEventId && r.status !== 'LOST' && (
            <button onClick={() => setConverting(r)} className="btn-ghost p-2" title="Convert to event">
              <ArrowRightCircle className="w-4 h-4 text-brand-600" />
            </button>
          )}
          <button onClick={() => setEditing(r)} className="btn-ghost p-2"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setConfirmDelete(r)} className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Leads CRM"
        subtitle="Pipeline of prospective clients and follow-ups"
        actions={<Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> Add lead</Button>}
      />

      <DataTable
        columns={columns}
        rows={leads.items}
        total={leads.total}
        page={leads.page}
        limit={leads.limit}
        loading={leads.loading}
        onPageChange={leads.setPage}
        searchValue={leads.search}
        onSearchChange={leads.setSearch}
        searchPlaceholder="Search by name, phone, email..."
        toolbar={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select
              value={leads.filters.status || ''}
              onChange={(e) => leads.setFilters({ ...leads.filters, status: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
            </select>
          </div>
        }
        emptyTitle="No leads yet"
        emptyDescription="Add your first lead to start tracking your pipeline."
      />

      {editing !== null && (
        <LeadForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            if (editing.id) leads.update(editing.id, data);
            else leads.create(data);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { leads.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Delete lead?"
        description={`This will permanently remove "${confirmDelete?.name}" from your pipeline.`}
      />

      <ConfirmDialog
        open={!!converting}
        onClose={() => setConverting(null)}
        onConfirm={() => {
          leads.update(converting.id, { status: 'CONFIRMED', convertedEventId: 'new_event' });
          toast.success('Converted to event (demo)');
          setConverting(null);
        }}
        title="Convert lead to event?"
        description={`Create a new event from "${converting?.name}" and mark this lead as Confirmed.`}
        confirmText="Convert"
      />
    </>
  );
}

function LeadForm({ initial, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial ? {
      ...initial,
      eventDate: initial.eventDate ? initial.eventDate.split('T')[0] : '',
    } : { status: 'NEW' },
  });

  return (
    <Modal
      open onClose={onClose}
      title={isEdit ? 'Edit lead' : 'New lead'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button form="lead-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save changes' : 'Create lead'}</Button>
        </>
      }
    >
      <form id="lead-form" onSubmit={handleSubmit((d) => onSubmit(stripEmpty(d)))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name *" error={errors.name?.message} {...register('name', { required: 'Required' })} />
        <Input label="Phone" {...register('phone')} />
        <Input label="Email" type="email" {...register('email')} />
        <Input label="Event type" placeholder="Wedding, Birthday, Corporate..." {...register('eventType')} />
        <Input label="Estimated budget (₹)" type="number" {...register('estimatedBudget')} />
        <Input label="Event date" type="date" {...register('eventDate')} />
        <Select label="Status" {...register('status')}>
          {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
        </Select>
        <Input label="Source" placeholder="Referral, Website, Walk-in..." {...register('source')} />
        <div className="sm:col-span-2">
          <Textarea label="Notes" rows={3} {...register('notes')} />
        </div>
      </form>
    </Modal>
  );
}

function stripEmpty(d) {
  return Object.fromEntries(Object.entries(d).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
}
