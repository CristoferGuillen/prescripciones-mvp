# Sprint 8 - QA de listados frontend mejorados

Fecha: 2026-05-14  
Entorno: Local  
Frontend: http://localhost:3000  
Backend: http://localhost:3001  
Herramienta: Navegador web

## Objetivo

Validar manualmente el Sprint 8: adaptación del frontend a la nueva respuesta paginada del backend, filtros por estado, paginación simple, estados vacíos y mensaje de éxito al crear una prescripción.

## Cambios validados

- El frontend consume la nueva estructura de respuesta de `GET /prescriptions`:
  - `data`
  - `meta.page`
  - `meta.limit`
  - `meta.total`
  - `meta.totalPages`
- El listado del médico permite filtrar prescripciones por:
  - Todas
  - Pendientes
  - Consumidas
- El listado del paciente permite filtrar prescripciones por:
  - Todas
  - Pendientes
  - Consumidas
- Se agregó paginación visual con botones:
  - Anterior
  - Siguiente
- Se agregaron estados vacíos contextuales.
- Se agregó mensaje de éxito después de crear una prescripción.
- Se mantuvo la navegación hacia detalle del paciente.
- Se mantuvieron las protecciones por rol mediante AppShell.

## Archivos principales validados

- frontend/src/types/prescription.ts
- frontend/src/components/ui/Alert.tsx
- frontend/src/components/ui/EmptyState.tsx
- frontend/src/components/ui/PaginationControls.tsx
- frontend/src/components/ui/PrescriptionStatusFilter.tsx
- frontend/src/app/doctor/prescriptions/page.tsx
- frontend/src/app/doctor/prescriptions/new/page.tsx
- frontend/src/app/patient/prescriptions/page.tsx

## Usuarios probados

| Email | Rol | Resultado |
|---|---|---|
| doctor@test.com | DOCTOR | Accede al listado médico, filtra, pagina y crea prescripciones |
| patient@test.com | PATIENT | Accede al listado paciente, filtra, pagina y abre detalle |

## Checklist médico

| Prueba | Resultado |
|---|---|
| Login doctor redirige a /doctor/prescriptions | OK |
| /doctor/prescriptions carga sin error con respuesta data/meta | OK |
| El listado médico muestra prescripciones reales | OK |
| Filtro Todas funciona | OK |
| Filtro Pendientes funciona | OK |
| Filtro Consumidas funciona | OK |
| La paginación muestra page, limit, total y totalPages de forma visual | OK |
| Botón Anterior funciona cuando aplica | OK |
| Botón Siguiente funciona cuando aplica | OK |
| Estado vacío se muestra correctamente si el filtro no tiene resultados | OK |
| Nueva prescripción abre /doctor/prescriptions/new | OK |
| El formulario carga pacientes desde backend | OK |
| Médico puede crear una nueva prescripción | OK |
| Al crear, vuelve a /doctor/prescriptions?created=1 | OK |
| El listado muestra mensaje “Prescripción creada correctamente.” | OK |
| El mensaje de éxito desaparece al limpiar el query param visualmente | OK |

## Checklist paciente

| Prueba | Resultado |
|---|---|
| Login patient redirige a /patient/prescriptions | OK |
| /patient/prescriptions carga sin error con respuesta data/meta | OK |
| El listado paciente muestra solo prescripciones propias | OK |
| Filtro Todas funciona | OK |
| Filtro Pendientes funciona | OK |
| Filtro Consumidas funciona | OK |
| La paginación muestra page, limit, total y totalPages de forma visual | OK |
| Botón Anterior funciona cuando aplica | OK |
| Botón Siguiente funciona cuando aplica | OK |
| Estado vacío se muestra correctamente si el filtro no tiene resultados | OK |
| Botón Ver detalle sigue funcionando | OK |
| El detalle de prescripción sigue cargando correctamente | OK |

## Checklist técnico

| Prueba | Resultado |
|---|---|
| Frontend compila con npm run build | OK |
| Backend permanece funcionando con npm run start:dev | OK |
| No se rompió login por rol | OK |
| No se rompió AppShell ni logout | OK |
| No se rompió la navegación del médico | OK |
| No se rompió la navegación del paciente | OK |

## Resultado

Sprint 8 validado correctamente.

El frontend ahora está alineado con la nueva respuesta paginada del backend y ofrece una experiencia más clara en los listados de prescripciones.

El aplicativo permite:

- consultar prescripciones paginadas desde frontend;
- filtrar por estado desde la interfaz;
- visualizar estados vacíos más específicos;
- crear prescripciones y recibir feedback visual de éxito;
- mantener el flujo de detalle del paciente;
- conservar la protección por rol ya existente.

## Nota

La protección principal de datos sigue viviendo en backend.  
Los filtros y la paginación del frontend consumen parámetros soportados por la API implementada en el Sprint 7.
