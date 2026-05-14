# Sprint 4 - Pruebas manuales de PDF y métricas admin

Fecha: 2026-05-14  
Entorno: Local  
Backend: http://localhost:3001  
Herramienta: PowerShell

## Objetivo

Validar manualmente el Sprint 4: generación de PDF desde backend y endpoint de métricas administrativas protegidas por rol.

## Endpoints probados

- GET /prescriptions/:id/pdf
- GET /admin/metrics

## Usuarios probados

| Email | Rol | Resultado |
|---|---|---|
| admin@test.com | ADMIN | Puede descargar PDF y consultar métricas |
| doctor@test.com | DOCTOR | Puede descargar PDF de prescripción propia |
| patient@test.com | PATIENT | Puede descargar PDF de prescripción propia |
| patient2@test.com | PATIENT | No puede descargar PDF de prescripción ajena |

## Checklist de validación PDF

| Prueba | Resultado |
|---|---|
| GET /prescriptions/:id/pdf con paciente propietario descarga PDF | OK |
| Archivo prescripcion-paciente.pdf fue generado correctamente | OK |
| PDF abre correctamente desde el sistema operativo | OK |
| GET /prescriptions/:id/pdf con doctor dueño descarga PDF | OK |
| GET /prescriptions/:id/pdf con admin descarga PDF | OK |
| GET /prescriptions/:id/pdf con paciente ajeno devuelve 403 | OK |

## Checklist de validación métricas

| Prueba | Resultado |
|---|---|
| GET /admin/metrics con ADMIN devuelve datos | OK |
| totals.doctors devuelve 1 | OK |
| totals.patients devuelve 2 | OK |
| totals.prescriptions devuelve 3 | OK |
| byStatus.pending devuelve 1 | OK |
| byStatus.consumed devuelve 2 | OK |
| byDay devuelve conteo por fecha | OK |
| GET /admin/metrics con DOCTOR devuelve 403 | OK |
| GET /admin/metrics con PATIENT devuelve 403 | OK |
| GET /admin/metrics sin token devuelve 401 | OK |

## Respuesta validada de métricas

```json
{
  "totals": {
    "doctors": 1,
    "patients": 2,
    "prescriptions": 3
  },
  "byStatus": {
    "pending": 1,
    "consumed": 2
  },
  "byDay": [
    {
      "date": "2026-05-14",
      "count": 3
    }
  ]
}
```

## Resultado

Sprint 4 validado correctamente.

El backend ya permite:
- generar PDF de una prescripción desde backend;
- validar permisos antes de generar el PDF;
- bloquear descarga de PDF para pacientes ajenos;
- consultar métricas administrativas;
- bloquear métricas para doctor, paciente y requests sin token.

## Nota

No se incluyen archivos PDF generados ni salida completa de PowerShell porque contienen datos de sesión local. Los PDF se usaron solo como evidencia manual durante la prueba.
