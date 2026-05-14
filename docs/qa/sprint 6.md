# Sprint 6 - Pruebas manuales de frontend médico y paciente

Fecha: 2026-05-14  
Entorno: Local  
Frontend: http://localhost:3000  
Backend: http://localhost:3001  
Herramienta: Navegador web

## Objetivo

Validar manualmente el Sprint 6: flujo médico-paciente desde frontend, incluyendo listado de prescripciones, creación desde médico, visualización por paciente, consumo y descarga de PDF.

## Usuarios probados

| Email | Rol | Resultado |
|---|---|---|
| doctor@test.com | DOCTOR | Lista y crea prescripciones |
| patient@test.com | PATIENT | Lista, abre detalle, consume y descarga PDF |

## Endpoints usados desde frontend

- GET /prescriptions
- GET /users?role=PATIENT
- POST /prescriptions
- GET /prescriptions/:id
- PATCH /prescriptions/:id/consume
- GET /prescriptions/:id/pdf

## Checklist médico

| Prueba | Resultado |
|---|---|
| Médico inicia sesión correctamente | OK |
| Médico entra a /doctor/prescriptions | OK |
| Médico ve listado real de prescripciones | OK |
| Médico abre /doctor/prescriptions/new | OK |
| Formulario carga pacientes desde backend | OK |
| Médico selecciona paciente existente | OK |
| Médico completa notas e items | OK |
| Médico crea prescripción desde UI | OK |
| Al crear, vuelve al listado médico | OK |
| La nueva prescripción aparece en el listado | OK |

## Checklist paciente

| Prueba | Resultado |
|---|---|
| Paciente inicia sesión correctamente | OK |
| Paciente entra a /patient/prescriptions | OK |
| Paciente ve sus prescripciones reales | OK |
| Paciente abre detalle de una prescripción | OK |
| Detalle muestra código y estado | OK |
| Detalle muestra datos del médico | OK |
| Detalle muestra datos del paciente | OK |
| Detalle muestra notas | OK |
| Detalle muestra medicamentos/items | OK |
| Paciente marca prescripción como consumida | OK |
| Estado cambia a Consumida | OK |
| Botón de consumir deja de mostrarse cuando está consumida | OK |
| Paciente descarga PDF | OK |
| PDF abre correctamente | OK |

## Evidencia visual

Se validó visualmente que:

- el listado médico muestra prescripciones reales con código, paciente, estado, fecha e items;
- el detalle del paciente muestra estado, fechas, datos del médico, datos del paciente, notas y medicamentos;
- la prescripción puede quedar marcada como consumida desde la interfaz.

## Observación sobre PDF

El PDF descargado contiene código, ID, fecha, estado, datos del paciente, datos del médico, notas y medicamentos.

Si el PDF se descarga antes de consumir la prescripción, es esperado que muestre estado PENDING y fecha de consumo no registrada. Para evidencia final, se recomienda descargar un PDF después de consumir y verificar que refleje estado CONSUMED.

## Resultado

Sprint 6 validado correctamente.

El frontend ya permite:
- que el médico liste sus prescripciones;
- que el médico cree una prescripción para un paciente existente;
- que el paciente liste sus prescripciones;
- que el paciente abra el detalle;
- que el paciente marque una prescripción como consumida;
- que el paciente descargue el PDF de la prescripción.