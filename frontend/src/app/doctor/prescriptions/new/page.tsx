'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';

import { AppShell } from '../../../../components/layout/AppShell';
import { Alert } from '../../../../components/ui/Alert';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { apiFetch } from '../../../../lib/api';
import { formatDate } from '../../../../lib/format';
import { getSession } from '../../../../lib/session';
import type {
  CreatePrescriptionInput,
  CreatePrescriptionItemInput,
  Prescription,
} from '../../../../types/prescription';
import type { UserListItem } from '../../../../types/user';

const emptyItem: CreatePrescriptionItemInput = {
  medicineName: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
};

export default function NewPrescriptionPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<UserListItem[]>([]);
  const [patientId, setPatientId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<CreatePrescriptionItemInput[]>([
    { ...emptyItem },
  ]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPatients() {
      const session = getSession();

      if (!session) {
        return;
      }

      try {
        const data = await apiFetch<UserListItem[]>('/users?role=PATIENT', {
          token: session.accessToken,
        });

        setPatients(data);

        const firstPatientId = data.find((user) => user.patient)?.patient?.id;

        if (firstPatientId) {
          setPatientId(firstPatientId);
        }
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'No se pudieron cargar los pacientes';

        setError(message);
      } finally {
        setIsLoadingPatients(false);
      }
    }

    loadPatients();
  }, []);

  function updateItem(
    index: number,
    field: keyof CreatePrescriptionItemInput,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const nextItems = [...items];

    nextItems[index] = {
      ...nextItems[index],
      [field]: event.target.value,
    };

    setItems(nextItems);
  }

  function addItem() {
    setItems((currentItems) => [...currentItems, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    setItems((currentItems) => {
      if (currentItems.length === 1) {
        return currentItems;
      }

      return currentItems.filter((_, currentIndex) => currentIndex !== index);
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const session = getSession();

    if (!session) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    const payload: CreatePrescriptionInput = {
      patientId,
      notes: notes.trim() || undefined,
      items: items.map((item) => ({
        medicineName: item.medicineName.trim(),
        dosage: item.dosage.trim(),
        frequency: item.frequency.trim(),
        duration: item.duration.trim(),
        instructions: item.instructions?.trim() || undefined,
      })),
    };

    try {
      await apiFetch<Prescription>('/prescriptions', {
        method: 'POST',
        token: session.accessToken,
        body: JSON.stringify(payload),
      });

      router.push('/doctor/prescriptions?created=1');
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo crear la prescripción';

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell
      title="Nueva prescripción"
      description="Completa los datos necesarios para emitir una receta médica digital."
      allowedRoles={['DOCTOR']}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        {error ? <Alert variant="error">{error}</Alert> : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                👤
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Información del paciente
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Selecciona el paciente existente al que se asignará la
                  prescripción.
                </p>
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-800">
                Paciente
              </span>

              <select
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                disabled={isLoadingPatients || patients.length === 0}
                required
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {isLoadingPatients ? (
                  <option>Cargando pacientes...</option>
                ) : null}

                {!isLoadingPatients && patients.length === 0 ? (
                  <option>No hay pacientes disponibles</option>
                ) : null}

                {!isLoadingPatients
                  ? patients
                      .filter((patient) => patient.patient)
                      .map((patient) => (
                        <option
                          key={patient.id}
                          value={patient.patient?.id ?? ''}
                        >
                          {patient.name} · {patient.email}
                          {patient.patient?.birthDate
                            ? ` · Nac. ${formatDate(patient.patient.birthDate)}`
                            : ''}
                        </option>
                      ))
                  : null}
              </select>
            </label>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                ✎
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Notas generales
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Agrega observaciones o indicaciones generales para el
                  paciente.
                </p>
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-800">
                Notas
              </span>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="Indicaciones generales para el paciente..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                    ✚
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950">
                      Medicamentos
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Agrega uno o más medicamentos con dosis, frecuencia y
                      duración.
                    </p>
                  </div>
                </div>

                <Button type="button" variant="secondary" onClick={addItem}>
                  Agregar medicamento
                </Button>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-5 sm:p-6">
              {items.map((item, index) => (
                <section
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        Medicamento {index + 1}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Completa los campos obligatorios de este ítem.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      disabled={items.length === 1}
                      onClick={() => removeItem(index)}
                    >
                      Quitar
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Nombre del medicamento"
                      name={`medicineName-${index}`}
                      value={item.medicineName}
                      onChange={(event) =>
                        updateItem(index, 'medicineName', event)
                      }
                      placeholder="Ej. Amoxicilina 500 mg"
                      required
                    />

                    <Input
                      label="Dosis"
                      name={`dosage-${index}`}
                      value={item.dosage}
                      onChange={(event) => updateItem(index, 'dosage', event)}
                      placeholder="500 mg"
                      required
                    />

                    <Input
                      label="Frecuencia"
                      name={`frequency-${index}`}
                      value={item.frequency}
                      onChange={(event) =>
                        updateItem(index, 'frequency', event)
                      }
                      placeholder="Cada 8 horas"
                      required
                    />

                    <Input
                      label="Duración"
                      name={`duration-${index}`}
                      value={item.duration}
                      onChange={(event) =>
                        updateItem(index, 'duration', event)
                      }
                      placeholder="3 días"
                      required
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="Instrucciones"
                        name={`instructions-${index}`}
                        value={item.instructions}
                        onChange={(event) =>
                          updateItem(index, 'instructions', event)
                        }
                        placeholder="Tomar después de comer"
                      />
                    </div>
                  </div>
                </section>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-800 transition hover:border-blue-400 hover:bg-blue-50"
              >
                + Añadir otro medicamento
              </button>
            </div>
          </Card>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/doctor/prescriptions')}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting || !patientId}>
              {isSubmitting ? 'Creando...' : 'Crear prescripción'}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}