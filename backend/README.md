# Prescripciones Médicas API

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-API-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Backend-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square)
![Neon](https://img.shields.io/badge/Database-Neon-00E599?style=flat-square)
![Status](https://img.shields.io/badge/Status-API%20Live-success?style=flat-square)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nestjs,typescript,postgres,prisma,nodejs,git&theme=light" alt="Tecnologías usadas en la API de Prescripciones Médicas" />
  </a>
</p>

**Prescripciones Médicas API** es el backend del proyecto **Prescripciones Médicas MVP**. Expone una API REST construida con **NestJS**, **Prisma** y **PostgreSQL** para gestionar autenticación, roles, usuarios demo, prescripciones, consumo de recetas, generación de PDF, filtros, paginación y métricas administrativas.

La API está desplegada en Render y conectada a una base de datos PostgreSQL gestionada en Neon.

## Demo API

| Recurso | URL |
|---|---|
| API pública | https://prescripciones-mvp.onrender.com |
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

La seguridad principal vive en esta API: autenticación JWT, guards por rol y validación de acceso por propietario del recurso.

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
- **class-validator**
- **class-transformer**
- **Render**
- **Neon PostgreSQL**

## Módulos principales

| Módulo | Responsabilidad |
|---|---|
| `auth` | Login, refresh token, perfil autenticado y estrategia JWT |
| `users` | Consulta de usuarios filtrados por rol |
| `prescriptions` | Creación, listado, filtros, paginación, detalle, consumo y PDF |
| `admin` | Métricas administrativas del sistema |
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
FRONTEND_URL="http://localhost:3000"
```

Variables usadas en Render:

```env
DATABASE_URL=connection_string_de_neon
JWT_ACCESS_SECRET=secret_access
JWT_REFRESH_SECRET=secret_refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
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

## Ejecución local

```bash
npm run start:dev
```

API local:

```txt
http://localhost:3001
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

### Auth

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Inicia sesión y devuelve tokens |
| `POST` | `/auth/refresh` | Público | Genera un nuevo access token |
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
| `GET` | `/prescriptions/:id/pdf` | ADMIN, DOCTOR, PATIENT | Descarga PDF |

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

## Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Ejecuta la API en modo desarrollo |
| `npm run build` | Compila el backend |
| `npm run start:prod` | Ejecuta el backend compilado |
| `npm run prisma:migrate` | Ejecuta migraciones Prisma en local |
| `npm run prisma:deploy` | Aplica migraciones en producción |
| `npm run prisma:seed` | Carga datos iniciales |
| `npm run prisma:studio` | Abre Prisma Studio |

## Estado

API funcional y desplegada para el MVP de prescripciones médicas.
