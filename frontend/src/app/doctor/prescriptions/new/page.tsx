'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../../../components/layout/AppShell';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader } from '../../../../components/ui/Card';
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
  const [items, setItems] = useState<CreatePrescriptionItemInput[]>([{ ...emptyItem }]);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

      router.push('/doctor/prescriptions');
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
      description="Crea una prescripción para un paciente existente."
      allowedRoles={['DOCTOR']}
    >
      <Card>
        <CardHeader
          title="Formulario de prescripción"
          description="Completa los datos mínimos de la receta médica."
        />

        {error ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Paciente
            </span>
            <select
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              disabled={isLoadingPatients || patients.length === 0}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {isLoadingPatients ? (
                <option value="">Cargando pacientes...</option>
              ) : null}

              {!isLoadingPatients && patients.length === 0 ? (
                <option value="">No hay pacientes disponibles</option>
              ) : null}

              {!isLoadingPatients
                ? patients
                    .filter((patient) => patient.patient)
                    .map((patient) => (
                      <option key={patient.id} value={patient.patient?.id}>
                        {patient.name} · {patient.email}
                        {patient.patient?.birthDate
                          ? ` · Nac. ${formatDate(patient.patient.birthDate)}`
                          : ''}
                      </option>
                    ))
                : null}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Notas generales
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Indicaciones generales para el paciente..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-950">Medicamentos</h3>
                <p className="text-sm text-slate-600">
                  Agrega uno o más medicamentos a la prescripción.
                </p>
              </div>

              <Button type="button" variant="secondary" onClick={addItem}>
                Agregar medicamento
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-900">
                    Medicamento {index + 1}
                  </h4>

                  <Button
                    type="button"
                    variant="secondary"
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
                    onChange={(event) => updateItem(index, 'medicineName', event)}
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
                    onChange={(event) => updateItem(index, 'frequency', event)}
                    placeholder="Cada 8 horas"
                    required
                  />

                  <Input
                    label="Duración"
                    name={`duration-${index}`}
                    value={item.duration}
                    onChange={(event) => updateItem(index, 'duration', event)}
                    placeholder="3 días"
                    required
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Instrucciones"
                      name={`instructions-${index}`}
                      value={item.instructions}
                      onChange={(event) => updateItem(index, 'instructions', event)}
                      placeholder="Tomar después de comer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

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
      </Card>
    </AppShell>
  );
}