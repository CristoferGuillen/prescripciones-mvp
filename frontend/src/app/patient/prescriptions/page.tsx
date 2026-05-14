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
    setPage((currentPage) => currentPage + 1);
  }

  return (
    <AppShell
      title="Mis prescripciones"
      description="Listado de prescripciones asignadas al paciente autenticado."
      allowedRoles={['PATIENT']}
    >
      <Card>
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <CardHeader
            title="Prescripciones asignadas"
            description="Puedes filtrar, abrir el detalle, marcar como consumida y descargar el PDF."
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
            <div className="space-y-3 p-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-950">{prescription.code}</p>
                      <StatusBadge status={prescription.status} />
                    </div>

                    <p className="text-sm text-slate-600">
                      Médico: {prescription.doctor.user.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      Fecha: {formatDateTime(prescription.createdAt)}
                    </p>
                    <p className="text-sm text-slate-600">
                      Medicamentos: {prescription.items.length}
                    </p>
                  </div>

                  <Link href={`/patient/prescriptions/${prescription.id}`}>
                    <Button variant="secondary">Ver detalle</Button>
                  </Link>
                </div>
              ))}
            </div>

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