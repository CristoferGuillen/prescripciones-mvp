# Prescripciones Médicas API

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-API-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Backend-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square)
![Neon](https://img.shields.io/badge/Database-Neon-00E599?style=flat-square)
![Status](https://img.shields.io/badge/Status-API%20Live-success?style=flat-square)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nestjs,typescript,postgres,prisma,nodejs,git&theme=light" alt="Tecnologías usadas en la API de Prescripciones Médicas" />
  </a>
</p>

**Prescripciones Médicas API** es el backend del proyecto **Prescripciones Médicas MVP**. Expone una API REST construida con **NestJS**, **Prisma** y **PostgreSQL** para gestionar autenticación, roles, usuarios demo, prescripciones, consumo de recetas, generación de PDF, filtros, paginación, métricas administrativas, health check, documentación Swagger/OpenAPI, rate limiting y pruebas e2e.

La API está desplegada en Render y conectada a una base de datos PostgreSQL gestionada en Neon.

## Demo API

| Recurso | URL |
|---|---|
| API pública | https://prescripciones-mvp.onrender.com |
| Swagger  | https://prescripciones-mvp.onrender.com/api/docs |
| Health  | https://prescripciones-mvp.onrender.com/health |
| Repositorio | https://github.com/CristoferGuillen/prescripciones-mvp |

> La ruta `/auth/profile` responde `401 Unauthorized` sin token. Ese comportamiento es esperado y confirma que la API está viva y protegida.

## Tabla de contenidos

- [Demo API](#demo-api)
- [Descripción general](#descripción-general)
- [Tecnologías](#tecnologías)
- [Módulos principales](#módulos-principales)
- [Variables de entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Base de datos](#base-de-datos)
- [Ejecución local](#ejecución-local)
- [Producción](#producción)
- [Usuarios demo](#usuarios-demo)
- [Endpoints principales](#endpoints-principales)
- [Respuesta paginada](#respuesta-paginada)
- [PDF de prescripción](#pdf-de-prescripción)
- [Métricas administrativas](#métricas-administrativas)
- [Reglas de negocio](#reglas-de-negocio)
- [Refresh token, rotación y logout](#refresh-token-rotación-y-logout)
- [Rate limiting](#rate-limiting)
- [Swagger / OpenAPI](#swagger--openapi)
- [Pruebas](#pruebas)
- [Comandos útiles](#comandos-útiles)
- [Estado](#estado)

## Descripción general

El backend permite cubrir el flujo principal del MVP:

| Paso | Actor | Acción backend |
|---|---|---|
| 1 | Usuario | Inicia sesión y recibe tokens |
| 2 | Médico | Consulta pacientes disponibles |
| 3 | Médico | Crea una prescripción |
| 4 | Paciente | Lista y filtra sus prescripciones |
| 5 | Paciente | Consulta el detalle de una prescripción |
| 6 | Paciente | Marca la prescripción como consumida |
| 7 | Paciente | Descarga o visualiza el PDF |
| 8 | Admin | Consulta métricas generales |

La seguridad principal vive en esta API: autenticación JWT, refresh token persistido, guards por rol y validación de acceso por propietario del recurso.

## Tecnologías

- **Node.js**
- **NestJS**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT**
- **Passport**
- **bcrypt**
- **pdfkit**
- **Swagger / OpenAPI**
- **@nestjs/throttler**
- **class-validator**
- **class-transformer**
- **Jest**
- **Supertest**
- **Render**
- **Neon PostgreSQL**

## Módulos principales

| Módulo | Responsabilidad |
|---|---|
| `auth` | Login, refresh token con rotación, logout, perfil autenticado y estrategia JWT |
| `users` | Consulta de usuarios filtrados por rol |
| `prescriptions` | Creación, listado, filtros, paginación, detalle, consumo y PDF |
| `admin` | Métricas administrativas del sistema |
| `health` | Verificación de estado de API y conexión con base de datos |
| `prisma` | Conexión centralizada con la base de datos |
| `common` | Guards, decoradores y tipos compartidos |

## Variables de entorno

Configuración local sugerida:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prescripciones_mvp?schema=public"
JWT_ACCESS_SECRET="change_me_access_secret"
JWT_REFRESH_SECRET="change_me_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

Variables usadas en Render:

```env
DATABASE_URL=connection_string_de_neon
JWT_ACCESS_SECRET=secret_access
JWT_REFRESH_SECRET=secret_refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://prescripciones-mvp.vercel.app
```

## Instalación

```bash
npm install
```

## Base de datos

```bash
npm run prisma:migrate
npm run prisma:seed
```

Para producción:

```bash
npm run prisma:deploy
npm run prisma:seed
```

Después de modificar el schema o agregar migraciones:

```bash
npx prisma generate
```

## Ejecución local

```bash
npm run start:dev
```

API local:

```txt
http://localhost:3001
```

Swagger local:

```txt
http://localhost:3001/api/docs
```

Health check:

```txt
http://localhost:3001/health
```

Build productivo:

```bash
npm run build
npm run start:prod
```

## Producción

La API se ejecuta en Render usando:

```txt
Build Command: npm install && npx prisma generate && npm run build
Start Command: npm run start:prod
```

## Usuarios demo

| Rol | Email | Password |
|---|---|---|
| ADMIN | `admin@test.com` | `admin123` |
| DOCTOR | `doctor@test.com` | `doctor123` |
| PATIENT | `patient@test.com` | `patient123` |
| PATIENT | `patient2@test.com` | `patient123` |

## Endpoints principales

### Sistema

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/` | Público | Información general de la API |
| `GET` | `/health` | Público | Estado de API y base de datos |
| `GET` | `/api/docs` | Público | Documentación Swagger/OpenAPI |

### Auth

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Inicia sesión, devuelve tokens y registra refresh token |
| `POST` | `/auth/refresh` | Público | Rota refresh token y devuelve nuevos tokens |
| `POST` | `/auth/logout` | Público | Revoca el refresh token enviado |
| `GET` | `/auth/profile` | Autenticado | Devuelve el usuario autenticado |

### Prescriptions

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/prescriptions` | ADMIN, DOCTOR | Crea una prescripción |
| `GET` | `/prescriptions` | ADMIN, DOCTOR, PATIENT | Lista prescripciones según rol |
| `GET` | `/prescriptions?status=PENDING` | ADMIN, DOCTOR, PATIENT | Lista pendientes según rol |
| `GET` | `/prescriptions?status=CONSUMED` | ADMIN, DOCTOR, PATIENT | Lista consumidas según rol |
| `GET` | `/prescriptions?page=1&limit=10` | ADMIN, DOCTOR, PATIENT | Lista con paginación simple |
| `GET` | `/prescriptions/:id` | ADMIN, DOCTOR, PATIENT | Consulta detalle con permisos |
| `PATCH` | `/prescriptions/:id/consume` | ADMIN, PATIENT | Marca como consumida |
| `GET` | `/prescriptions/:id/pdf` | ADMIN, DOCTOR, PATIENT | Descarga PDF con permisos |

### Users y Admin

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/users?role=PATIENT` | ADMIN, DOCTOR | Lista pacientes disponibles |
| `GET` | `/admin/metrics` | ADMIN | Devuelve métricas generales |

## Respuesta paginada

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "totalPages": 1
  }
}
```

## PDF de prescripción

`GET /prescriptions/:id/pdf` genera un documento PDF con datos del paciente, médico, estado, fecha de emisión, fecha de consumo, notas, medicamentos, dosis, frecuencia, duración e instrucciones.

Antes de generar el PDF, la API valida permisos por rol y propietario.

## Métricas administrativas

`GET /admin/metrics` devuelve totales, conteo por estado y conteo diario.

## Reglas de negocio

- Las rutas sensibles requieren JWT.
- El backend valida roles con guards.
- El paciente solo puede acceder a sus propias prescripciones.
- El paciente no puede consumir prescripciones ajenas.
- Una prescripción consumida no puede consumirse dos veces.
- El médico solo lista prescripciones creadas por él.
- El PDF reutiliza la validación de permisos del detalle.
- Las métricas administrativas requieren rol `ADMIN`.
- CORS se controla con `FRONTEND_URL` en producción.

## Refresh token, rotación y logout

El flujo actual de autenticación implementa refresh token robusto:

1. `POST /auth/login` genera `accessToken` y `refreshToken`.
2. El refresh token se guarda en base de datos como hash.
3. `POST /auth/refresh` valida firma, existencia, expiración, revocación y hash del refresh token.
4. Al refrescar, el token anterior queda revocado.
5. El backend emite un nuevo `accessToken` y un nuevo `refreshToken`.
6. `POST /auth/logout` revoca el refresh token enviado.
7. Un refresh token anterior, reutilizado o revocado responde `401 Unauthorized`.

## Rate limiting

| Endpoint | Límite |
|---|---:|
| API general | 100 solicitudes por minuto |
| `POST /auth/login` | 5 solicitudes por minuto |
| `POST /auth/refresh` | 10 solicitudes por minuto |
| `GET /prescriptions/:id/pdf` | 20 solicitudes por minuto |

Respuesta esperada cuando se supera el límite:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## Swagger / OpenAPI

La API expone documentación interactiva:

```txt
https://prescripciones-mvp.onrender.com/api/docs
```

Desde Swagger se puede:

- revisar módulos y endpoints,
- probar login,
- copiar el access token,
- autorizar con Bearer Auth,
- probar endpoints protegidos.

## Pruebas

Ejecutar pruebas unitarias:

```bash
npm run test
```

Ejecutar pruebas e2e:

```bash
npm run test:e2e
```

Las pruebas e2e cubren:

- información general de API,
- health check,
- login,
- credenciales inválidas,
- profile,
- refresh token con rotación,
- logout,
- creación de prescripción,
- listado,
- permisos por propietario,
- descarga de PDF,
- consumo de prescripción,
- bloqueo de doble consumo,
- métricas admin,
- bloqueo de métricas para médico y paciente.

Resultado esperado:

```txt
Test Suites: 1 passed, 1 total
Tests: 20 passed, 20 total
```

## Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Ejecuta la API en modo desarrollo |
| `npm run build` | Compila el backend |
| `npm run start:prod` | Ejecuta el backend compilado |
| `npm run test` | Ejecuta pruebas unitarias |
| `npm run test:e2e` | Ejecuta pruebas e2e |
| `npm run prisma:migrate` | Ejecuta migraciones Prisma en local |
| `npm run prisma:deploy` | Aplica migraciones en producción |
| `npm run prisma:seed` | Carga datos iniciales |
| `npm run prisma:studio` | Abre Prisma Studio |

## Estado

API funcional y desplegada para el MVP de prescripciones médicas.

Últimas mejoras documentadas:

| Mejora | Estado |
|---|---|
| Health check | Completado |
| Swagger/OpenAPI | Completado |
| Rate limiting | Completado |
| Refresh token con rotación y logout | Completado |
| Pruebas e2e | Completado |
