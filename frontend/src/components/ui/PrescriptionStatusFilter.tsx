import type { PrescriptionStatusFilter } from '../../types/prescription';

type PrescriptionStatusFilterProps = {
  value: PrescriptionStatusFilter;
  disabled?: boolean;
  onChange: (value: PrescriptionStatusFilter) => void;
};

const options: {
  value: PrescriptionStatusFilter;
  label: string;
}[] = [
  {
    value: 'ALL',
    label: 'Todas',
  },
  {
    value: 'PENDING',
    label: 'Pendientes',
  },
  {
    value: 'CONSUMED',
    label: 'Consumidas',
  },
];

export function PrescriptionStatusFilter({
  value,
  disabled = false,
  onChange,
}: PrescriptionStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={[
              'rounded-xl px-3 py-2 text-sm font-semibold transition',
              'disabled:cursor-not-allowed disabled:opacity-60',
              isActive
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}