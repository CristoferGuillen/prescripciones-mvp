'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { AppShell } from '../../../components/layout/AppShell';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { apiFetch } from '../../../lib/api';
import { formatDateTime } from '../../../lib/format';
import { getSession } from '../../../lib/session';
import type {
  PaginatedPrescriptionsResponse,
  PaginationMeta,
  Prescription,
  PrescriptionStatusFilter as PrescriptionStatusFilterValue,
} from '../../../types/prescription';

const PAGE_SIZE = 5;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 0,
};

const FILTERS: Array<{
  label: string;
  value: PrescriptionStatusFilterValue;
}> = [
  {
    label: 'Todas',
    value: 'ALL',
  },
  {
    label: 'Pendientes',
    value: 'PENDING',
  },
  {
    label: 'Consumidas',
    value: 'CONSUMED',
  },
];

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [statusFilter, setStatusFilter] =
    useState<PrescriptionStatusFilterValue>('ALL');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPrescriptions = useCallback(async () => {
    const session = getSession();

    if (!session) {
      return;
    }

    setIsLoading(true);
    setError('');

    const query = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    });

    if (statusFilter !== 'ALL') {
      query.set('status', statusFilter);
    }

    try {
      const response = await apiFetch<PaginatedPrescriptionsResponse>(
        `/prescriptions?${query.toString()}`,
        {
          token: session.accessToken,
        },
      );

      setPrescriptions(response.data);
      setMeta(response.meta);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron cargar las prescripciones';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  function handleStatusChange(nextStatus: PrescriptionStatusFilterValue) {
    setStatusFilter(nextStatus);
    setPage(1);
  }

  function handlePreviousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function handleNextPage() {
    setPage((currentPage) =>
      Math.min(currentPage + 1, Math.max(meta.totalPages, 1)),
    );
  }

  return (
    <AppShell
      title="Mis prescripciones"
      description="Consulta tus recetas activas, revisa el detalle y descarga el PDF cuando lo necesites."
      allowedRoles={['PATIENT']}
    >
      <div className="space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Portal del paciente
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              Recetas asignadas
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Revisa el estado de tus prescripciones y accede a su detalle.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleStatusChange(filter.value)}
                className={[
                  'rounded-xl px-4 py-2 text-sm font-semibold ring-1 transition',
                  statusFilter === filter.value
                    ? 'bg-slate-950 text-white ring-slate-950'
                    : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50',
                ].join(' ')}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {isLoading ? (
          <Card className="px-5 py-8 text-center text-sm font-medium text-slate-600">
            Cargando prescripciones...
          </Card>
        ) : null}

        {error ? <Alert variant="error">{error}</Alert> : null}

        {!isLoading && !error && prescriptions.length === 0 ? (
          <EmptyState
            title={getEmptyTitle(statusFilter)}
            description={getEmptyDescription(statusFilter)}
          />
        ) : null}

        {!isLoading && !error && prescriptions.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {prescriptions.map((prescription) => {
                const mainItem = prescription.items[0];

                return (
                  <Card
                    key={prescription.id}
                    className={[
                      'relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-md',
                      prescription.status === 'CONSUMED'
                        ? 'opacity-80'
                        : '',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'absolute inset-y-0 left-0 w-1',
                        prescription.status === 'CONSUMED'
                          ? 'bg-emerald-300'
                          : 'bg-amber-400',
                      ].join(' ')}
                    />

                    <div className="mb-4 flex items-start justify-between gap-3">
                      <StatusBadge status={prescription.status} />

                      <p className="text-xs font-medium text-slate-500">
                        {formatDateTime(prescription.createdAt)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-mono text-sm font-bold text-slate-950">
                        {prescription.code}
                      </h3>

                      <p className="text-sm text-slate-600">
                        Dr. {prescription.doctor.user.name}
                      </p>

                      {prescription.doctor.specialty ? (
                        <p className="text-xs text-slate-500">
                          {prescription.doctor.specialty}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                        Medicamento principal
                      </p>

                      <p className="mt-2 text-base font-extrabold text-slate-950">
                        {mainItem?.medicineName ?? 'Sin medicamento registrado'}
                      </p>

                      {mainItem ? (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {mainItem.dosage} · {mainItem.frequency} ·{' '}
                          {mainItem.duration}
                        </p>
                      ) : null}

                      {prescription.items.length > 1 ? (
                        <p className="mt-2 text-xs font-semibold text-blue-700">
                          + {prescription.items.length - 1} medicamento(s)
                          adicional(es)
                        </p>
                      ) : null}
                    </div>

                    <Link href={`/patient/prescriptions/${prescription.id}`}>
                      <Button fullWidth className="mt-5">
                        Ver receta
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>

            <Card className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Mostrando página{' '}
                <span className="font-bold text-slate-900">{meta.page}</span>{' '}
                de{' '}
                <span className="font-bold text-slate-900">
                  {Math.max(meta.totalPages, 1)}
                </span>{' '}
                · {meta.total} registros
              </p>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handlePreviousPage}
                  disabled={meta.page <= 1}
                >
                  Anterior
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleNextPage}
                  disabled={meta.totalPages === 0 || meta.page >= meta.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function getEmptyTitle(statusFilter: PrescriptionStatusFilterValue) {
  if (statusFilter === 'PENDING') {
    return 'No tienes prescripciones pendientes';
  }

  if (statusFilter === 'CONSUMED') {
    return 'No tienes prescripciones consumidas';
  }

  return 'No tienes prescripciones';
}

function getEmptyDescription(statusFilter: PrescriptionStatusFilterValue) {
  if (statusFilter === 'PENDING') {
    return 'Cuando un médico te asigne una receta pendiente, aparecerá aquí.';
  }

  if (statusFilter === 'CONSUMED') {
    return 'Cuando marques prescripciones como consumidas, aparecerán aquí.';
  }

  return 'Cuando un médico te asigne una prescripción, aparecerá aquí.';
}