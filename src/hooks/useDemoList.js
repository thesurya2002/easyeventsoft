'use client';

import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

/**
 * useDemoList — frontend-only CRUD over a local in-memory array.
 * Mutations simulate a real backend: optimistic update + toast,
 * but everything resets on page refresh.
 */
export default function useDemoList(seed, opts = {}) {
  const [items, setItems] = useState(seed);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const limit = opts.limit || 20;

  // Search and filter logic
  const filtered = useMemo(() => {
    let out = items;

    // search
    if (search) {
      const q = search.toLowerCase();
      out = out.filter((row) =>
        Object.values(row).some((v) =>
          typeof v === 'string' && v.toLowerCase().includes(q)
        )
      );
    }

    // filters: each filter is field:value, "value" means equality match (skip empty)
    for (const [k, v] of Object.entries(filters)) {
      if (v === undefined || v === '' || v === null) continue;
      out = out.filter((row) => {
        const cell = k.includes('.') ? k.split('.').reduce((a, p) => a?.[p], row) : row[k];
        return cell === v;
      });
    }

    return out;
  }, [items, search, filters]);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * limit, page * limit);

  const create = (data) => {
    const newItem = { id: 'tmp_' + Math.random().toString(36).slice(2, 8), ...data };
    setItems((arr) => [newItem, ...arr]);
    toast.success('Created (demo)');
  };
  const update = (id, data) => {
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, ...data } : it)));
    toast.success('Updated (demo)');
  };
  const remove = (id) => {
    setItems((arr) => arr.filter((it) => it.id !== id));
    toast.success('Deleted (demo)');
  };

  return {
    items: paged,
    total,
    page,
    limit,
    search,
    filters,
    loading: false,
    setPage,
    setSearch: (v) => { setSearch(v); setPage(1); },
    setFilters: (f) => { setFilters(f); setPage(1); },
    create, update, remove,
  };
}
