# Sprint 9 - QA de detalle de prescripción y acciones PDF

Fecha: 2026-05-14  
Entorno: Local  
Frontend: http://localhost:3000  
Backend: http://localhost:3001  
Herramienta: Navegador web

## Objetivo

Validar manualmente el Sprint 9: mejoras en el detalle de prescripción del paciente, confirmación antes de consumir, mensajes de éxito y acciones separadas para ver y descargar el PDF.

## Cambios validados

- Confirmación antes de marcar una prescripción como consumida.
- Cancelar la confirmación no ejecuta cambios.
- Confirmar la acción consume correctamente la prescripción.
- Mensaje de éxito después de consumir.
- El botón de consumir desaparece cuando la prescripción queda en estado `CONSUMED`.
- Botón `Ver PDF` abre el documento en una nueva pestaña.
- Botón `Descargar PDF` descarga el archivo PDF.
- Mensajes de éxito al abrir o descargar el PDF.
- La pantalla mantiene la protección por rol mediante `AppShell`.
- El detalle sigue mostrando médico, paciente, notas, medicamentos, estado y fechas.

## Archivo principal validado

- frontend/src/app/patient/prescriptions/[id]/page.tsx

## Usuario probado

| Email | Rol | Resultado |
|---|---|---|
| patient@test.com | PATIENT | Puede abrir detalle, consumir prescripción, ver PDF y descargar PDF |

## Endpoints usados desde frontend

- GET /prescriptions/:id
- PATCH /prescriptions/:id/consume
- GET /prescriptions/:id/pdf

## Checklist de validación

| Prueba | Resultado |
|---|---|
| Login patient redirige a /patient/prescriptions | OK |
| Paciente puede abrir el detalle de una prescripción pendiente | OK |
| El detalle carga código, estado y fechas | OK |
| El detalle carga datos del médico | OK |
| El detalle carga datos del paciente | OK |
| El detalle carga notas | OK |
| El detalle carga medicamentos/items | OK |
| Clic en Marcar como consumida muestra confirmación | OK |
| Cancelar confirmación no consume la prescripción | OK |
| Confirmar consume la prescripción correctamente | OK |
| El estado cambia a CONSUMED | OK |
| Aparece mensaje “Prescripción marcada como consumida correctamente.” | OK |
| El botón de consumir desaparece cuando queda CONSUMED | OK |
| Botón Ver PDF abre el PDF en una nueva pestaña | OK |
| Botón Descargar PDF descarga el archivo PDF | OK |
| Aparece mensaje de éxito al abrir PDF | OK |
| Aparece mensaje de éxito al descargar PDF | OK |
| El botón Volver al listado funciona correctamente | OK |
| Frontend compila con npm run build | OK |

## Resultado

Sprint 9 validado correctamente.

El detalle del paciente ahora ofrece una experiencia más segura y clara:

- evita consumos accidentales mediante confirmación;
- informa visualmente cuando una acción se completa;
- separa la acción de abrir el PDF de la acción de descargarlo;
- mantiene el flujo principal de paciente sin romper las validaciones de backend.

## Nota

La generación y protección del PDF siguen viviendo en backend.  
El frontend obtiene el PDF mediante `fetch` con token Bearer, crea un `Blob` y lo usa para abrir o descargar el documento desde el navegador.
