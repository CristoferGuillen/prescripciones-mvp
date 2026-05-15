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

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [statusFilter, setStatusFilter] =
    useState<PrescriptionStatusFilterValue>('ALL');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
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
    const params = new URLSearchParams(window.location.search);

    if (params.get('created') === '1') {
      setSuccessMessage('Prescripción creada correctamente.');
      window.history.replaceState(null, '', '/doctor/prescriptions');
    }
  }, []);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  function handleStatusChange(nextStatus: PrescriptionStatusFilterValue) {
    setStatusFilter(nextStatus);
    setPage(1);
    setSuccessMessage('');
  }

  function handlePreviousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
    setSuccessMessage('');
  }

  function handleNextPage() {
    setPage((currentPage) =>
      Math.min(currentPage + 1, Math.max(meta.totalPages, 1)),
    );
    setSuccessMessage('');
  }

  return (
    <AppShell
      title="Prescripciones del médico"
      description="Listado de prescripciones creadas por el médico autenticado."
      allowedRoles={['DOCTOR']}
    >
      <div className="space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Gestión clínica
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              Mis prescripciones
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Crea, filtra y revisa las recetas asignadas a tus pacientes sin
              salir del flujo operativo.
            </p>
          </div>

          <Link href="/doctor/prescriptions/new">
            <Button className="w-full xl:w-auto">Nueva prescripción</Button>
          </Link>
        </section>

        {successMessage ? (
          <Alert variant="success">{successMessage}</Alert>
        ) : null}

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 bg-white px-5 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Listado
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Las prescripciones se filtran desde backend según el médico
                  autenticado.
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
            </div>
          </div>

          <div className="p-5">
            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-600">
                Cargando prescripciones...
              </div>
            ) : null}

            {error ? <Alert variant="error">{error}</Alert> : null}

            {!isLoading && !error && prescriptions.length === 0 ? (
              <EmptyState
                title={getEmptyTitle(statusFilter)}
                description={getEmptyDescription(statusFilter)}
              />
            ) : null}

            {!isLoading && !error && prescriptions.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-[820px] w-full text-left">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        <th className="px-4 py-3">Código</th>
                        <th className="px-4 py-3">Paciente</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3 text-right">Ítems</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white">
                      {prescriptions.map((prescription) => (
                        <tr
                          key={prescription.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4">
                            <p className="font-mono text-sm font-semibold text-slate-950">
                              {prescription.code}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-sm font-bold text-slate-900">
                              {prescription.patient.user.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {prescription.patient.user.email}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={prescription.status} />
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            {formatDateTime(prescription.createdAt)}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-blue-50 px-3 text-sm font-bold text-blue-800 ring-1 ring-blue-100">
                              {prescription.items.length}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-600">
                    Mostrando página{' '}
                    <span className="font-bold text-slate-900">
                      {meta.page}
                    </span>{' '}
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
                      disabled={
                        meta.totalPages === 0 || meta.page >= meta.totalPages
                      }
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function getEmptyTitle(statusFilter: PrescriptionStatusFilterValue) {
  if (statusFilter === 'PENDING') {
    return 'No hay prescripciones pendientes';
  }

  if (statusFilter === 'CONSUMED') {
    return 'No hay prescripciones consumidas';
  }

  return 'No hay prescripciones todavía';
}

function getEmptyDescription(statusFilter: PrescriptionStatusFilterValue) {
  if (statusFilter === 'PENDING') {
    return 'Cuando existan recetas pendientes, aparecerán en este listado.';
  }

  if (statusFilter === 'CONSUMED') {
    return 'Cuando los pacientes consuman recetas, aparecerán en este listado.';
  }

  return 'Crea la primera prescripción para un paciente existente.';
}