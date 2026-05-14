'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { apiFetch } from '../../../lib/api';
import { formatDateTime } from '../../../lib/format';
import { getSession } from '../../../lib/session';
import type { Prescription } from '../../../types/prescription';

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPrescriptions() {
      const session = getSession();

      if (!session) {
        return;
      }

      try {
        const data = await apiFetch<Prescription[]>('/prescriptions', {
          token: session.accessToken,
        });

        setPrescriptions(data);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'No se pudieron cargar las prescripciones';

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPrescriptions();
  }, []);

  return (
    <AppShell
      title="Mis prescripciones"
      description="Listado de prescripciones asignadas al paciente autenticado."
      allowedRoles={['PATIENT']}
    >
      <Card>
        <CardHeader
          title="Prescripciones asignadas"
          description="Puedes abrir el detalle, marcar como consumida y descargar el PDF."
        />

        {isLoading ? (
          <p className="text-sm text-slate-600">Cargando prescripciones...</p>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && prescriptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="font-medium text-slate-900">No tienes prescripciones</p>
            <p className="mt-1 text-sm text-slate-600">
              Cuando un médico te asigne una prescripción, aparecerá aquí.
            </p>
          </div>
        ) : null}

        {!isLoading && !error && prescriptions.length > 0 ? (
          <div className="space-y-3">
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
        ) : null}
      </Card>
    </AppShell>
  );
}