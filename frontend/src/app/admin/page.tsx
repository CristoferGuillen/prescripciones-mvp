import { AppShell } from '../../components/layout/AppShell';
import { Card, CardHeader } from '../../components/ui/Card';

export default function AdminPage() {
  return (
    <AppShell
      title="Panel administrador"
      description="Base de navegación lista. El dashboard con métricas se conectará en el sprint correspondiente."
      allowedRoles={['ADMIN']}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader
            title="Métricas"
            description="Endpoint backend disponible: GET /admin/metrics."
          />
          <p className="text-sm text-slate-600">
            En el próximo bloque de frontend se mostrarán totales, estados y conteo por día.
          </p>
        </Card>

        <Card>
          <CardHeader title="Rol activo" description="Acceso permitido solo para ADMIN." />
          <p className="text-sm text-slate-600">
            Esta pantalla ya valida sesión y rol desde el cliente.
          </p>
        </Card>

        <Card>
          <CardHeader title="Estado" description="Sprint 5 en progreso." />
          <p className="text-sm text-slate-600">
            Login, redirección y logout quedan cubiertos en este sprint.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}