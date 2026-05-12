'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Tags } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader, EmptyState } from '@/components/ui/Feedback';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import toast from 'react-hot-toast';
import { categories as seedCategories } from '@/data/seed';

export default function CategoriesPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'EVENT_MANAGER']}>
      <CategoriesContent />
    </DashboardLayout>
  );
}

function CategoriesContent() {
  const [cats, setCats] = useState(seedCategories);
  const [expanded, setExpanded] = useState({});
  const [editingCat, setEditingCat] = useState(null);
  const [addingSub, setAddingSub]  = useState(null); // category being added under
  const [editingSub, setEditingSub] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const saveCat = (data, id) => {
    if (id) {
      setCats((c) => c.map((cat) => cat.id === id ? { ...cat, ...data } : cat));
      toast.success('Updated (demo)');
    } else {
      setCats((c) => [{ id: 'cat_' + Math.random().toString(36).slice(2,8), subcategories: [], _count: { vendors: 0 }, ...data }, ...c]);
      toast.success('Created (demo)');
    }
  };
  const saveSub = (data, catId, subId) => {
    setCats((c) => c.map((cat) => {
      if (cat.id !== catId) return cat;
      if (subId) {
        return { ...cat, subcategories: cat.subcategories.map((s) => s.id === subId ? { ...s, ...data } : s) };
      }
      return { ...cat, subcategories: [...cat.subcategories, { id: 'sub_' + Math.random().toString(36).slice(2,8), categoryId: catId, ...data }] };
    }));
    toast.success(subId ? 'Updated (demo)' : 'Added (demo)');
  };
  const delCat = (id) => { setCats((c) => c.filter((cat) => cat.id !== id)); toast.success('Deleted (demo)'); };
  const delSub = (catId, subId) => {
    setCats((c) => c.map((cat) => cat.id === catId ? { ...cat, subcategories: cat.subcategories.filter((s) => s.id !== subId) } : cat));
    toast.success('Deleted (demo)');
  };

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organize vendors by type and specialty"
        actions={<Button onClick={() => setEditingCat({})}><Plus className="w-4 h-4" /> New category</Button>}
      />

      {cats.length === 0 ? (
        <EmptyState icon={Tags} title="No categories" description="Create your first category." />
      ) : (
        <div className="space-y-2">
          {cats.map((cat) => (
            <div key={cat.id} className="card overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <button onClick={() => toggle(cat.id)} className="flex items-center gap-2 flex-1 text-left min-w-0">
                  {expanded[cat.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <div className="min-w-0">
                    <div className="font-semibold text-ink-900 truncate">{cat.name}</div>
                    <div className="text-xs text-ink-500">{cat.subcategories?.length || 0} subcategories • {cat._count?.vendors || 0} vendors</div>
                  </div>
                </button>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setAddingSub(cat)}    className="btn-ghost p-2" title="Add subcategory"><Plus className="w-4 h-4" /></button>
                  <button onClick={() => setEditingCat(cat)}    className="btn-ghost p-2"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setConfirmDelete({ type: 'cat', cat })} className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {expanded[cat.id] && cat.subcategories?.length > 0 && (
                <ul className="border-t border-ink-100 divide-y divide-ink-100 bg-ink-50/30">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.id} className="flex items-center justify-between px-4 py-2 pl-12">
                      <span className="text-sm text-ink-800">{sub.name}</span>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingSub({ cat, sub })} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirmDelete({ type: 'sub', cat, sub })} className="btn-ghost p-1.5 text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category modal */}
      {editingCat !== null && (
        <NameForm
          title={editingCat.id ? 'Edit category' : 'New category'}
          initialName={editingCat.name}
          onClose={() => setEditingCat(null)}
          onSubmit={(d) => { saveCat(d, editingCat.id); setEditingCat(null); }}
        />
      )}
      {/* Sub-add */}
      {addingSub && (
        <NameForm
          title={`Add subcategory under "${addingSub.name}"`}
          onClose={() => setAddingSub(null)}
          onSubmit={(d) => { saveSub(d, addingSub.id); setAddingSub(null); }}
        />
      )}
      {/* Sub-edit */}
      {editingSub && (
        <NameForm
          title="Edit subcategory"
          initialName={editingSub.sub.name}
          onClose={() => setEditingSub(null)}
          onSubmit={(d) => { saveSub(d, editingSub.cat.id, editingSub.sub.id); setEditingSub(null); }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete.type === 'cat') delCat(confirmDelete.cat.id);
          else delSub(confirmDelete.cat.id, confirmDelete.sub.id);
          setConfirmDelete(null);
        }}
        title={confirmDelete?.type === 'cat' ? 'Delete category?' : 'Delete subcategory?'}
        description={confirmDelete?.type === 'cat' ? 'All subcategories will also be removed.' : 'This subcategory will be removed.'}
      />
    </>
  );
}

function NameForm({ title, initialName = '', onClose, onSubmit }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { name: initialName } });
  return (
    <Modal open onClose={onClose} title={title} size="sm" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="name-form" type="submit" loading={isSubmitting}>Save</Button>
      </>
    }>
      <form id="name-form" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name *" autoFocus error={errors.name?.message} {...register('name', { required: 'Required' })} />
      </form>
    </Modal>
  );
}
