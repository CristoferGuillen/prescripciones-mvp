# Sprint 3 - Pruebas manuales de prescripciones backend

Fecha: 2026-05-14  
Entorno: Local  
Backend: http://localhost:3001  
Herramienta: PowerShell

## Objetivo

Validar manualmente el Sprint 3: creación, listado por rol, detalle y consumo de prescripciones desde API, con permisos protegidos desde backend.

## Endpoints probados

- GET /users?role=PATIENT
- POST /prescriptions
- GET /prescriptions
- GET /prescriptions/:id
- PATCH /prescriptions/:id/consume

## Usuarios probados

| Email | Rol | Resultado |
|---|---|---|
| admin@test.com | ADMIN | Login correcto y listado global correcto |
| doctor@test.com | DOCTOR | Login correcto, consulta pacientes, crea y lista prescripciones |
| patient@test.com | PATIENT | Login correcto, lista, ve detalle y consume prescripción propia |
| patient2@test.com | PATIENT | Login correcto, no puede acceder ni consumir prescripción ajena |

## Checklist de validación

| Prueba | Resultado |
|---|---|
| GET /users?role=PATIENT con token DOCTOR | OK |
| GET /users?role=PATIENT con token PATIENT devuelve 403 | OK |
| POST /prescriptions con token DOCTOR crea prescripción PENDING | OK |
| POST /prescriptions con token PATIENT devuelve 403 | OK |
| GET /prescriptions con token DOCTOR lista sus prescripciones | OK |
| GET /prescriptions con token PATIENT lista sus prescripciones | OK |
| GET /prescriptions con token ADMIN lista todas las prescripciones | OK |
| GET /prescriptions/:id con paciente propietario devuelve detalle | OK |
| GET /prescriptions/:id con paciente ajeno devuelve 403 | OK |
| PATCH /prescriptions/:id/consume con paciente propietario cambia estado a CONSUMED | OK |
| PATCH /prescriptions/:id/consume dos veces devuelve 400 | OK |
| PATCH /prescriptions/:id/consume con paciente ajeno devuelve 403 | OK |
| GET /prescriptions sin token devuelve 401 | OK |

## Resultado

Sprint 3 validado correctamente.

El backend ya permite:
- consultar pacientes para el selector del médico;
- crear prescripciones con uno o más medicamentos;
- listar prescripciones filtradas por rol;
- ver detalle con validación de permisos;
- marcar una prescripción propia como consumida;
- bloquear acceso a prescripciones ajenas;
- bloquear acciones sin token o con rol incorrecto.

## Nota

No se incluye salida completa de PowerShell porque contiene tokens JWT de sesión local.

Durante la salida de PowerShell algunos caracteres acentuados pueden verse con codificación incorrecta. Esto no afectó la respuesta funcional de la API ni los criterios de aceptación del sprint.