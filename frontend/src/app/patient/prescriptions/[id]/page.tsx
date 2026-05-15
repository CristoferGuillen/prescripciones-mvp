'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { AppShell } from '../../../../components/layout/AppShell';
import { Alert } from '../../../../components/ui/Alert';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { API_URL } from '../../../../lib/config';
import { apiFetch } from '../../../../lib/api';
import { formatDateTime } from '../../../../lib/format';
import { getSession } from '../../../../lib/session';
import type { Prescription } from '../../../../types/prescription';

export default function PatientPrescriptionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsuming, setIsConsuming] = useState(false);
  const [isViewingPdf, setIsViewingPdf] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPrescription() {
      const session = getSession();

      if (!session) {
        return;
      }

      try {
        const data = await apiFetch<Prescription>(
          `/prescriptions/${params.id}`,
          {
            token: session.accessToken,
          },
        );

        setPrescription(data);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'No se pudo cargar la prescripción';

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPrescription();
  }, [params.id]);

  async function handleConsume() {
    const session = getSession();

    if (!session || !prescription) {
      return;
    }

    const shouldConsume = window.confirm(
      '¿Seguro que deseas marcar esta prescripción como consumida? Esta acción actualizará el estado de la receta.',
    );

    if (!shouldConsume) {
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsConsuming(true);

    try {
      const updatedPrescription = await apiFetch<Prescription>(
        `/prescriptions/${prescription.id}/consume`,
        {
          method: 'PATCH',
          token: session.accessToken,
        },
      );

      setPrescription(updatedPrescription);
      setSuccessMessage('Prescripción marcada como consumida correctamente.');
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo marcar como consumida';

      setError(message);
    } finally {
      setIsConsuming(false);
    }
  }

  async function handleViewPdf() {
    const session = getSession();

    if (!session || !prescription) {
      return;
    }

    const pdfWindow = window.open('', '_blank');

    if (!pdfWindow) {
      setError(
        'No se pudo abrir una nueva pestaña. Revisa el bloqueador de ventanas emergentes.',
      );

      return;
    }

    pdfWindow.document.write('Generando PDF...');

    setError('');
    setSuccessMessage('');
    setIsViewingPdf(true);

    try {
      const blob = await fetchPrescriptionPdfBlob(
        prescription.id,
        session.accessToken,
      );
      const objectUrl = window.URL.createObjectURL(blob);

      pdfWindow.location.href = objectUrl;
      setSuccessMessage('PDF abierto en una nueva pestaña.');

      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 60000);
    } catch (requestError) {
      pdfWindow.close();

      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo abrir el PDF';

      setError(message);
    } finally {
      setIsViewingPdf(false);
    }
  }

  async function handleDownloadPdf() {
    const session = getSession();

    if (!session || !prescription) {
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsDownloadingPdf(true);

    try {
      const blob = await fetchPrescriptionPdfBlob(
        prescription.id,
        session.accessToken,
      );
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = `prescripcion-${prescription.code}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(objectUrl);
      setSuccessMessage('PDF descargado correctamente.');
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo descargar el PDF';

      setError(message);
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  return (
    <AppShell
      title="Detalle de prescripción"
      description="Consulta la información completa de tu receta médica digital."
      allowedRoles={['PATIENT']}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push('/patient/prescriptions')}
          >
            ← Volver al listado
          </Button>

          {prescription ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => void handleViewPdf()}
                disabled={isViewingPdf || isDownloadingPdf}
              >
                {isViewingPdf ? 'Abriendo...' : 'Ver PDF'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => void handleDownloadPdf()}
                disabled={isViewingPdf || isDownloadingPdf}
              >
                {isDownloadingPdf ? 'Descargando...' : 'Descargar PDF'}
              </Button>

              {prescription.status === 'PENDING' ? (
                <Button
                  onClick={() => void handleConsume()}
                  disabled={isConsuming}
                >
                  {isConsuming ? 'Actualizando...' : 'Marcar como consumida'}
                </Button>
              ) : null}
            </div>
          ) : null}
        </section>

        {successMessage ? (
          <Alert variant="success">{successMessage}</Alert>
        ) : null}

        {error ? <Alert variant="error">{error}</Alert> : null}

        {isLoading ? (
          <Card className="px-5 py-8 text-center text-sm font-medium text-slate-600">
            Cargando prescripción...
          </Card>
        ) : null}

        {!isLoading && !prescription ? (
          <EmptyState
            title="Prescripción no encontrada"
            description="No fue posible cargar la prescripción solicitada."
          />
        ) : null}

        {prescription ? (
          <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-2 bg-blue-800" />

            <div className="space-y-8 p-5 pt-8 sm:p-8 sm:pt-10">
              <section className="flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                    Receta médica digital
                  </p>

                  <h2 className="mt-2 font-mono text-2xl font-extrabold tracking-tight text-slate-950">
                    {prescription.code}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Emitida el {formatDateTime(prescription.createdAt)}
                  </p>

                  <div className="mt-4">
                    <StatusBadge status={prescription.status} />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 lg:min-w-72">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Estado de consumo
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    {prescription.consumedAt
                      ? `Consumida el ${formatDateTime(
                          prescription.consumedAt,
                        )}`
                      : 'Aún no consumida'}
                  </p>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <InfoPanel title="Médico tratante">
                  <InfoRow label="Nombre" value={prescription.doctor.user.name} />
                  <InfoRow label="Email" value={prescription.doctor.user.email} />
                  <InfoRow
                    label="Especialidad"
                    value={prescription.doctor.specialty ?? 'No registrada'}
                  />
                </InfoPanel>

                <InfoPanel title="Paciente">
                  <InfoRow
                    label="Nombre"
                    value={prescription.patient.user.name}
                  />
                  <InfoRow
                    label="Email"
                    value={prescription.patient.user.email}
                  />
                  <InfoRow
                    label="Fecha de nacimiento"
                    value={
                      prescription.patient.birthDate
                        ? formatDateTime(prescription.patient.birthDate)
                        : 'No registrada'
                    }
                  />
                </InfoPanel>
              </section>

              <section>
                <div className="mb-3">
                  <h3 className="text-lg font-extrabold text-slate-950">
                    Medicamentos
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Indicaciones registradas en la prescripción.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-[760px] w-full text-left">
                      <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          <th className="px-4 py-3">Medicamento</th>
                          <th className="px-4 py-3">Dosis</th>
                          <th className="px-4 py-3">Frecuencia</th>
                          <th className="px-4 py-3">Duración</th>
                          <th className="px-4 py-3">Instrucciones</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200 bg-white">
                        {prescription.items.map((item) => (
                          <tr
                            key={item.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-4 text-sm font-bold text-slate-950">
                              {item.medicineName}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-700">
                              {item.dosage}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-700">
                              {item.frequency}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-700">
                              {item.duration}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-700">
                              {item.instructions ??
                                'Sin instrucciones adicionales'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                  Notas generales
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {prescription.notes ?? 'Sin notas registradas.'}
                </p>
              </section>
            </div>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}

type InfoPanelProps = {
  title: string;
  children: React.ReactNode;
};

function InfoPanel({ title, children }: InfoPanelProps) {
  return (
    <section className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </h3>

      <div className="space-y-3">{children}</div>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

async function fetchPrescriptionPdfBlob(
  prescriptionId: string,
  accessToken: string,
) {
  const response = await fetch(`${API_URL}/prescriptions/${prescriptionId}/pdf`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    throw new Error(getErrorMessage(errorBody));
  }

  return response.blob();
}

function getErrorMessage(errorBody: unknown) {
  if (!errorBody || typeof errorBody !== 'object') {
    return 'No se pudo obtener el PDF';
  }

  const body = errorBody as {
    message?: string | string[];
    error?: string;
  };

  if (Array.isArray(body.message)) {
    return body.message.join(', ');
  }

  if (typeof body.message === 'string') {
    return body.message;
  }

  if (typeof body.error === 'string') {
    return body.error;
  }

  return 'No se pudo obtener el PDF';
}