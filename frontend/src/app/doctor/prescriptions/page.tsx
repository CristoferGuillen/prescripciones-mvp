import { AppShell } from '../../../components/layout/AppShell';
import { Card, CardHeader } from '../../../components/ui/Card';

export default function DoctorPrescriptionsPage() {
  return (
    <AppShell
      title="Prescripciones del médico"
      description="Base de navegación lista. El listado y creación de prescripciones se implementarán en el Sprint 6."
      allowedRoles={['DOCTOR']}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader
            title="Listado médico"
            description="Endpoint backend disponible: GET /prescriptions."
          />
          <p className="text-sm text-slate-600">
            Esta pantalla mostrará las prescripciones creadas por el médico autenticado.
          </p>
        </Card>

        <Card>
          <CardHeader
            title="Nueva prescripción"
            description="Endpoint backend disponible: POST /prescriptions."
          />
          <p className="text-sm text-slate-600">
            El formulario médico se conectará con el selector de pacientes y los items de medicamentos.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}