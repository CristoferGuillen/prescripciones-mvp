import { Button } from './Button';

type PaginationControlsProps = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function PaginationControls({
  page,
  limit,
  total,
  totalPages,
  isLoading = false,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const firstVisibleItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastVisibleItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Mostrando{' '}
        <span className="font-semibold text-slate-900">{firstVisibleItem}</span>
        {' - '}
        <span className="font-semibold text-slate-900">{lastVisibleItem}</span>
        {' de '}
        <span className="font-semibold text-slate-900">{total}</span>
        {' prescripciones'}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={isLoading || page <= 1}
          onClick={onPrevious}
        >
          Anterior
        </Button>

        <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          Página {page} de {safeTotalPages}
        </span>

        <Button
          variant="secondary"
          disabled={isLoading || page >= safeTotalPages}
          onClick={onNext}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}