'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import useDemoList from '@/hooks/useDemoList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/Feedback';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { inr } from '@/lib/utils';
import { plans as seedPlans } from '@/data/seed';

export default function AdminPlansPage() {
  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <PlansContent />
    </DashboardLayout>
  );
}

function PlansContent() {
  const plans = useDemoList(seedPlans, { limit: 50 });
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <>
      <PageHeader
        title="Subscription Plans"
        subtitle="Pricing tiers offered to tenant companies"
        actions={<Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> New plan</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.items.map((p) => (
          <article key={p.id} className="card p-6 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-ink-900">{p.name}</h3>
                {p.active ? <Badge color="green" dot className="mt-1">active</Badge> : <Badge color="slate" className="mt-1">inactive</Badge>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(p)} className="btn-ghost p-2"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setConfirmDelete(p)} className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-display font-bold text-ink-900">{inr(p.priceMonthly)}</div>
              <div className="text-xs text-ink-500">per month • {inr(p.priceYearly)} yearly</div>
            </div>

            <div className="mt-4 pt-4 border-t border-ink-100 text-sm text-ink-700">
              <div>Up to <span className="font-semibold">{p.maxUsers}</span> users</div>
              <div>Up to <span className="font-semibold">{p.maxEvents}</span> events</div>
            </div>

            {p.features?.length > 0 && (
              <ul className="mt-4 pt-4 border-t border-ink-100 space-y-1.5">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-ink-700">{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      {editing !== null && (
        <PlanForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            const features = (data.features || '').split('\n').map((s) => s.trim()).filter(Boolean);
            const payload = { ...data, features, active: data.active === 'true' || data.active === true };
            if (editing.id) plans.update(editing.id, payload);
            else plans.create(payload);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { plans.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Delete plan?"
        description={`"${confirmDelete?.name}" will be removed.`}
      />
    </>
  );
}

function PlanForm({ initial, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial ? {
      ...initial,
      features: (initial.features || []).join('\n'),
      active: initial.active ? 'true' : 'false',
    } : { active: 'true', features: '' },
  });

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit plan' : 'New plan'} footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="plan-edit-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save' : 'Create'}</Button>
      </>
    }>
      <form id="plan-edit-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input label="Plan name *" error={errors.name?.message} {...register('name', { required: 'Required' })} />
        </div>
        <Input label="Monthly price (₹)" type="number" {...register('priceMonthly')} />
        <Input label="Yearly price (₹)"  type="number" {...register('priceYearly')} />
        <Input label="Max users"  type="number" {...register('maxUsers')} />
        <Input label="Max events" type="number" {...register('maxEvents')} />
        <div className="sm:col-span-2">
          <Textarea label="Features (one per line)" rows={4} {...register('features')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Status</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2 text-sm"><input type="radio" value="true"  {...register('active')} /> Active</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="radio" value="false" {...register('active')} /> Inactive</label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
