'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
};

const Button = forwardRef(function Button(
  { variant = 'primary', loading, disabled, className, children, ...rest }, ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(variants[variant] || variants.primary, className)}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
});

export default Button;
