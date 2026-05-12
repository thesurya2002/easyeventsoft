'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Mail, Phone } from 'lucide-react';
import useDemoList from '@/hooks/useDemoList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/Feedback';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { fmtRelative, ROLE_LABEL } from '@/lib/utils';
import { users, company } from '@/data/seed';

const ROLES = ['COMPANY_ADMIN', 'EVENT_MANAGER', 'STAFF', 'ACCOUNTANT'];

const ROLE_TONE = {
  COMPANY_ADMIN: 'brand',
  EVENT_MANAGER: 'sky',
  STAFF:         'slate',
  ACCOUNTANT:    'violet',
};

export default function StaffPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN']}>
      <StaffContent />
    </DashboardLayout>
  );
}

function StaffContent() {
  // only show users from this company
  const companyUsers = users.filter((u) => u.companyId === company.id);
  const staff = useDemoList(companyUsers);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const columns = [
    {
      key: 'name', header: 'Member',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 grid place-items-center text-xs font-bold">
            {r.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-ink-900 truncate">{r.name}</div>
            <div className="text-xs text-ink-500 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {r.email}</span>
              {r.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {r.phone}</span>}
            </div>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (r) => <Badge color={ROLE_TONE[r.role]} dot>{ROLE_LABEL[r.role]}</Badge> },
    { key: 'lastLoginAt', header: 'Last sign-in', render: (r) => fmtRelative(r.lastLoginAt) },
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
        title="Staff"
        subtitle="Manage your team and their access levels"
        actions={<Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> Invite member</Button>}
      />

      <DataTable
        columns={columns}
        rows={staff.items}
        total={staff.total}
        page={staff.page}
        limit={staff.limit}
        onPageChange={staff.setPage}
        searchValue={staff.search}
        onSearchChange={staff.setSearch}
        searchPlaceholder="Search team..."
      />

      {editing !== null && (
        <StaffForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            if (editing.id) staff.update(editing.id, data);
            else staff.create(data);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { staff.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Remove team member?"
        description={`${confirmDelete?.name} will lose access to this workspace.`}
        confirmText="Remove"
      />
    </>
  );
}

function StaffForm({ initial, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial || { role: 'STAFF' },
  });

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit team member' : 'Invite member'} footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="staff-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save' : 'Invite'}</Button>
      </>
    }>
      <form id="staff-form" onSubmit={handleSubmit((d) => onSubmit(stripEmpty(d)))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><Input label="Name *" error={errors.name?.message} {...register('name', { required: 'Required' })} /></div>
        <div className="sm:col-span-2"><Input label="Email *" type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} /></div>
        <Input label="Phone" {...register('phone')} />
        <Select label="Role" {...register('role')}>
          {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </Select>
      </form>
    </Modal>
  );
}

function stripEmpty(d) {
  return Object.fromEntries(Object.entries(d).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
}
