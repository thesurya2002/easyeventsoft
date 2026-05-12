'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(function Input({ className, label, error, ...props }, ref) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input ref={ref} className={cn('input', error && 'border-rose-400 focus:ring-rose-100 focus:border-rose-500', className)} {...props} />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({ className, label, error, rows = 3, ...props }, ref) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <textarea ref={ref} rows={rows} className={cn('input resize-y', error && 'border-rose-400', className)} {...props} />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select({ className, label, error, children, ...props }, ref) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <select ref={ref} className={cn('input pr-9 appearance-none', error && 'border-rose-400', className)} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
});
