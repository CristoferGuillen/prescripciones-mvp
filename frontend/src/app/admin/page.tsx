'use client';

import { useCallback, useEffect, useState } from 'react';

import { AppShell } from '../../components/layout/AppShell';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
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
      title="Panel administrativo"
      description="Resumen ejecutivo del comportamiento general del sistema."
      allowedRoles={['ADMIN']}
    >
      <div className="space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Administración
            </p>

            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              Métricas del sistema
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Totales, estados y actividad diaria de las prescripciones
              registradas.
            </p>

            {lastUpdatedAt ? (
              <p className="mt-2 text-xs font-medium text-slate-500">
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
        </section>

        {isLoading ? (
          <Card className="px-5 py-8 text-center text-sm font-medium text-slate-600">
            Cargando métricas...
          </Card>
        ) : null}

        {error ? <Alert variant="error">{error}</Alert> : null}

        {!isLoading && !error && metrics ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Médicos"
                value={metrics.totals.doctors}
                description="Profesionales registrados"
                icon="✚"
                tone="blue"
              />

              <MetricCard
                title="Pacientes"
                value={metrics.totals.patients}
                description="Usuarios con rol paciente"
                icon="👤"
                tone="slate"
              />

              <MetricCard
                title="Prescripciones"
                value={metrics.totals.prescriptions}
                description="Total de recetas creadas"
                icon="▤"
                tone="blue"
              />

              <MetricCard
                title="Pendientes"
                value={metrics.byStatus.pending}
                description="Recetas aún no consumidas"
                icon="●"
                tone="amber"
              />
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 bg-white px-5 py-5">
                  <h3 className="text-lg font-extrabold text-slate-950">
                    Estado de prescripciones
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Relación entre prescripciones pendientes y consumidas.
                  </p>
                </div>

                <div className="space-y-5 p-5">
                  <div className="overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-4 rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${consumedPercentage}%`,
                      }}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <StatusMetric
                      label="Consumidas"
                      value={consumedPrescriptions}
                      percentage={consumedPercentage}
                      tone="consumed"
                    />

                    <StatusMetric
                      label="Pendientes"
                      value={pendingPrescriptions}
                      percentage={pendingPercentage}
                      tone="pending"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-lg font-extrabold text-slate-950">
                  Resumen operativo
                </h3>

                <div className="mt-5 space-y-3">
                  <SummaryRow
                    label="Días con actividad"
                    value={metrics.byDay.length}
                  />

                  <SummaryRow
                    label="Promedio por día"
                    value={averagePerDay}
                  />

                  <SummaryRow
                    label="Mayor actividad"
                    value={
                      highestDay
                        ? `${highestDay.count} el ${formatDayLabel(
                            highestDay.date,
                          )}`
                        : 'Sin datos'
                    }
                  />

                  <SummaryRow
                    label="Total del periodo"
                    value={metrics.totals.prescriptions}
                  />
                </div>
              </Card>
            </section>

            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 bg-white px-5 py-5">
                <h3 className="text-lg font-extrabold text-slate-950">
                  Actividad diaria
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Cantidad de prescripciones registradas por fecha.
                </p>
              </div>

              {metrics.byDay.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    title="No hay datos diarios"
                    description="Cuando existan prescripciones, aparecerán en esta tabla."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[640px] w-full text-left">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        <th className="px-5 py-3">Fecha</th>
                        <th className="px-5 py-3">Cantidad</th>
                        <th className="px-5 py-3">Participación</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white">
                      {metrics.byDay.map((row) => {
                        const dayPercentage = calculatePercentage(
                          row.count,
                          totalPrescriptions,
                        );

                        return (
                          <tr
                            key={row.date}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                              {formatDayLabel(row.date)}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-700">
                              {row.count}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-blue-700"
                                    style={{
                                      width: `${dayPercentage}%`,
                                    }}
                                  />
                                </div>

                                <span className="text-sm font-semibold text-slate-700">
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
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

type MetricCardProps = {
  title: string;
  value: number;
  description: string;
  icon: string;
  tone: 'blue' | 'slate' | 'amber';
};

function MetricCard({
  title,
  value,
  description,
  icon,
  tone,
}: MetricCardProps) {
  const toneClasses: Record<MetricCardProps['tone'], string> = {
    blue: 'bg-blue-50 text-blue-800 ring-blue-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  };

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div
          className={[
            'flex h-11 w-11 items-center justify-center rounded-2xl text-lg ring-1',
            toneClasses[tone],
          ].join(' ')}
        >
          {icon}
        </div>
      </div>

      <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
        {formatNumber(value)}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
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
      <p className="text-sm font-bold">{label}</p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-extrabold">{formatNumber(value)}</p>
        <p className="text-sm font-bold">{percentage}%</p>
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
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-extrabold text-slate-950">{value}</span>
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
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('es-CO').format(value);
}