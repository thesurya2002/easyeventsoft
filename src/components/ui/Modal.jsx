'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modal({ open, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink-900/40 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className={cn('w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-ink-200 max-h-[92vh] overflow-hidden flex flex-col', sizes[size])}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink-100 transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-ink-600" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <footer className="px-6 py-4 border-t border-ink-100 bg-ink-50/50 flex justify-end gap-2">{footer}</footer>}
      </div>
    </div>
  );
}
