'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '../../../../components/layout/AppShell';
import { Alert } from '../../../../components/ui/Alert';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader } from '../../../../components/ui/Card';
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
        const data = await apiFetch<Prescription>(`/prescriptions/${params.id}`, {
          token: session.accessToken,
        });

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
      setError('No se pudo abrir una nueva pestaña. Revisa el bloqueador de ventanas emergentes.');
      return;
    }

    pdfWindow.document.write('Generando PDF...');

    setError('');
    setSuccessMessage('');
    setIsViewingPdf(true);

    try {
      const blob = await fetchPrescriptionPdfBlob(prescription.id, session.accessToken);
      const objectUrl = window.URL.createObjectURL(blob);

      pdfWindow.location.href = objectUrl;
      setSuccessMessage('PDF abierto en una nueva pestaña.');

      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 60000);
    } catch (requestError) {
      pdfWindow.close();

      const message =
        requestError instanceof Error ? requestError.message : 'No se pudo abrir el PDF';

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
      const blob = await fetchPrescriptionPdfBlob(prescription.id, session.accessToken);
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
      description="Consulta medicamentos, estado y acciones disponibles."
      allowedRoles={['PATIENT']}
    >
      <div className="mb-6">
        <Button variant="secondary" onClick={() => router.push('/patient/prescriptions')}>
          Volver al listado
        </Button>
      </div>

      {successMessage ? (
        <Alert variant="success" className="mb-5">
          {successMessage}
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      {isLoading ? (
        <Card>
          <p className="text-sm text-slate-600">Cargando prescripción...</p>
        </Card>
      ) : null}

      {!isLoading && !prescription ? (
        <Card>
          <CardHeader
            title="Prescripción no disponible"
            description="No se pudo cargar la información solicitada."
          />
        </Card>
      ) : null}

      {prescription ? (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-950">
                    {prescription.code}
                  </h2>
                  <StatusBadge status={prescription.status} />
                </div>

                <p className="text-sm text-slate-600">
                  Emitida: {formatDateTime(prescription.createdAt)}
                </p>
                <p className="text-sm text-slate-600">
                  Consumida:{' '}
                  {prescription.consumedAt
                    ? formatDateTime(prescription.consumedAt)
                    : 'No consumida'}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {prescription.status === 'PENDING' ? (
                  <Button onClick={handleConsume} disabled={isConsuming}>
                    {isConsuming ? 'Actualizando...' : 'Marcar como consumida'}
                  </Button>
                ) : null}

                <Button
                  variant="secondary"
                  onClick={handleViewPdf}
                  disabled={isViewingPdf || isDownloadingPdf}
                >
                  {isViewingPdf ? 'Abriendo...' : 'Ver PDF'}
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf || isViewingPdf}
                >
                  {isDownloadingPdf ? 'Descargando...' : 'Descargar PDF'}
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Datos del médico" />
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-950">Nombre:</span>{' '}
                  {prescription.doctor.user.name}
                </p>
                <p>
                  <span className="font-semibold text-slate-950">Email:</span>{' '}
                  {prescription.doctor.user.email}
                </p>
                <p>
                  <span className="font-semibold text-slate-950">Especialidad:</span>{' '}
                  {prescription.doctor.specialty ?? 'No registrada'}
                </p>
              </div>
            </Card>

            <Card>
              <CardHeader title="Datos del paciente" />
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-950">Nombre:</span>{' '}
                  {prescription.patient.user.name}
                </p>
                <p>
                  <span className="font-semibold text-slate-950">Email:</span>{' '}
                  {prescription.patient.user.email}
                </p>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Notas" />
            <p className="whitespace-pre-line text-sm text-slate-700">
              {prescription.notes ?? 'Sin notas registradas.'}
            </p>
          </Card>

          <Card>
            <CardHeader
              title="Medicamentos"
              description="Detalle de medicamentos indicados en esta prescripción."
            />

            <div className="space-y-4">
              {prescription.items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="mb-3 font-semibold text-slate-950">
                    {index + 1}. {item.medicineName}
                  </h3>

                  <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-950">Dosis:</span>{' '}
                      {item.dosage}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">
                        Frecuencia:
                      </span>{' '}
                      {item.frequency}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">Duración:</span>{' '}
                      {item.duration}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">
                        Instrucciones:
                      </span>{' '}
                      {item.instructions ?? 'Sin instrucciones adicionales.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}

async function fetchPrescriptionPdfBlob(prescriptionId: string, accessToken: string) {
  const response = await fetch(`${API_URL}/prescriptions/${prescriptionId}/pdf`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    throw new Error(errorBody?.message ?? 'No se pudo obtener el PDF');
  }

  return response.blob();
}