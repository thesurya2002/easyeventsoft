'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Calendar, MapPin, Users as UsersIcon, Filter } from 'lucide-react';
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
import { events as seedEvents } from '@/data/seed';

const STATUSES = ['PLANNING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

export default function EventsPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'EVENT_MANAGER', 'STAFF']}>
      <EventsContent />
    </DashboardLayout>
  );
}

function EventsContent() {
  const { user } = useAuth();
  const events = useDemoList(seedEvents);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const canManage = user.role === 'COMPANY_ADMIN' || user.role === 'EVENT_MANAGER';

  const columns = [
    {
      key: 'name', header: 'Event',
      render: (r) => (
        <div>
          <Link href={`/events/${r.id}`} className="font-semibold text-ink-900 hover:text-brand-600">{r.name}</Link>
          <div className="text-xs text-ink-500 mt-0.5">{r.clientName} {r.eventType ? `• ${r.eventType}` : ''}</div>
        </div>
      ),
    },
    { key: 'startDate', header: 'When',  render: (r) => <span className="inline-flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5 text-ink-400" />{fmtDate(r.startDate)}</span> },
    { key: 'venue',     header: 'Venue', render: (r) => <span className="inline-flex items-center gap-1.5 text-sm text-ink-700"><MapPin className="w-3.5 h-3.5 text-ink-400" />{r.venue || '—'}</span> },
    { key: 'guestCount',header: 'Guests',render: (r) => r.guestCount ? <span className="inline-flex items-center gap-1 text-sm"><UsersIcon className="w-3.5 h-3.5 text-ink-400" />{r.guestCount}</span> : '—' },
    { key: 'budget',    header: 'Budget',render: (r) => inr(r.budget) },
    { key: 'status',    header: 'Status',render: (r) => <StatusBadge status={r.status} /> },
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
        title="Events"
        subtitle="Plan, run, and close every event"
        actions={canManage && <Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> New event</Button>}
      />

      <DataTable
        columns={columns}
        rows={events.items}
        total={events.total}
        page={events.page}
        limit={events.limit}
        onPageChange={events.setPage}
        searchValue={events.search}
        onSearchChange={events.setSearch}
        searchPlaceholder="Search by event, client, venue..."
        toolbar={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select
              value={events.filters.status || ''}
              onChange={(e) => events.setFilters({ ...events.filters, status: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
            </select>
          </div>
        }
      />

      {editing !== null && (
        <EventForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            if (editing.id) events.update(editing.id, data);
            else events.create(data);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { events.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Delete event?"
        description={`This will remove "${confirmDelete?.name}".`}
      />
    </>
  );
}

function EventForm({ initial, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial ? {
      ...initial,
      startDate: initial.startDate?.split('T')[0] || '',
      endDate:   initial.endDate?.split('T')[0]   || '',
    } : { status: 'PLANNING', startDate: new Date().toISOString().split('T')[0] },
  });

  return (
    <Modal
      open onClose={onClose}
      title={isEdit ? 'Edit event' : 'New event'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button form="event-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save' : 'Create'}</Button>
        </>
      }
    >
      <form id="event-form" onSubmit={handleSubmit((d) => onSubmit(stripEmpty(d)))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Event name *"  error={errors.name?.message}        {...register('name',       { required: 'Required' })} />
        <Input label="Client name *" error={errors.clientName?.message}  {...register('clientName', { required: 'Required' })} />
        <Input label="Client phone"  {...register('clientPhone')} />
        <Input label="Client email"  type="email" {...register('clientEmail')} />
        <Input label="Event type"    placeholder="Wedding, Corporate..." {...register('eventType')} />
        <Input label="Venue"         {...register('venue')} />
        <div className="sm:col-span-2"><Input label="Venue address" {...register('venueAddress')} /></div>
        <Input label="Start date *"  type="date" error={errors.startDate?.message} {...register('startDate', { required: 'Required' })} />
        <Input label="End date"      type="date" {...register('endDate')} />
        <Input label="Guest count"   type="number" {...register('guestCount')} />
        <Input label="Budget (₹)"    type="number" {...register('budget')} />
        <Select label="Status" {...register('status')}>
          {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
        </Select>
        <div />
        <div className="sm:col-span-2"><Textarea label="Description" rows={3} {...register('description')} /></div>
      </form>
    </Modal>
  );
}

function stripEmpty(d) {
  return Object.fromEntries(Object.entries(d).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
}
