'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Star, Phone, Mail } from 'lucide-react';
import useDemoList from '@/hooks/useDemoList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/Feedback';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { inr } from '@/lib/utils';
import { vendors as seedVendors, categories } from '@/data/seed';

export default function VendorsPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'EVENT_MANAGER']}>
      <VendorsContent />
    </DashboardLayout>
  );
}

function VendorsContent() {
  const vendors = useDemoList(seedVendors);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const columns = [
    {
      key: 'name', header: 'Vendor',
      render: (r) => (
        <div>
          <div className="font-semibold text-ink-900">{r.name}</div>
          <div className="text-xs text-ink-500 flex items-center gap-3 mt-0.5 flex-wrap">
            {r.contactPerson && <span>{r.contactPerson}</span>}
            {r.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span>}
            {r.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</span>}
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (r) => r.category ? <Badge color="brand">{r.category.name}{r.subcategory ? ` • ${r.subcategory.name}` : ''}</Badge> : '—' },
    { key: 'basePrice', header: 'Base price', render: (r) => inr(r.basePrice) },
    {
      key: 'rating', header: 'Rating',
      render: (r) => r.rating ? (
        <span className="inline-flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}`} />
          ))}
        </span>
      ) : '—',
    },
    { key: 'active', header: '', render: (r) => r.active ? <Badge color="green" dot>active</Badge> : <Badge color="slate">inactive</Badge> },
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
        title="Vendors"
        subtitle="Your partner network across categories"
        actions={<Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> Add vendor</Button>}
      />

      <DataTable
        columns={columns}
        rows={vendors.items}
        total={vendors.total}
        page={vendors.page}
        limit={vendors.limit}
        onPageChange={vendors.setPage}
        searchValue={vendors.search}
        onSearchChange={vendors.setSearch}
        searchPlaceholder="Search vendors..."
      />

      {editing !== null && (
        <VendorForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            if (editing.id) vendors.update(editing.id, data);
            else vendors.create({ ...data, active: true });
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { vendors.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Delete vendor?"
        description={`"${confirmDelete?.name}" will be permanently removed.`}
      />
    </>
  );
}

function VendorForm({ initial, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial || {},
  });

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit vendor' : 'Add vendor'} size="lg" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="vendor-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save' : 'Create'}</Button>
      </>
    }>
      <form id="vendor-form" onSubmit={handleSubmit((d) => onSubmit(stripEmpty(d)))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name *" error={errors.name?.message} {...register('name', { required: 'Required' })} />
        <Input label="Contact person" {...register('contactPerson')} />
        <Input label="Phone" {...register('phone')} />
        <Input label="Email" type="email" {...register('email')} />
        <Select label="Category" {...register('categoryName')}>
          <option value="">—</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
        <Input label="Base price (₹)" type="number" {...register('basePrice')} />
        <Select label="Rating" {...register('rating')}>
          <option value="">—</option>
          {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ★</option>)}
        </Select>
        <div />
        <div className="sm:col-span-2"><Input label="Address" {...register('address')} /></div>
        <div className="sm:col-span-2"><Textarea label="Notes" rows={3} {...register('notes')} /></div>
      </form>
    </Modal>
  );
}

function stripEmpty(d) {
  return Object.fromEntries(Object.entries(d).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
}
