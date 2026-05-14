'use client';

import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { apiFetch } from '../../lib/api';
import { getSession } from '../../lib/session';
import type { AdminMetrics } from '../../types/admin';

export default function AdminPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadMetrics = useCallback(async (options?: { refreshing?: boolean }) => {
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
      setLastUpdatedAt(formatDateTimeLabel(new Date()));
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
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const totalPrescriptions = metrics?.totals.prescriptions ?? 0;
  const pendingPrescriptions = metrics?.byStatus.pending ?? 0;
  const consumedPrescriptions = metrics?.byStatus.consumed ?? 0;

  const pendingPercentage = calculatePercentage(
    pendingPrescriptions,
    totalPrescriptions,
  );
  const consumedPercentage = calculatePercentage(
    consumedPrescriptions,
    totalPrescriptions,
  );

  const averagePerDay =
    metrics && metrics.byDay.length > 0
      ? (metrics.totals.prescriptions / metrics.byDay.length).toFixed(1)
      : '0';

  const highestDay = getHighestDay(metrics?.byDay ?? []);

  return (
    <AppShell
      title="Panel administrador"
      description="Dashboard operativo con métricas generales del sistema."
      allowedRoles={['ADMIN']}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Métricas del sistema
          </h2>
          <p className="text-sm text-slate-600">
            Totales, estados, comportamiento diario y resumen operativo.
          </p>

          {lastUpdatedAt ? (
            <p className="mt-1 text-xs text-slate-500">
              Última actualización: {lastUpdatedAt}
            </p>
          ) : null}
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
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      {!isLoading && !error && metrics ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Médicos"
              value={metrics.totals.doctors}
              description="Perfiles médicos disponibles para crear prescripciones."
            />

            <MetricCard
              title="Pacientes"
              value={metrics.totals.patients}
              description="Pacientes disponibles para recibir prescripciones."
            />

            <MetricCard
              title="Prescripciones"
              value={metrics.totals.prescriptions}
              description="Total de prescripciones registradas en el sistema."
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader
                title="Prescripciones por estado"
                description="Distribución actual entre recetas pendientes y consumidas."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <StatusMetric
                  label="Pendientes"
                  value={pendingPrescriptions}
                  percentage={pendingPercentage}
                  tone="pending"
                />

                <StatusMetric
                  label="Consumidas"
                  value={consumedPrescriptions}
                  percentage={consumedPercentage}
                  tone="consumed"
                />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Progreso de consumo</span>
                  <span className="font-semibold text-slate-900">
                    {consumedPercentage}% consumidas
                  </span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-amber-100 ring-1 ring-amber-200">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${consumedPercentage}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Consumidas: {consumedPercentage}%</span>
                  <span>Pendientes: {pendingPercentage}%</span>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Resumen operativo"
                description="Lectura rápida del estado actual."
              />

              <div className="space-y-3">
                <SummaryRow
                  label="Total de recetas"
                  value={metrics.totals.prescriptions}
                />
                <SummaryRow label="Pendientes" value={pendingPrescriptions} />
                <SummaryRow label="Consumidas" value={consumedPrescriptions} />
                <SummaryRow label="Promedio diario" value={averagePerDay} />
                <SummaryRow
                  label="Día con más recetas"
                  value={
                    highestDay
                      ? `${formatDayLabel(highestDay.date)} · ${highestDay.count}`
                      : 'Sin datos'
                  }
                />
              </div>
            </Card>
          </section>

          <Card>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <CardHeader
                title="Prescripciones por día"
                description="Conteo diario calculado desde backend."
              />

              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Días con actividad:{' '}
                <span className="font-semibold text-slate-950">
                  {metrics.byDay.length}
                </span>
              </div>
            </div>

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
                      <th className="px-4 py-3 font-semibold">Participación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.byDay.map((row) => {
                      const dayPercentage = calculatePercentage(
                        row.count,
                        totalPrescriptions,
                      );

                      return (
                        <tr key={row.date} className="border-t border-slate-200">
                          <td className="px-4 py-3 font-medium text-slate-950">
                            {formatDayLabel(row.date)}
                          </td>
                          <td className="px-4 py-3 text-slate-700">{row.count}</td>
                          <td className="px-4 py-3 text-slate-700">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-slate-700"
                                  style={{
                                    width: `${dayPercentage}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-600">
                                {dayPercentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

type StatusMetricProps = {
  label: string;
  value: number;
  percentage: number;
  tone: 'pending' | 'consumed';
};

function StatusMetric({ label, value, percentage, tone }: StatusMetricProps) {
  const classes =
    tone === 'consumed'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : 'border-amber-200 bg-amber-50 text-amber-900';

  return (
    <div className={['rounded-2xl border p-4', classes].join(' ')}>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm font-semibold">{percentage}%</p>
      </div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: number | string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="text-right font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function calculatePercentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function getHighestDay(days: { date: string; count: number }[]) {
  if (days.length === 0) {
    return null;
  }

  return days.reduce((highest, current) => {
    if (current.count > highest.count) {
      return current;
    }

    return highest;
  }, days[0]);
}

function formatDayLabel(value: string) {
  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function formatDateTimeLabel(date: Date) {
  return new Intl.DateTimeFormat('es-DO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}