'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import useDemoList from '@/hooks/useDemoList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/Feedback';
import { StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { fmtDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { tasks as seedTasks, users, events } from '@/data/seed';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function TasksPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'EVENT_MANAGER', 'STAFF']}>
      <TasksContent />
    </DashboardLayout>
  );
}

function TasksContent() {
  const { user } = useAuth();
  // STAFF only sees own tasks
  const baseTasks = user.role === 'STAFF'
    ? seedTasks.filter((t) => t.assignee?.id === user.id)
    : seedTasks;
  const tasks = useDemoList(baseTasks);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const canCreate = user.role !== 'STAFF';

  const columns = [
    {
      key: 'title', header: 'Task',
      render: (r) => (
        <div>
          <div className="font-semibold text-ink-900">{r.title}</div>
          {r.event && <div className="text-xs text-ink-500 mt-0.5">For: {r.event.name}</div>}
        </div>
      ),
    },
    { key: 'assignee', header: 'Assignee', render: (r) => r.assignee?.name || '—' },
    { key: 'dueDate',  header: 'Due',      render: (r) => fmtDate(r.dueDate) },
    { key: 'priority', header: 'Priority', render: (r) => <StatusBadge status={r.priority} /> },
    {
      key: 'status', header: 'Status',
      render: (r) => (
        <select
          value={r.status}
          onChange={(e) => tasks.update(r.id, { status: e.target.value })}
          className="text-xs px-2 py-1 rounded-lg border border-ink-200 bg-white font-semibold cursor-pointer hover:border-brand-400"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ').toLowerCase()}</option>)}
        </select>
      ),
    },
    {
      key: 'actions', header: '', className: 'text-right w-24',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => setEditing(r)} className="btn-ghost p-2"><Pencil className="w-4 h-4" /></button>
          {canCreate && (
            <button onClick={() => setConfirmDelete(r)} className="btn-ghost p-2 text-rose-600 hover:bg-rose-50">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle={user.role === 'STAFF' ? 'Tasks assigned to you' : 'Coordinate work across the team'}
        actions={canCreate && <Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> New task</Button>}
      />

      <DataTable
        columns={columns}
        rows={tasks.items}
        total={tasks.total}
        page={tasks.page}
        limit={tasks.limit}
        onPageChange={tasks.setPage}
        searchValue={tasks.search}
        onSearchChange={tasks.setSearch}
        searchPlaceholder="Search tasks..."
        toolbar={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select
              value={tasks.filters.status || ''}
              onChange={(e) => tasks.setFilters({ ...tasks.filters, status: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ').toLowerCase()}</option>)}
            </select>
            <select
              value={tasks.filters.priority || ''}
              onChange={(e) => tasks.setFilters({ ...tasks.filters, priority: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">Any priority</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p.toLowerCase()}</option>)}
            </select>
          </div>
        }
      />

      {editing !== null && (
        <TaskForm
          initial={editing.id ? editing : null}
          canChangeAssignee={canCreate}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            if (editing.id) tasks.update(editing.id, data);
            else tasks.create(data);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { tasks.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Delete task?"
        description={`"${confirmDelete?.title}" will be removed.`}
      />
    </>
  );
}

function TaskForm({ initial, canChangeAssignee, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial ? {
      ...initial,
      dueDate: initial.dueDate?.split('T')[0] || '',
    } : { status: 'TODO', priority: 'MEDIUM' },
  });

  const companyUsers = users.filter((u) => u.companyId);

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit task' : 'New task'} footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="task-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save' : 'Create'}</Button>
      </>
    }>
      <form id="task-form" onSubmit={handleSubmit((d) => onSubmit(stripEmpty(d)))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><Input label="Title *" error={errors.title?.message} {...register('title', { required: 'Required' })} /></div>
        <div className="sm:col-span-2"><Textarea label="Description" rows={3} {...register('description')} /></div>
        <Select label="Status" {...register('status')}>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ').toLowerCase()}</option>)}
        </Select>
        <Select label="Priority" {...register('priority')}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p.toLowerCase()}</option>)}
        </Select>
        <Input label="Due date" type="date" {...register('dueDate')} />
        <Select label="Event" {...register('eventId')}>
          <option value="">—</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </Select>
        {canChangeAssignee && (
          <div className="sm:col-span-2">
            <Select label="Assignee" {...register('assigneeId')}>
              <option value="">—</option>
              {companyUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </Select>
          </div>
        )}
      </form>
    </Modal>
  );
}

function stripEmpty(d) {
  return Object.fromEntries(Object.entries(d).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
}
