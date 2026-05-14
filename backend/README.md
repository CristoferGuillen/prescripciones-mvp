# Prescripciones Médicas API

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-API-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Backend-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![PDF](https://img.shields.io/badge/PDF-pdfkit-red?style=flat-square)
![Status](https://img.shields.io/badge/Status-API%20Funcional-success?style=flat-square)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nestjs,typescript,postgres,prisma,nodejs,git&theme=light" alt="Tecnologías usadas en la API de Prescripciones Médicas" />
  </a>
</p>

**Prescripciones Médicas API** es el backend del proyecto **Prescripciones Médicas MVP**. Expone una API REST construida con **NestJS**, **Prisma** y **PostgreSQL** para gestionar autenticación, roles, usuarios demo, prescripciones, consumo de recetas, generación de PDF, filtros, paginación y métricas administrativas.

Esta API concentra las reglas de negocio y seguridad del sistema. El frontend consume sus endpoints para operar el flujo médico-paciente-administrador desde el navegador.

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Tecnologías](#tecnologías)
- [Módulos principales](#módulos-principales)
- [Modelo de permisos](#modelo-de-permisos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Base de datos](#base-de-datos)
- [Ejecución local](#ejecución-local)
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
| 4 | Paciente | Lista sus prescripciones |
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

## Módulos principales

| Módulo | Responsabilidad |
|---|---|
| `auth` | Login, refresh token, perfil autenticado y estrategia JWT |
| `users` | Consulta de usuarios filtrados por rol |
| `prescriptions` | Creación, listado, filtros, paginación, detalle, consumo y PDF |
| `admin` | Métricas administrativas del sistema |
| `prisma` | Conexión centralizada con la base de datos |
| `common` | Guards, decoradores y tipos compartidos |

## Modelo de permisos

| Rol | Permisos principales |
|---|---|
| `ADMIN` | Consulta métricas y tiene visibilidad global de prescripciones |
| `DOCTOR` | Consulta pacientes, crea prescripciones y lista recetas creadas por su perfil |
| `PATIENT` | Lista sus prescripciones, consulta detalle, consume recetas propias y descarga PDF |

## Variables de entorno

Crea el archivo:

```txt
backend/.env
```

Puedes copiarlo desde:

```txt
backend/.env.example
```

Configuración sugerida:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prescripciones_mvp?schema=public"
JWT_ACCESS_SECRET="change_me_access_secret"
JWT_REFRESH_SECRET="change_me_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
```

Ajusta usuario, contraseña, host, puerto o nombre de base de datos según tu entorno local.

## Instalación

Desde la carpeta `backend`:

```bash
npm install
```

## Base de datos

Ejecutar migraciones:

```bash
npm run prisma:migrate
```

Ejecutar seed:

```bash
npm run prisma:seed
```

Abrir Prisma Studio:

```bash
npm run prisma:studio
```

Reconstruir la base local y volver a cargar datos iniciales:

```bash
npx prisma migrate reset
```

El seed crea usuarios demo, perfiles de médico/paciente y prescripciones distribuidas entre estados `PENDING` y `CONSUMED`.

## Ejecución local

Modo desarrollo:

```bash
npm run start:dev
```

La API queda disponible en:

```txt
http://localhost:3001
```

Compilar backend:

```bash
npm run build
```

Ejecutar build compilado:

```bash
npm run start:prod
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

### Users

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/users?role=PATIENT` | ADMIN, DOCTOR | Lista pacientes disponibles para crear prescripciones |

### Prescriptions

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/prescriptions` | ADMIN, DOCTOR | Crea una prescripción |
| `GET` | `/prescriptions` | ADMIN, DOCTOR, PATIENT | Lista prescripciones según rol |
| `GET` | `/prescriptions?status=PENDING` | ADMIN, DOCTOR, PATIENT | Lista prescripciones pendientes según rol |
| `GET` | `/prescriptions?status=CONSUMED` | ADMIN, DOCTOR, PATIENT | Lista prescripciones consumidas según rol |
| `GET` | `/prescriptions?page=1&limit=10` | ADMIN, DOCTOR, PATIENT | Lista prescripciones con paginación simple |
| `GET` | `/prescriptions/:id` | ADMIN, DOCTOR, PATIENT | Consulta detalle con validación de permisos |
| `PATCH` | `/prescriptions/:id/consume` | ADMIN, PATIENT | Marca una prescripción como consumida |
| `GET` | `/prescriptions/:id/pdf` | ADMIN, DOCTOR, PATIENT | Descarga PDF de la prescripción |

### Admin

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/admin/metrics` | ADMIN | Devuelve métricas generales del sistema |

## Respuesta paginada

`GET /prescriptions` devuelve una estructura paginada:

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

Parámetros soportados:

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `status` | `PENDING` | Filtra por estado |
| `page` | `1` | Página actual |
| `limit` | `10` | Cantidad de registros por página |

## PDF de prescripción

El endpoint:

```txt
GET /prescriptions/:id/pdf
```

genera un documento PDF con:

- código de prescripción;
- ID;
- fecha de emisión;
- estado;
- fecha de consumo;
- datos del paciente;
- datos del médico;
- notas;
- medicamentos;
- dosis;
- frecuencia;
- duración;
- instrucciones.

## Métricas administrativas

El endpoint:

```txt
GET /admin/metrics
```

devuelve:

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
      "date": "2026-05-14",
      "count": 4
    }
  ]
}
```

## Reglas de negocio

- Las rutas sensibles requieren JWT.
- El backend valida roles con guards.
- El paciente solo puede acceder a sus propias prescripciones.
- El paciente no puede consumir prescripciones ajenas.
- Una prescripción consumida no puede consumirse dos veces.
- El médico solo lista prescripciones creadas por él.
- El PDF reutiliza la validación de permisos del detalle.
- Las métricas administrativas requieren rol `ADMIN`.
- Los filtros y la paginación respetan las reglas de acceso por rol.

## Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Ejecuta la API en modo desarrollo |
| `npm run build` | Compila el backend |
| `npm run start:prod` | Ejecuta el backend compilado |
| `npm run prisma:migrate` | Ejecuta migraciones Prisma |
| `npm run prisma:seed` | Carga datos iniciales |
| `npm run prisma:studio` | Abre Prisma Studio |
| `npm run test` | Ejecuta tests configurados por NestJS |

## Estado

API funcional para el MVP de prescripciones médicas.

Incluye autenticación, roles, prescripciones, PDF, métricas, seed demo, filtros por estado y paginación simple.
