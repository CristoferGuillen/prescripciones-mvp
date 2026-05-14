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

export default function DoctorPrescriptionsPage() {
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
      title="Prescripciones del médico"
      description="Listado de prescripciones creadas por el médico autenticado."
      allowedRoles={['DOCTOR']}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Mis prescripciones</h2>
          <p className="text-sm text-slate-600">
            Crea y revisa las prescripciones asignadas a tus pacientes.
          </p>
        </div>

        <Link href="/doctor/prescriptions/new">
          <Button>Nueva prescripción</Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Listado"
          description="Las prescripciones se filtran desde backend según el médico autenticado."
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
            <p className="font-medium text-slate-900">No hay prescripciones todavía</p>
            <p className="mt-1 text-sm text-slate-600">
              Crea la primera prescripción para un paciente existente.
            </p>
          </div>
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
                    <td className="px-4 py-3 text-slate-700">{prescription.items.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </AppShell>
  );
}