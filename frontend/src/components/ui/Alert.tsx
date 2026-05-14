import type { ReactNode } from 'react';

type AlertVariant = 'success' | 'error' | 'info';

type AlertProps = {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
};

const variantClasses: Record<AlertVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-slate-200 bg-slate-50 text-slate-700',
};

export function Alert({ children, variant = 'info', className = '' }: AlertProps) {
  return (
    <div
      className={[
        'rounded-xl border px-4 py-3 text-sm',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}