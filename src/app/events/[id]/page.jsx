'use client';

import Link from 'next/link';
import {
  ArrowLeft, Calendar, MapPin, Users as UsersIcon, Phone, Mail, IndianRupee,
  CheckCircle2, Circle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/Feedback';
import { StatusBadge } from '@/components/ui/Badge';
import { inr, fmtDate } from '@/lib/utils';
import { events, tasks, payments } from '@/data/seed';

export default function EventDetailPage({ params }) {
  return (
    <DashboardLayout allowedRoles={['COMPANY_ADMIN', 'EVENT_MANAGER', 'STAFF']}>
      <EventDetail id={params.id} />
    </DashboardLayout>
  );
}

function EventDetail({ id }) {
  const event = events.find((e) => e.id === id);
  if (!event) return <div className="card p-8 text-center text-ink-500">Event not found.</div>;

  const eventTasks    = tasks.filter((t) => t.eventId === id);
  const eventPayments = payments.filter((p) => p.event?.id === id);

  return (
    <>
      <Link href="/events" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> All events
      </Link>

      <PageHeader
        title={event.name}
        subtitle={`${event.clientName} • ${event.eventType || 'Event'}`}
        actions={<StatusBadge status={event.status} />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Fact icon={Calendar}    label="Date"   value={`${fmtDate(event.startDate)}${event.endDate ? ` → ${fmtDate(event.endDate)}` : ''}`} />
        <Fact icon={MapPin}      label="Venue"  value={event.venue || '—'} />
        <Fact icon={UsersIcon}   label="Guests" value={event.guestCount || '—'} />
        <Fact icon={IndianRupee} label="Budget" value={inr(event.budget)} sub={`Spent: ${inr(event.actualSpend)}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="card p-5">
            <h3 className="font-display text-lg font-semibold mb-4">Vendors</h3>
            {event.vendors.length === 0 ? (
              <p className="text-sm text-ink-500 py-6 text-center">No vendors assigned yet.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {event.vendors.map((ev) => (
                  <li key={ev.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-semibold text-sm text-ink-900">{ev.vendor.name}</div>
                      <div className="text-xs text-ink-500">
                        {ev.vendor.category?.name || 'Uncategorized'}
                        {ev.agreedPrice && <> • Agreed: {inr(ev.agreedPrice)}</>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card p-5">
            <h3 className="font-display text-lg font-semibold mb-4">Tasks</h3>
            {eventTasks.length === 0 ? (
              <p className="text-sm text-ink-500 py-6 text-center">No tasks for this event yet.</p>
            ) : (
              <ul className="space-y-2">
                {eventTasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-ink-50 transition-colors">
                    {t.status === 'DONE'
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      : <Circle className="w-5 h-5 text-ink-300 shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${t.status === 'DONE' ? 'line-through text-ink-400' : 'text-ink-900'}`}>
                        {t.title}
                      </div>
                      <div className="text-xs text-ink-500 mt-0.5 flex gap-2 flex-wrap">
                        {t.dueDate && <span>Due {fmtDate(t.dueDate)}</span>}
                        {t.assignee && <span>• {t.assignee.name}</span>}
                      </div>
                    </div>
                    <StatusBadge status={t.priority} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {event.checklist?.length > 0 && (
            <section className="card p-5">
              <h3 className="font-display text-lg font-semibold mb-4">Checklist</h3>
              <ul className="space-y-2">
                {event.checklist.map((c, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {c.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-ink-300" />}
                    <span className={c.done ? 'line-through text-ink-400' : 'text-ink-800'}>{c.item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="card p-5">
            <h3 className="font-display text-base font-semibold mb-3">Client</h3>
            <ul className="space-y-2 text-sm">
              <li className="font-semibold">{event.clientName}</li>
              {event.clientPhone && <li className="flex items-center gap-2 text-ink-600"><Phone className="w-3.5 h-3.5" /> {event.clientPhone}</li>}
              {event.clientEmail && <li className="flex items-center gap-2 text-ink-600"><Mail className="w-3.5 h-3.5" /> {event.clientEmail}</li>}
            </ul>
          </section>

          <section className="card p-5">
            <h3 className="font-display text-base font-semibold mb-3">Payments</h3>
            {eventPayments.length === 0 ? (
              <p className="text-sm text-ink-500">No payments yet.</p>
            ) : (
              <ul className="space-y-2">
                {eventPayments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{p.direction === 'INCOMING' ? 'Received' : 'Paid out'}</div>
                      <div className="text-xs text-ink-500">{fmtDate(p.paidAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{inr(p.amount)}</div>
                      <StatusBadge status={p.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {event.manager && (
            <section className="card p-5">
              <h3 className="font-display text-base font-semibold mb-3">Manager</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 grid place-items-center font-bold">
                  {event.manager.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold">{event.manager.name}</div>
                  <div className="text-xs text-ink-500">{event.manager.email}</div>
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

function Fact({ icon: Icon, label, value, sub }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-xs text-ink-500 uppercase tracking-wider font-semibold">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="font-display text-lg font-bold text-ink-900 mt-1 leading-tight">{value}</div>
      {sub && <div className="text-xs text-ink-500 mt-0.5">{sub}</div>}
    </div>
  );
}
