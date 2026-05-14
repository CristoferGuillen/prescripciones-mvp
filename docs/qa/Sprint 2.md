# Sprint 2 - Pruebas manuales de autenticación y RBAC

Fecha: 2026-05-14  
Entorno: Local  
Backend: http://localhost:3001  
Herramienta: PowerShell

## Objetivo

Validar manualmente el Sprint 2: autenticación con JWT, refresh token simple, perfil autenticado y control de acceso por roles desde backend.

## Endpoints probados

- POST /auth/login
- POST /auth/refresh
- GET /auth/profile
- GET /auth-test/admin-only
- GET /auth-test/doctor-only
- GET /auth-test/patient-only

## Usuarios probados

| Email | Rol | Resultado |
|---|---|---|
| admin@test.com | ADMIN | Login correcto |
| doctor@test.com | DOCTOR | Login correcto |
| patient@test.com | PATIENT | Login correcto |

## Checklist de validación

| Prueba | Resultado |
|---|---|
| Login admin con credenciales válidas | OK |
| Login doctor con credenciales válidas | OK |
| Login patient con credenciales válidas | OK |
| GET /auth/profile con token admin | OK |
| GET /auth/profile con token doctor | OK |
| GET /auth/profile con token patient | OK |
| POST /auth/refresh devuelve nuevo accessToken | OK |
| GET /auth/profile con nuevo accessToken | OK |
| GET /auth/profile sin token devuelve 401 | OK |
| POST /auth/login con password incorrecto devuelve 401 | OK |
| GET /auth/profile con token inválido devuelve 401 | OK |
| GET /auth-test/admin-only con token ADMIN devuelve 200 | OK |
| GET /auth-test/admin-only con token PATIENT devuelve 403 | OK |
| GET /auth-test/doctor-only con token DOCTOR devuelve 200 | OK |
| GET /auth-test/doctor-only con token ADMIN devuelve 403 | OK |
| GET /auth-test/patient-only con token PATIENT devuelve 200 | OK |

## Resultado

Sprint 2 validado correctamente.

El backend ya permite:
- iniciar sesión con usuarios seed;
- generar accessToken y refreshToken;
- consultar perfil autenticado;
- rechazar requests sin token o con token inválido;
- bloquear rutas por rol con 403;
- validar seguridad desde backend, no solo desde frontend.

## Nota

No se incluye salida completa de PowerShell porque contiene tokens JWT de sesión local.