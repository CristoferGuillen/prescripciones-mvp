type StatusBadgeProps = {
  status: string;
  className?: string;
};

function getStatusConfig(status: string) {
  if (status === 'CONSUMED') {
    return {
      label: 'Consumida',
      dotClassName: 'bg-emerald-600',
      className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    };
  }

  if (status === 'PENDING') {
    return {
      label: 'Pendiente',
      dotClassName: 'bg-amber-500',
      className: 'bg-amber-50 text-amber-700 ring-amber-200',
    };
  }

  return {
    label: status,
    dotClassName: 'bg-slate-500',
    className: 'bg-slate-50 text-slate-700 ring-slate-200',
  };
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
        config.className,
        className,
      ].join(' ')}
    >
      <span className={['h-1.5 w-1.5 rounded-full', config.dotClassName].join(' ')} />
      {config.label}
    </span>
  );
}