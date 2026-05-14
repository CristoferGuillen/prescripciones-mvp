'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { apiFetch } from '../../lib/api';
import { getSession } from '../../lib/session';
import type { AdminMetrics } from '../../types/admin';

export default function AdminPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function loadMetrics(options?: { refreshing?: boolean }) {
    const session = getSession();

    if (!session) {
      return;
    }

    if (options?.refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError('');

    try {
      const data = await apiFetch<AdminMetrics>('/admin/metrics', {
        token: session.accessToken,
      });

      setMetrics(data);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron cargar las métricas';

      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <AppShell
      title="Panel administrador"
      description="Dashboard básico con métricas generales del sistema."
      allowedRoles={['ADMIN']}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Métricas del sistema</h2>
          <p className="text-sm text-slate-600">
            Totales, estado de prescripciones y conteo diario.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => loadMetrics({ refreshing: true })}
          disabled={isLoading || isRefreshing}
        >
          {isRefreshing ? 'Actualizando...' : 'Actualizar métricas'}
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <p className="text-sm text-slate-600">Cargando métricas...</p>
        </Card>
      ) : null}

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && metrics ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Médicos"
              value={metrics.totals.doctors}
              description="Total de perfiles médicos registrados por seed."
            />

            <MetricCard
              title="Pacientes"
              value={metrics.totals.patients}
              description="Total de pacientes disponibles para prescripciones."
            />

            <MetricCard
              title="Prescripciones"
              value={metrics.totals.prescriptions}
              description="Total de prescripciones creadas en el sistema."
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader
                title="Prescripciones por estado"
                description="Conteo básico de pendientes y consumidas."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-700">Pendientes</p>
                  <p className="mt-2 text-3xl font-bold text-amber-900">
                    {metrics.byStatus.pending}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-700">Consumidas</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-900">
                    {metrics.byStatus.consumed}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Resumen operativo"
                description="Validación rápida del estado actual del MVP."
              />

              <div className="space-y-3 text-sm text-slate-700">
                <SummaryRow label="Usuarios médicos" value={metrics.totals.doctors} />
                <SummaryRow label="Usuarios pacientes" value={metrics.totals.patients} />
                <SummaryRow
                  label="Total de recetas"
                  value={metrics.totals.prescriptions}
                />
                <SummaryRow
                  label="Recetas finalizadas"
                  value={metrics.byStatus.consumed}
                />
              </div>
            </Card>
          </section>

          <Card>
            <CardHeader
              title="Prescripciones por día"
              description="Conteo diario calculado desde backend."
            />

            {metrics.byDay.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                <p className="font-medium text-slate-900">No hay datos diarios</p>
                <p className="mt-1 text-sm text-slate-600">
                  Cuando existan prescripciones, aparecerán en esta tabla.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Fecha</th>
                      <th className="px-4 py-3 font-semibold">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.byDay.map((row) => (
                      <tr key={row.date} className="border-t border-slate-200">
                        <td className="px-4 py-3 font-medium text-slate-950">
                          {row.date}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}

type MetricCardProps = {
  title: string;
  value: number;
  description: string;
};

function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Card>
  );
}

type SummaryRowProps = {
  label: string;
  value: number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span>{label}</span>
      <span className="font-semibold text-slate-950">{value}</span>
    </div>
  );
}