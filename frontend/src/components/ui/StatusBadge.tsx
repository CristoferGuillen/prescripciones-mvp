import type { PrescriptionStatus } from '../../types/prescription';

type StatusBadgeProps = {
  status: PrescriptionStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const isConsumed = status === 'CONSUMED';

  return (
    <span
      className={[
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        isConsumed
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      ].join(' ')}
    >
      {isConsumed ? 'Consumida' : 'Pendiente'}
    </span>
  );
}