# Sprint 7 - Pruebas manuales de datos demo, filtros y paginación backend

Fecha: 2026-05-14  
Entorno: Local  
Backend: http://localhost:3001  
Herramienta: PowerShell

## Objetivo

Validar manualmente el Sprint 7: ampliación del seed demo, filtros por estado en prescripciones, paginación simple y conservación de permisos por rol desde backend.

## Cambios validados

- Seed demo ampliado con más prescripciones.
- `GET /prescriptions` devuelve respuesta paginada con `data` y `meta`.
- Filtro por estado usando `status=PENDING`.
- Filtro por estado usando `status=CONSUMED`.
- Validación de estado inválido.
- Paginación mediante `page` y `limit`.
- Conservación de permisos por rol para ADMIN, DOCTOR y PATIENT.
- Métricas admin actualizadas con los nuevos datos.

## Endpoints probados

- GET /prescriptions
- GET /prescriptions?status=PENDING
- GET /prescriptions?status=CONSUMED
- GET /prescriptions?status=INVALID
- GET /prescriptions?page=1&limit=2
- GET /prescriptions?status=PENDING&page=1&limit=10
- GET /prescriptions?status=CONSUMED&page=1&limit=10
- GET /admin/metrics

## Usuarios probados

| Email | Rol | Resultado |
|---|---|---|
| admin@test.com | ADMIN | Puede consultar prescripciones globales filtradas y paginadas |
| doctor@test.com | DOCTOR | Solo consulta prescripciones creadas por su perfil médico |
| patient@test.com | PATIENT | Solo consulta prescripciones propias |

## Checklist de validación

| Prueba | Resultado |
|---|---|
| Seed ampliado ejecuta correctamente | OK |
| GET /prescriptions devuelve objeto con data y meta | OK |
| meta incluye page | OK |
| meta incluye limit | OK |
| meta incluye total | OK |
| meta incluye totalPages | OK |
| GET /prescriptions?page=1&limit=2 devuelve máximo 2 registros | OK |
| GET /prescriptions?status=PENDING devuelve solo prescripciones pendientes | OK |
| GET /prescriptions?status=CONSUMED devuelve solo prescripciones consumidas | OK |
| GET /prescriptions?status=INVALID devuelve 400 | OK |
| DOCTOR mantiene filtro por sus prescripciones | OK |
| PATIENT mantiene filtro por sus prescripciones | OK |
| ADMIN puede consultar métricas globales actualizadas | OK |
| /admin/metrics refleja más datos demo | OK |
| Backend compila correctamente con npm run build | OK |

## Respuesta validada para estado inválido

```json
{
  "message": "Estado de prescripción inválido",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Respuesta validada de métricas

```json
{
  "totals": {
    "doctors": 1,
    "patients": 2,
    "prescriptions": 9
  },
  "byStatus": {
    "pending": 4,
    "consumed": 5
  },
  "byDay": [
    {
      "date": "2026-05-10",
      "count": 1
    },
    {
      "date": "2026-05-11",
      "count": 1
    },
    {
      "date": "2026-05-12",
      "count": 2
    },
    {
      "date": "2026-05-13",
      "count": 1
    },
    {
      "date": "2026-05-14",
      "count": 4
    }
  ]
}
```

## Resultado

Sprint 7 validado correctamente.

El backend ahora permite:

- listar prescripciones con respuesta paginada;
- filtrar prescripciones por estado;
- controlar parámetros inválidos con error 400;
- mantener reglas de acceso por rol;
- alimentar mejor el dashboard admin con datos demo más representativos;
- entregar metadatos de paginación para que el frontend pueda implementar controles visuales en el siguiente sprint.

## Nota

No se incluye salida completa de PowerShell porque contiene datos extensos de prescripciones y tokens de sesión local.  
La evidencia manual confirmó que los filtros, la paginación y las métricas funcionan correctamente.
