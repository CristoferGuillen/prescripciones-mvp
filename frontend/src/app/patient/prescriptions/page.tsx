import { AppShell } from '../../../components/layout/AppShell';
import { Card, CardHeader } from '../../../components/ui/Card';

export default function PatientPrescriptionsPage() {
  return (
    <AppShell
      title="Mis prescripciones"
      description="Base de navegación lista. El listado, detalle, consumo y descarga PDF se implementarán en el Sprint 6."
      allowedRoles={['PATIENT']}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader
            title="Listado del paciente"
            description="Endpoint backend disponible: GET /prescriptions."
          />
          <p className="text-sm text-slate-600">
            Esta pantalla mostrará solo las prescripciones asignadas al paciente autenticado.
          </p>
        </Card>

        <Card>
          <CardHeader
            title="Detalle y PDF"
            description="Endpoints disponibles: GET /prescriptions/:id y GET /prescriptions/:id/pdf."
          />
          <p className="text-sm text-slate-600">
            El siguiente sprint conectará detalle, consumo y descarga de PDF.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}