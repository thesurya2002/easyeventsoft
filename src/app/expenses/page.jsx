'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import useDemoList from '@/hooks/useDemoList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/Feedback';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { inr, fmtDate } from '@/lib/utils';
import { expenses as seedExpenses, events } from '@/data/seed';

const CATEGORIES = ['Venue', 'Decoration', 'AV', 'Travel', 'Marketing', 'Office', 'Other'];

export default function ExpensesPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'ACCOUNTANT']}>
      <ExpensesContent />
    </DashboardLayout>
  );
}

function ExpensesContent() {
  const expenses = useDemoList(seedExpenses);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const columns = [
    {
      key: 'title', header: 'Expense',
      render: (r) => (
        <div>
          <div className="font-semibold text-ink-900">{r.title}</div>
          {r.event && <div className="text-xs text-ink-500 mt-0.5">For: {r.event.name}</div>}
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (r) => r.category ? <Badge color="brand">{r.category}</Badge> : '—' },
    { key: 'amount',   header: 'Amount',   render: (r) => <span className="font-semibold">{inr(r.amount)}</span> },
    { key: 'spentAt',  header: 'Date',     render: (r) => fmtDate(r.spentAt) },
    {
      key: 'actions', header: '', className: 'text-right w-24',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => setEditing(r)} className="btn-ghost p-2"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setConfirmDelete(r)} className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="Track event and office spending"
        actions={<Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> Add expense</Button>}
      />

      <DataTable
        columns={columns}
        rows={expenses.items}
        total={expenses.total}
        page={expenses.page}
        limit={expenses.limit}
        onPageChange={expenses.setPage}
        searchValue={expenses.search}
        onSearchChange={expenses.setSearch}
        searchPlaceholder="Search expenses..."
        toolbar={
          <select
            value={expenses.filters.category || ''}
            onChange={(e) => expenses.setFilters({ ...expenses.filters, category: e.target.value || undefined })}
            className="input py-2 text-sm"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        }
      />

      {editing !== null && (
        <ExpenseForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            if (editing.id) expenses.update(editing.id, data);
            else expenses.create(data);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { expenses.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Delete expense?"
        description={`"${confirmDelete?.title}" will be permanently removed.`}
      />
    </>
  );
}

function ExpenseForm({ initial, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial ? {
      ...initial,
      spentAt: initial.spentAt ? initial.spentAt.split('T')[0] : '',
    } : { spentAt: new Date().toISOString().split('T')[0] },
  });

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit expense' : 'Add expense'} footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="exp-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save' : 'Create'}</Button>
      </>
    }>
      <form id="exp-form" onSubmit={handleSubmit((d) => onSubmit(stripEmpty(d)))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><Input label="Title *" error={errors.title?.message} {...register('title', { required: 'Required' })} /></div>
        <Input label="Amount (₹) *" type="number" error={errors.amount?.message} {...register('amount', { required: 'Required' })} />
        <Select label="Category" {...register('category')}>
          <option value="">—</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Input label="Date" type="date" {...register('spentAt')} />
        <Select label="Linked event" {...register('eventId')}>
          <option value="">—</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </Select>
        <div className="sm:col-span-2"><Textarea label="Notes" rows={2} {...register('notes')} /></div>
      </form>
    </Modal>
  );
}

function stripEmpty(d) {
  return Object.fromEntries(Object.entries(d).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
}
