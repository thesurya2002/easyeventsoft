'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Printer, Filter } from 'lucide-react';
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
import { invoices as seedInvoices, events, company } from '@/data/seed';

const STATUSES = ['DRAFT', 'SENT', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'];
const TYPES    = ['QUOTATION', 'INVOICE'];

function computeTotals(items, discount = 0) {
  const subtotal = items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unitPrice || 0), 0);
  const gst = items.reduce((s, it) => s + (Number(it.quantity || 0) * Number(it.unitPrice || 0) * Number(it.gstRate || 0)) / 100, 0);
  return { subtotal, gst, discount: Number(discount || 0), total: subtotal + gst - Number(discount || 0) };
}

export default function InvoicesPage() {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'ACCOUNTANT', 'EVENT_MANAGER']}>
      <InvoicesContent />
    </DashboardLayout>
  );
}

function InvoicesContent() {
  const invoices = useDemoList(seedInvoices);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const columns = [
    {
      key: 'invoiceNumber', header: 'Number',
      render: (r) => (
        <div>
          <div className="font-semibold text-ink-900">{r.invoiceNumber}</div>
          <div className="text-xs text-ink-500 mt-0.5">{r.type === 'QUOTATION' ? 'Quotation' : 'Invoice'}{r.event ? ` • ${r.event.name}` : ''}</div>
        </div>
      ),
    },
    { key: 'clientName', header: 'Client', render: (r) => r.clientName },
    { key: 'issueDate',  header: 'Issued', render: (r) => fmtDate(r.issueDate) },
    { key: 'total',      header: 'Total',  render: (r) => <span className="font-semibold">{inr(r.total)}</span> },
    {
      key: 'balance', header: 'Balance',
      render: (r) => {
        const bal = Number(r.total || 0) - Number(r.amountPaid || 0);
        return bal > 0 ? <span className="text-rose-700 font-semibold">{inr(bal)}</span> : <span className="text-emerald-700 font-semibold">Settled</span>;
      },
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions', header: '', className: 'text-right w-32',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => printInvoice(r)} className="btn-ghost p-2" title="Print / save as PDF">
            <Printer className="w-4 h-4 text-brand-600" />
          </button>
          <button onClick={() => setEditing(r)} className="btn-ghost p-2"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setConfirmDelete(r)} className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Invoices & Quotations"
        subtitle="GST-compliant billing for clients"
        actions={<Button onClick={() => setEditing({})}><Plus className="w-4 h-4" /> New invoice</Button>}
      />

      <DataTable
        columns={columns}
        rows={invoices.items}
        total={invoices.total}
        page={invoices.page}
        limit={invoices.limit}
        onPageChange={invoices.setPage}
        searchValue={invoices.search}
        onSearchChange={invoices.setSearch}
        searchPlaceholder="Search by number or client..."
        toolbar={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select
              value={invoices.filters.type || ''}
              onChange={(e) => invoices.setFilters({ ...invoices.filters, type: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">All types</option>
              {TYPES.map((t) => <option key={t} value={t}>{t.toLowerCase()}</option>)}
            </select>
            <select
              value={invoices.filters.status || ''}
              onChange={(e) => invoices.setFilters({ ...invoices.filters, status: e.target.value || undefined })}
              className="input py-2 text-sm"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
            </select>
          </div>
        }
      />

      {editing !== null && (
        <InvoiceForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSubmit={(data) => {
            if (editing.id) invoices.update(editing.id, data);
            else invoices.create({ ...data, invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}` });
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { invoices.remove(confirmDelete.id); setConfirmDelete(null); }}
        title="Delete invoice?"
        description={`Invoice ${confirmDelete?.invoiceNumber} will be removed.`}
      />
    </>
  );
}

function InvoiceForm({ initial, onClose, onSubmit }) {
  const isEdit = !!initial;
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial ? {
      ...initial,
      issueDate: initial.issueDate?.split('T')[0] || '',
      dueDate:   initial.dueDate?.split('T')[0]   || '',
    } : {
      type: 'INVOICE',
      status: 'DRAFT',
      issueDate: new Date().toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0, gstRate: 18 }],
      discount: 0,
      amountPaid: 0,
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items    = watch('items') || [];
  const discount = watch('discount') || 0;
  const totals   = computeTotals(items, discount);

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit invoice' : 'New invoice'} size="xl" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button form="inv-form" type="submit" loading={isSubmitting}>{isEdit ? 'Save' : 'Create'}</Button>
      </>
    }>
      <form id="inv-form" onSubmit={handleSubmit((d) => onSubmit({ ...stripEmpty(d), ...totals }))} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select label="Type" {...register('type')}>
            {TYPES.map((t) => <option key={t} value={t}>{t.toLowerCase()}</option>)}
          </Select>
          <Select label="Status" {...register('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
          </Select>
          <Select label="Linked event" {...register('eventId')}>
            <option value="">—</option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Client name *" error={errors.clientName?.message} {...register('clientName', { required: 'Required' })} />
          <Input label="Client GSTIN" {...register('clientGstin')} />
          <Input label="Issue date" type="date" {...register('issueDate')} />
          <Input label="Due date"   type="date" {...register('dueDate')} />
          <div className="sm:col-span-2"><Textarea label="Client address" rows={2} {...register('clientAddress')} /></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label">Line items</label>
            <button type="button" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, gstRate: 18 })} className="text-xs link inline-flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add line
            </button>
          </div>
          <div className="space-y-2">
            {fields.map((f, i) => (
              <div key={f.id} className="grid grid-cols-12 gap-2 items-start">
                <input className="input col-span-5" placeholder="Description"     {...register(`items.${i}.description`)} />
                <input className="input col-span-2" type="number" placeholder="Qty"        {...register(`items.${i}.quantity`)} />
                <input className="input col-span-2" type="number" placeholder="Unit ₹"     {...register(`items.${i}.unitPrice`)} />
                <input className="input col-span-2" type="number" placeholder="GST %"      {...register(`items.${i}.gstRate`)} />
                <button type="button" onClick={() => remove(i)} className="btn-ghost p-2 col-span-1 text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Discount (₹)" type="number" {...register('discount')} />
          <Input label="Amount paid (₹)" type="number" {...register('amountPaid')} />
        </div>

        <div className="card p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div><div className="text-xs text-ink-500">Subtotal</div><div className="font-semibold">{inr(totals.subtotal)}</div></div>
          <div><div className="text-xs text-ink-500">GST</div><div className="font-semibold">{inr(totals.gst)}</div></div>
          <div><div className="text-xs text-ink-500">Discount</div><div className="font-semibold text-rose-600">- {inr(totals.discount)}</div></div>
          <div><div className="text-xs text-ink-500">Total</div><div className="font-bold text-brand-700 text-base">{inr(totals.total)}</div></div>
        </div>

        <Textarea label="Notes" rows={2} {...register('notes')} />
        <Textarea label="Terms & conditions" rows={2} {...register('terms')} />
      </form>
    </Modal>
  );
}

// Open a printable HTML window — replacement for backend PDF generation
function printInvoice(inv) {
  const items = inv.items || [];
  const html = `<!doctype html>
<html><head>
<meta charset="utf-8" />
<title>${inv.invoiceNumber}</title>
<style>
  *{box-sizing:border-box;}
  body{font-family:'Helvetica Neue',Arial,sans-serif;margin:40px;color:#0f172a;}
  h1{font-size:28px;margin:0 0 4px;color:#4338ca;}
  .row{display:flex;justify-content:space-between;gap:24px;}
  table{width:100%;border-collapse:collapse;margin:24px 0;}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;}
  th{background:#f1f5f9;text-transform:uppercase;font-size:11px;letter-spacing:.05em;color:#475569;}
  .right{text-align:right;}
  .totals{margin-left:auto;width:280px;font-size:13px;}
  .totals .line{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;}
  .totals .total{font-size:18px;font-weight:700;color:#4338ca;border:0;padding-top:12px;}
  .muted{color:#64748b;font-size:12px;}
  .pill{display:inline-block;background:#eef2ff;color:#4338ca;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;}
  .terms{margin-top:32px;font-size:11px;color:#64748b;line-height:1.5;}
  @media print { .no-print { display:none; } body { margin: 16px; } }
</style>
</head><body>
<div class="row">
  <div>
    <h1>${inv.type === 'QUOTATION' ? 'Quotation' : 'Invoice'}</h1>
    <div class="pill">${inv.invoiceNumber}</div>
    <div class="muted" style="margin-top:8px;">Issued: ${fmtDate(inv.issueDate)} &nbsp;·&nbsp; Due: ${fmtDate(inv.dueDate)}</div>
  </div>
  <div class="right">
    <div style="font-weight:700;font-size:16px;">${company.name}</div>
    <div class="muted">${company.city}, ${company.state}</div>
    <div class="muted">${company.email} · ${company.phone}</div>
    ${company.gstin ? `<div class="muted">GSTIN: ${company.gstin}</div>` : ''}
  </div>
</div>

<div style="margin-top:32px;">
  <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;font-weight:600;">Billed to</div>
  <div style="font-weight:700;font-size:15px;margin-top:4px;">${inv.clientName || ''}</div>
  <div class="muted">${inv.clientAddress || ''}</div>
  ${inv.clientGstin ? `<div class="muted">GSTIN: ${inv.clientGstin}</div>` : ''}
</div>

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th class="right">Qty</th>
      <th class="right">Rate</th>
      <th class="right">GST</th>
      <th class="right">Amount</th>
    </tr>
  </thead>
  <tbody>
    ${items.map((it) => {
      const amount = Number(it.quantity || 0) * Number(it.unitPrice || 0);
      return `<tr>
        <td>${it.description || ''}</td>
        <td class="right">${it.quantity || 0}</td>
        <td class="right">${inr(it.unitPrice)}</td>
        <td class="right">${it.gstRate || 0}%</td>
        <td class="right">${inr(amount)}</td>
      </tr>`;
    }).join('')}
  </tbody>
</table>

<div class="row">
  <div></div>
  <div class="totals">
    <div class="line"><span>Subtotal</span><span>${inr(inv.subtotal)}</span></div>
    <div class="line"><span>GST</span><span>${inr(inv.gst)}</span></div>
    ${inv.discount > 0 ? `<div class="line"><span>Discount</span><span>- ${inr(inv.discount)}</span></div>` : ''}
    <div class="line total"><span>Total</span><span>${inr(inv.total)}</span></div>
    ${inv.amountPaid > 0 ? `<div class="line"><span>Paid</span><span>${inr(inv.amountPaid)}</span></div>` : ''}
    ${Number(inv.total) - Number(inv.amountPaid || 0) > 0 ? `<div class="line"><span><strong>Balance due</strong></span><span><strong>${inr(Number(inv.total) - Number(inv.amountPaid || 0))}</strong></span></div>` : ''}
  </div>
</div>

${inv.notes  ? `<div class="terms"><strong>Notes:</strong> ${inv.notes}</div>` : ''}
${inv.terms  ? `<div class="terms"><strong>Terms & conditions:</strong> ${inv.terms}</div>` : ''}

<div class="no-print" style="margin-top:32px;text-align:center;">
  <button onclick="window.print()" style="background:#4f46e5;color:white;padding:10px 24px;border:0;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Print / Save as PDF</button>
</div>
</body></html>`;
  const w = window.open('', '_blank');
  if (!w) { toast.error('Pop-up blocked — please allow pop-ups for this site'); return; }
  w.document.open(); w.document.write(html); w.document.close();
}

function stripEmpty(d) {
  return Object.fromEntries(Object.entries(d).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
}
