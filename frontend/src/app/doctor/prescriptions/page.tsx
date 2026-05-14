'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PaginationControls } from '../../../components/ui/PaginationControls';
import { PrescriptionStatusFilter } from '../../../components/ui/PrescriptionStatusFilter';
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
    setPage((currentPage) => currentPage + 1);
    setSuccessMessage('');
  }

  return (
    <AppShell
      title="Prescripciones del médico"
      description="Listado de prescripciones creadas por el médico autenticado."
      allowedRoles={['DOCTOR']}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Mis prescripciones</h2>
          <p className="text-sm text-slate-600">
            Crea, filtra y revisa las prescripciones asignadas a tus pacientes.
          </p>
        </div>

        <Link href="/doctor/prescriptions/new">
          <Button>Nueva prescripción</Button>
        </Link>
      </div>

      {successMessage ? (
        <Alert variant="success" className="mb-5">
          {successMessage}
        </Alert>
      ) : null}

      <Card>
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <CardHeader
            title="Listado"
            description="Las prescripciones se filtran desde backend según el médico autenticado."
          />

          <PrescriptionStatusFilter
            value={statusFilter}
            disabled={isLoading}
            onChange={handleStatusChange}
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-600">Cargando prescripciones...</p>
        ) : null}

        {error ? <Alert variant="error">{error}</Alert> : null}

        {!isLoading && !error && prescriptions.length === 0 ? (
          <EmptyState
            title={getEmptyTitle(statusFilter)}
            description={getEmptyDescription(statusFilter)}
          />
        ) : null}

        {!isLoading && !error && prescriptions.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Código</th>
                  <th className="px-4 py-3 font-semibold">Paciente</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-950">
                      {prescription.code}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div>{prescription.patient.user.name}</div>
                      <div className="text-xs text-slate-500">
                        {prescription.patient.user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={prescription.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDateTime(prescription.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {prescription.items.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <PaginationControls
              page={meta.page}
              limit={meta.limit}
              total={meta.total}
              totalPages={meta.totalPages}
              isLoading={isLoading}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
            />
          </div>
        ) : null}
      </Card>
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