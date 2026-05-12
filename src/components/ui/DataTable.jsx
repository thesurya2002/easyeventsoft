'use client';

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingState, EmptyState } from './Feedback';

export default function DataTable({
  columns,
  rows = [],
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
  loading,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  toolbar,
  rowKey = (row) => row.id,
  emptyTitle = 'No results',
  emptyDescription = 'Try adjusting your filters.',
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            value={searchValue || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="input pl-9"
          />
        </div>
        {toolbar && <div className="flex gap-2 flex-wrap">{toolbar}</div>}
      </div>

      <div className="table-wrap">
        {loading ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <div className="p-6"><EmptyState title={emptyTitle} description={emptyDescription} /></div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={cn('th', col.className)}>{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-ink-50/60 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={cn('td', col.className)}>
                      {col.render ? col.render(row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between text-sm text-ink-600">
          <span>
            Showing <span className="font-semibold text-ink-900">{Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)}</span> of <span className="font-semibold text-ink-900">{total}</span>
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => onPageChange?.(page - 1)} className="btn-ghost p-2 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)} className="btn-ghost p-2 disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
