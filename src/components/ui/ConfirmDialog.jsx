'use client';

import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description, confirmText = 'Delete', loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmText}</Button>
      </>
    }>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-ink-700 leading-relaxed">{description || 'This action cannot be undone.'}</p>
      </div>
    </Modal>
  );
}
