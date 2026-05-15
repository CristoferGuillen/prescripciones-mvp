# Prescripciones Médicas MVP

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Fullstack-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render%20%2B%20Neon-success?style=flat-square)
![Status](https://img.shields.io/badge/Status-MVP%20Funcional-success?style=flat-square)
![Technical Test](https://img.shields.io/badge/Prueba-T%C3%A9cnica-blueviolet?style=flat-square)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nestjs,nextjs,typescript,postgres,prisma,tailwind,nodejs,git&theme=light" alt="Tecnologías usadas en Prescripciones Médicas MVP" />
  </a>
</p>

**Prescripciones Médicas MVP** es una aplicación full stack desarrollada como prueba técnica para gestionar un flujo digital de prescripciones médicas entre administradores, médicos y pacientes.

El sistema permite autenticar usuarios por rol, crear prescripciones desde el perfil médico, consultar recetas desde el perfil paciente, filtrar y paginar listados, marcar prescripciones como consumidas, ver o descargar un PDF generado desde backend y visualizar métricas operativas desde un dashboard administrativo.

El proyecto fue construido con enfoque MVP: una entrega funcional, clara, demostrable y desplegada, orientada a validar el flujo principal de extremo a extremo.

---

## Demo en línea

| Recurso | URL |
|---|---|
| Frontend | https://prescripciones-mvp.vercel.app |
| Backend API | https://prescripciones-mvp.onrender.com |
| Swagger / OpenAPI | `http://localhost:3001/api/docs` |
| Repositorio | https://github.com/CristoferGuillen/prescripciones-mvp |

> La documentación Swagger queda disponible en local en `/api/docs` y estará disponible en producción después de publicar los últimos cambios del backend.

### Credenciales demo

| Rol | Email | Password | Ruta esperada |
|---|---|---|---|
| Administrador | `admin@test.com` | `admin123` | `/admin` |
| Médico | `doctor@test.com` | `doctor123` | `/doctor/prescriptions` |
| Paciente | `patient@test.com` | `patient123` | `/patient/prescriptions` |
| Paciente 2 | `patient2@test.com` | `patient123` | `/patient/prescriptions` |

---

## Tabla de contenidos

- [Demo en línea](#demo-en-línea)
- [Descripción general](#descripción-general)
- [Objetivo de la prueba técnica](#objetivo-de-la-prueba-técnica)
- [Tecnologías](#tecnologías)
- [Funcionalidades principales](#funcionalidades-principales)
- [Roles del sistema](#roles-del-sistema)
- [Modelo del dominio](#modelo-del-dominio)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Arquitectura de despliegue](#arquitectura-de-despliegue)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Instalación y configuración](#instalación-y-configuración)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Rutas del frontend](#rutas-del-frontend)
- [Endpoints principales](#endpoints-principales)
- [Respuesta paginada](#respuesta-paginada)
- [Flujo de prueba recomendado](#flujo-de-prueba-recomendado)
- [Seguridad y permisos](#seguridad-y-permisos)
- [Rate limiting](#rate-limiting)
- [Pruebas automatizadas](#pruebas-automatizadas)
- [Documentación adicional](#documentación-adicional)
- [Evidencia QA](#evidencia-qa)
- [Estado de entrega](#estado-de-entrega)
- [Proyección del producto](#proyección-del-producto)
- [Autor](#autor)

---

## Descripción general

Prescripciones Médicas MVP centraliza el proceso básico de emisión, consulta, consumo y descarga de recetas médicas digitales.

La aplicación está organizada en tres experiencias principales:

- **Administrador:** consulta métricas generales del sistema desde un dashboard visual.
- **Médico:** revisa, filtra y pagina sus prescripciones; también crea nuevas recetas para pacientes existentes.
- **Paciente:** consulta sus prescripciones, filtra por estado, revisa el detalle, confirma el consumo de recetas y puede ver o descargar el PDF correspondiente.

El sistema prioriza una experiencia sobria y directa, con reglas de negocio protegidas desde backend y una interfaz web preparada para demostrar el flujo completo desde una URL pública.

---

## Objetivo de la prueba técnica

El objetivo de esta prueba técnica fue construir un MVP full stack que demuestre dominio de:

- diseño de base de datos relacional;
- autenticación con JWT;
- refresh token con persistencia, hash, rotación y revocación;
- autorización basada en roles;
- reglas de negocio desde backend;
- consumo de API REST desde frontend;
- documentación Swagger/OpenAPI;
- generación de PDF;
- filtros y paginación simple;
- manejo de estados y feedback visual;
- dashboard administrativo;
- despliegue full stack;
- documentación técnica;
- validación del flujo principal mediante pruebas manuales y e2e.

El flujo funcional principal es:

| Paso | Actor | Acción |
|---|---|---|
| 1 | Médico | Inicia sesión |
| 2 | Médico | Consulta, filtra y pagina sus prescripciones |
| 3 | Médico | Crea una prescripción para un paciente existente |
| 4 | Paciente | Inicia sesión |
| 5 | Paciente | Consulta y filtra sus prescripciones |
| 6 | Paciente | Abre el detalle de la prescripción |
| 7 | Paciente | Confirma y marca la prescripción como consumida |
| 8 | Paciente | Ve o descarga el PDF de la prescripción |
| 9 | Administrador | Inicia sesión |
| 10 | Administrador | Revisa métricas actualizadas |

---

## Tecnologías

### Backend

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

### Frontend

- **Next.js App Router**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Fetch API**
- **localStorage para sesión MVP**

### Despliegue

- **Vercel** para frontend.
- **Render** para backend.
- **Neon PostgreSQL** para base de datos.

---

## Funcionalidades principales

### Autenticación y roles

- Login con email y contraseña.
- Access token con JWT.
- Refresh token persistido en base de datos.
- Hash seguro del refresh token.
- Rotación de refresh token en cada renovación.
- Revocación del refresh token anterior.
- Logout con revocación del refresh token.
- Consulta de perfil autenticado.
- Persistencia de sesión en frontend.
- Refresh automático de sesión desde frontend cuando una petición protegida recibe `401`.
- Cierre de sesión desde la interfaz.
- Redirección automática según rol.
- Guards de autenticación y roles.
- Decoradores `@Roles()` y `CurrentUser`.
- Roles `ADMIN`, `DOCTOR` y `PATIENT`.

### Prescripciones

- Creación de prescripciones por médico.
- Selección de paciente existente.
- Registro de notas generales.
- Registro de medicamentos, dosis, frecuencia, duración e instrucciones.
- Listados filtrados por rol.
- Filtros por estado: todas, pendientes y consumidas.
- Paginación simple en backend y frontend.
- Detalle de prescripción.
- Confirmación antes de consumir.
- Prevención de consumo duplicado.
- Estados vacíos contextuales.
- Mensajes de éxito y error.

### PDF

- Generación de PDF desde backend.
- Visualización de PDF desde frontend en nueva pestaña.
- Descarga de PDF desde frontend.
- Validación de permisos antes de generar el documento.
- Rate limiting específico para descarga de PDF.

### Dashboard administrativo

- Total de médicos, pacientes y prescripciones.
- Conteo de pendientes y consumidas.
- Porcentajes por estado.
- Barra visual de progreso de consumo.
- Promedio diario.
- Día con más recetas.
- Tabla por día.
- Última actualización.
- Botón para actualizar métricas.

### Sistema y documentación técnica

- Endpoint raíz con información general de la API.
- Health check en `/health`.
- Swagger/OpenAPI en `/api/docs`.
- Pruebas e2e del flujo principal.

---

## Roles del sistema

| Rol | Descripción | Funciones principales |
|---|---|---|
| `ADMIN` | Usuario administrativo | Consulta dashboard de métricas y tiene visibilidad global del sistema |
| `DOCTOR` | Médico emisor | Crea prescripciones, lista y filtra sus recetas, pagina resultados y puede descargar PDFs propios |
| `PATIENT` | Paciente receptor | Consulta sus recetas, filtra por estado, revisa detalle, confirma consumo, ve PDF y descarga PDF |

---

## Modelo del dominio

| Entidad | Propósito |
|---|---|
| `User` | Usuario autenticable del sistema con email, password, nombre y rol |
| `Doctor` | Perfil médico asociado a un usuario con rol `DOCTOR` |
| `Patient` | Perfil paciente asociado a un usuario con rol `PATIENT` |
| `Prescription` | Prescripción creada por un médico para un paciente |
| `PrescriptionItem` | Medicamento o indicación incluida dentro de una prescripción |
| `RefreshToken` | Sesión renovable guardada como hash, con expiración y posible revocación |

### Estados de prescripción

| Estado | Descripción |
|---|---|
| `PENDING` | Prescripción pendiente de consumo |
| `CONSUMED` | Prescripción marcada como consumida |

---

## Arquitectura del proyecto

| Aplicación | Tecnología | Responsabilidad |
|---|---|---|
| `backend` | NestJS | API REST, autenticación, refresh token, roles, reglas de negocio, Prisma, PDF, filtros, paginación, Swagger, rate limiting, health check, pruebas e2e y métricas |
| `frontend` | Next.js | Interfaz web, login, navegación por rol, consumo de API, refresh automático, logout, filtros, paginación y flujo visual |

El backend centraliza la seguridad y las reglas del sistema. El frontend consume la API y presenta una experiencia clara para cada rol.

---

## Arquitectura de despliegue

| Componente | Plataforma | URL / Configuración |
|---|---|---|
| Frontend | Vercel | https://prescripciones-mvp.vercel.app |
| Backend API | Render | https://prescripciones-mvp.onrender.com |
| Base de datos | Neon PostgreSQL | `DATABASE_URL` configurado en Render |

Variables clave en producción:

| Servicio | Variable | Valor |
|---|---|---|
| Vercel | `NEXT_PUBLIC_API_URL` | `https://prescripciones-mvp.onrender.com` |
| Render | `DATABASE_URL` | Connection string de Neon |
| Render | `FRONTEND_URL` | URL exacta del frontend en Vercel |
| Render | `JWT_ACCESS_SECRET` | Secreto JWT access |
| Render | `JWT_REFRESH_SECRET` | Secreto JWT refresh |
| Render | `JWT_ACCESS_EXPIRES_IN` | Tiempo de expiración del access token |
| Render | `JWT_REFRESH_EXPIRES_IN` | Tiempo de expiración del refresh token |

---

## Estructura del repositorio

```text
prescripciones-mvp/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── health/
│   │   ├── prescriptions/
│   │   ├── prisma/
│   │   └── users/
│   ├── test/
│   ├── .env.example
│   ├── README.md
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.example
│   ├── README.md
│   └── package.json
│
├── docs/
│   └── qa/
├── .gitignore
└── README.md
```

---

## Instalación y configuración

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Variables backend:

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

Servicios locales del backend:

| Recurso | URL |
|---|---|
| API | `http://localhost:3001` |
| Swagger | `http://localhost:3001/api/docs` |
| Health check | `http://localhost:3001/health` |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Variable frontend:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## Credenciales de prueba

| Rol | Email | Password | Ruta esperada |
|---|---|---|---|
| Administrador | `admin@test.com` | `admin123` | `/admin` |
| Médico | `doctor@test.com` | `doctor123` | `/doctor/prescriptions` |
| Paciente | `patient@test.com` | `patient123` | `/patient/prescriptions` |
| Paciente 2 | `patient2@test.com` | `patient123` | `/patient/prescriptions` |

---

## Rutas del frontend

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Redirige a login |
| `/login` | Público | Inicio de sesión |
| `/admin` | ADMIN | Dashboard administrativo mejorado |
| `/doctor/prescriptions` | DOCTOR | Listado de prescripciones del médico con filtros y paginación |
| `/doctor/prescriptions/new` | DOCTOR | Crear nueva prescripción |
| `/patient/prescriptions` | PATIENT | Listado de prescripciones del paciente con filtros y paginación |
| `/patient/prescriptions/:id` | PATIENT | Detalle, consumo con confirmación, ver PDF y descargar PDF |

---

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
| `POST` | `/auth/login` | Público | Autentica usuario, devuelve tokens y registra refresh token |
| `POST` | `/auth/refresh` | Público | Rota refresh token y genera nuevos tokens |
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
| `GET` | `/prescriptions/:id` | ADMIN, DOCTOR, PATIENT | Muestra detalle con permisos |
| `PATCH` | `/prescriptions/:id/consume` | ADMIN, PATIENT | Marca como consumida |
| `GET` | `/prescriptions/:id/pdf` | ADMIN, DOCTOR, PATIENT | Descarga PDF con permisos |

### Users y Admin

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/users?role=PATIENT` | ADMIN, DOCTOR | Lista pacientes disponibles |
| `GET` | `/admin/metrics` | ADMIN | Devuelve métricas generales |

---

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

---

## Flujo de prueba recomendado

1. Login como médico con `doctor@test.com / doctor123`.
2. Crear una prescripción para `patient@test.com`.
3. Cerrar sesión.
4. Login como paciente con `patient@test.com / patient123`.
5. Filtrar prescripciones, abrir detalle y confirmar consumo.
6. Usar **Ver PDF** y **Descargar PDF**.
7. Cerrar sesión.
8. Login como admin con `admin@test.com / admin123`.
9. Revisar dashboard y actualizar métricas.

---

## Seguridad y permisos

| Área | Implementación |
|---|---|
| Passwords | Hash con bcrypt |
| Autenticación | JWT access token |
| Sesión | Refresh token persistido, hasheado, rotado y revocable |
| Logout | Revocación del refresh token en backend |
| Autorización | Guards y roles |
| Decoradores | `@Roles()` y `CurrentUser` |
| Validación | DTOs con class-validator |
| Recursos | Validación por propietario y rol |
| CORS producción | Variable `FRONTEND_URL` |
| Seguridad HTTP | Helmet |
| Rate limiting | Global, login, refresh y PDF |

---

## Rate limiting

| Recurso | Límite |
|---|---:|
| API general | 100 solicitudes por minuto |
| Login | 5 solicitudes por minuto |
| Refresh token | 10 solicitudes por minuto |
| Descarga de PDF | 20 solicitudes por minuto |

Respuesta cuando se supera el límite:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## Pruebas automatizadas

El backend cuenta con pruebas e2e para validar el flujo crítico.

```bash
cd backend
npm run test
npm run test:e2e
```

Cobertura e2e actual:

| Área | Validación |
|---|---|
| Sistema | Información general de API y health check |
| Auth | Login, credenciales inválidas, profile, refresh con rotación y logout |
| Prescripciones | Crear, listar, detalle, permisos, PDF, consumo y doble consumo |
| Admin | Métricas solo para administrador |

Resultado esperado:

```text
Test Suites: 1 passed, 1 total
Tests: 20 passed, 20 total
```

---

## Documentación adicional

| Archivo | Propósito |
|---|---|
| `backend/README.md` | Documentación específica de la API NestJS |
| `frontend/README.md` | Documentación específica de la interfaz Next.js |

---

## Evidencia QA

| Archivo | Validación |
|---|---|
| `Sprint 2.md` | Autenticación, JWT, refresh token y roles |
| `Sprint 3.md` | Prescripciones backend y validación de permisos |
| `sprint 4.md` | PDF y métricas admin |
| `sprint 5.md` | Login frontend, sesión y rutas por rol |
| `sprint 6.md` | Flujo médico-paciente en frontend |
| `sprint 7.md` | Seed demo, filtros y paginación backend |
| `sprint 8.md` | Listados frontend con filtros, paginación y feedback |
| `sprint 9.md` | Detalle del paciente, confirmación de consumo y acciones PDF |

---

## Estado de entrega

MVP completado, mejorado, desplegado y validado manualmente y mediante pruebas e2e.

| Módulo | Estado |
|---|---|
| Auth JWT y RBAC | Completado |
| Refresh token con rotación y logout | Completado |
| Health check | Completado |
| Swagger/OpenAPI | Completado |
| Rate limiting | Completado |
| Prescripciones backend | Completado |
| Filtros y paginación | Completado |
| PDF backend | Completado |
| Métricas admin | Completado |
| Login y rutas por rol | Completado |
| Flujo médico-paciente | Completado |
| Dashboard admin mejorado | Completado |
| Pruebas e2e | Completado |
| Deploy frontend | Completado |
| Deploy backend | Completado |
| Base de datos cloud | Completado |
| Documentación | Completado |
| QA manual | Completado |

---

## Proyección del producto

El MVP deja una base sólida para evolucionar hacia una plataforma de prescripciones médicas más completa.

Posibles siguientes mejoras:

- administración visual de usuarios;
- catálogo de medicamentos;
- búsqueda avanzada;
- auditoría de acciones;
- firma digital;
- QR de validación;
- notificaciones;
- ampliar cobertura de pruebas automatizadas;
- Docker Compose completo para ejecución local.

---

## Autor

Desarrollado por **Cristofer Guillen**.

- GitHub: [@CristoferGuillen](https://github.com/CristoferGuillen)
- Repositorio: [prescripciones-mvp](https://github.com/CristoferGuillen/prescripciones-mvp)
