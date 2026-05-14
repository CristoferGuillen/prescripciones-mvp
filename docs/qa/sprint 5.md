# Sprint 5 - Pruebas manuales de frontend login y rutas por rol

Fecha: 2026-05-14  
Entorno: Local  
Frontend: http://localhost:3000  
Backend: http://localhost:3001  
Herramienta: Navegador web

## Objetivo

Validar manualmente el Sprint 5: login desde frontend, persistencia de sesión en localStorage, redirección por rol, protección básica de rutas y cierre de sesión.

## Usuarios probados

| Email | Rol | Ruta esperada |
|---|---|---|
| admin@test.com | ADMIN | /admin |
| doctor@test.com | DOCTOR | /doctor/prescriptions |
| patient@test.com | PATIENT | /patient/prescriptions |
| patient2@test.com | PATIENT | /patient/prescriptions |

## Checklist de validación

| Prueba | Resultado |
|---|---|
| / redirige a /login | OK |
| Login admin redirige a /admin | OK |
| Login doctor redirige a /doctor/prescriptions | OK |
| Login patient redirige a /patient/prescriptions | OK |
| Login patient2 redirige a /patient/prescriptions | OK |
| Se guarda prescripciones_mvp_session en localStorage | OK |
| La sesión contiene accessToken, refreshToken y user | OK |
| Logout limpia localStorage | OK |
| Logout vuelve a /login | OK |
| /admin sin sesión redirige a /login | OK |
| /doctor/prescriptions sin sesión redirige a /login | OK |
| /patient/prescriptions sin sesión redirige a /login | OK |
| DOCTOR no puede quedarse en /admin | OK |
| PATIENT no puede quedarse en /admin | OK |
| PATIENT no puede quedarse en /doctor/prescriptions | OK |
| Credenciales inválidas muestran error | OK |
| Credenciales inválidas no guardan sesión | OK |
| Recargar página mantiene sesión activa | OK |
| Entrar a /login con sesión activa redirige según rol | OK |

## Resultado

Sprint 5 validado correctamente.

El frontend ya permite:
- iniciar sesión con usuarios demo;
- guardar sesión en localStorage;
- redirigir usuarios según rol;
- proteger rutas básicas desde el cliente;
- mantener sesión al recargar;
- cerrar sesión correctamente;
- mostrar error cuando las credenciales son inválidas.

## Nota

La protección principal sigue viviendo en backend mediante JWT y RBAC. La protección de frontend es una capa de experiencia de usuario para evitar navegación accidental.