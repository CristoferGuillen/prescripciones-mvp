# Prescripciones Médicas MVP

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Fullstack-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Status-MVP%20Funcional-success?style=flat-square)
![Technical Test](https://img.shields.io/badge/Prueba-T%C3%A9cnica-blueviolet?style=flat-square)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nestjs,nextjs,typescript,postgres,prisma,tailwind,nodejs,git&theme=light" alt="Tecnologías usadas en Prescripciones Médicas MVP" />
  </a>
</p>

**Prescripciones Médicas MVP** es una aplicación full stack construida como prueba técnica para gestionar el flujo básico de prescripciones médicas entre administradores, médicos y pacientes.

El sistema permite autenticar usuarios por rol, crear prescripciones desde el perfil médico, consultar prescripciones desde el perfil paciente, marcar recetas como consumidas, descargar un PDF generado desde backend y visualizar métricas administrativas en un dashboard.

> Este proyecto fue desarrollado con enfoque MVP: una entrega funcional, clara, demostrable y orientada a cubrir el flujo principal end-to-end solicitado en la prueba técnica.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Objetivo de la prueba técnica](#objetivo-de-la-prueba-técnica)
- [Características principales](#características-principales)
- [Flujo funcional](#flujo-funcional)
- [Roles del sistema](#roles-del-sistema)
- [Arquitectura general](#arquitectura-general)
- [Modelo de dominio](#modelo-de-dominio)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Base de datos](#base-de-datos)
- [Ejecución local](#ejecución-local)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Rutas del frontend](#rutas-del-frontend)
- [Endpoints principales](#endpoints-principales)
- [Flujo de prueba recomendado](#flujo-de-prueba-recomendado)
- [Comandos útiles](#comandos-útiles)
- [Seguridad implementada](#seguridad-implementada)
- [Decisiones técnicas](#decisiones-técnicas)
- [Alcance MVP](#alcance-mvp)
- [Evidencia QA](#evidencia-qa)
- [Estado de entrega](#estado-de-entrega)
- [Autor](#autor)

---

## Descripción general

**Prescripciones Médicas MVP** centraliza el proceso básico de emisión, consulta y consumo de prescripciones médicas.

La aplicación está diseñada alrededor de tres perfiles principales:

- **Administrador:** consulta métricas generales del sistema.
- **Médico:** crea prescripciones para pacientes existentes.
- **Paciente:** consulta sus prescripciones, revisa el detalle, marca una receta como consumida y descarga el PDF correspondiente.

El producto prioriza una experiencia clara, segura y demostrable, con separación entre backend y frontend, validación de permisos desde servidor y documentación preparada para facilitar la evaluación técnica.

---

## Objetivo de la prueba técnica

El objetivo de esta prueba fue construir un MVP funcional de punta a punta para demostrar capacidades full stack en:

- diseño de base de datos relacional;
- autenticación con JWT;
- control de acceso por roles;
- reglas de negocio en backend;
- consumo de API desde frontend;
- generación de documentos PDF;
- dashboard administrativo;
- documentación y validación manual del flujo completo.

El flujo principal esperado es:

```text
Médico crea prescripción
Paciente visualiza prescripción
Paciente marca como consumida
Paciente descarga PDF
Administrador revisa métricas actualizadas
```

---

## Características principales

### Autenticación y sesión

- Login con email y contraseña.
- Passwords protegidas con bcrypt.
- Access token con JWT.
- Refresh token simple.
- Perfil autenticado.
- Persistencia de sesión en frontend con localStorage.
- Logout desde interfaz.

### Control de acceso por roles

- Roles disponibles:
  - `ADMIN`
  - `DOCTOR`
  - `PATIENT`
- Guards en backend.
- Decorador `@Roles()`.
- Decorador `CurrentUser`.
- Validación de permisos por rol.
- Redirección por rol desde frontend.
- Protección básica de rutas en cliente.

### Prescripciones médicas

- Creación de prescripciones por médico.
- Selección de paciente existente.
- Registro de notas generales.
- Registro de uno o varios medicamentos.
- Listado de prescripciones por rol.
- Detalle de prescripción.
- Cambio de estado a consumida.
- Bloqueo de consumo duplicado.
- Bloqueo de acceso a prescripciones ajenas.

### PDF desde backend

- Generación de PDF con pdfkit.
- Descarga protegida por permisos.
- PDF con:
  - código de prescripción;
  - ID;
  - fecha de emisión;
  - estado;
  - fecha de consumo;
  - datos del paciente;
  - datos del médico;
  - notas;
  - medicamentos, dosis, frecuencia, duración e instrucciones.

### Dashboard administrativo

- Cards con totales generales.
- Conteo de prescripciones por estado.
- Tabla de prescripciones por día.
- Botón para actualizar métricas.
- Acceso exclusivo para administradores.

### Evidencia QA

- Pruebas manuales documentadas por sprint.
- Validación funcional de backend.
- Validación funcional de frontend.
- Validación del flujo completo end-to-end.

---

## Flujo funcional

```mermaid
flowchart LR
    A[Login] --> B{Rol del usuario}

    B -->|ADMIN| C[Dashboard admin]
    C --> C1[Ver métricas]
    C --> C2[Totales y estados]

    B -->|DOCTOR| D[Listado médico]
    D --> E[Crear prescripción]
    E --> F[Seleccionar paciente]
    F --> G[Agregar medicamentos]
    G --> H[Prescripción creada]

    B -->|PATIENT| I[Listado paciente]
    I --> J[Detalle de prescripción]
    J --> K[Marcar como consumida]
    J --> L[Descargar PDF]

    H --> I
    K --> C
```

---

## Roles del sistema

| Rol | Descripción | Capacidades principales |
|---|---|---|
| `ADMIN` | Usuario administrativo del sistema | Ver métricas, listar prescripciones globales, acceder a información administrativa |
| `DOCTOR` | Médico responsable de crear recetas | Consultar pacientes, crear prescripciones, listar sus prescripciones y descargar PDFs propios |
| `PATIENT` | Paciente receptor de prescripciones | Ver sus recetas, consultar detalle, marcar como consumida y descargar PDF propio |

---

## Arquitectura general

El proyecto usa una arquitectura separada por aplicaciones:

```text
Frontend Next.js  --->  API NestJS  --->  Prisma ORM  --->  PostgreSQL
       |                    |
       |                    ├── Auth JWT
       |                    ├── RBAC
       |                    ├── Prescriptions
       |                    ├── PDF generation
       |                    └── Admin metrics
       |
       └── localStorage session MVP
```

### Backend

El backend expone una API REST construida con NestJS. Centraliza autenticación, reglas de negocio, permisos, generación de PDF y métricas administrativas.

### Frontend

El frontend está construido con Next.js App Router. Consume la API REST, gestiona sesión en localStorage y presenta interfaces separadas por rol.

### Base de datos

La persistencia usa PostgreSQL con Prisma ORM. El modelo se centra en usuarios, médicos, pacientes, prescripciones e items de prescripción.

---

## Modelo de dominio

| Entidad | Propósito |
|---|---|
| `User` | Usuario autenticable del sistema. Contiene email, password hasheada, nombre y rol |
| `Doctor` | Perfil médico asociado a un usuario con rol `DOCTOR` |
| `Patient` | Perfil paciente asociado a un usuario con rol `PATIENT` |
| `Prescription` | Prescripción médica creada por un médico para un paciente |
| `PrescriptionItem` | Medicamento o indicación dentro de una prescripción |

### Relaciones principales

```mermaid
erDiagram
    User ||--o| Doctor : has
    User ||--o| Patient : has
    Doctor ||--o{ Prescription : creates
    Patient ||--o{ Prescription : receives
    Prescription ||--o{ PrescriptionItem : contains
```

### Estados de prescripción

| Estado | Descripción |
|---|---|
| `PENDING` | Prescripción pendiente de consumo |
| `CONSUMED` | Prescripción marcada como consumida por el paciente |

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
- **class-validator**
- **class-transformer**

### Frontend

- **Next.js App Router**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Fetch API**
- **localStorage**

### Herramientas de desarrollo

- **npm**
- **Prisma CLI**
- **PowerShell para pruebas manuales**
- **Git / GitHub**

---

## Estructura del proyecto

```text
prescripciones-mvp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.module.ts
│   │   │   └── admin.service.ts
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   └── types/
│   │   ├── prescriptions/
│   │   │   ├── dto/
│   │   │   ├── prescriptions.controller.ts
│   │   │   ├── prescriptions.module.ts
│   │   │   └── prescriptions.service.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   ├── login/
│   │   │   ├── patient/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── qa/
├── README.md
└── .gitignore
```

---

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js 20 o superior.
- npm.
- PostgreSQL.
- Git.

También debes tener una base de datos local creada para el proyecto.

Nombre recomendado:

```text
prescripciones_mvp
```

---

## Variables de entorno

### Backend

Crear el archivo:

```text
backend/.env
```

Puedes copiarlo desde:

```text
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

> Ajusta usuario, contraseña, host, puerto o nombre de base de datos según tu configuración local de PostgreSQL.

### Frontend

Crear el archivo:

```text
frontend/.env.local
```

Puedes copiarlo desde:

```text
frontend/.env.example
```

Configuración esperada:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/CristoferGuillen/prescripciones-mvp.git
```

Entrar al proyecto:

```bash
cd prescripciones-mvp
```

Instalar dependencias del backend:

```bash
cd backend
npm install
```

Instalar dependencias del frontend:

```bash
cd ../frontend
npm install
```

---

## Base de datos

Desde la carpeta `backend`, ejecutar:

```bash
npm run prisma:migrate
npm run prisma:seed
```

Para reconstruir completamente la base de datos local con datos iniciales:

```bash
npx prisma migrate reset
```

> Este comando reinicia la base de datos local, aplica migraciones y ejecuta el seed.

### Datos creados por el seed

El seed crea:

- un usuario administrador;
- un usuario médico;
- dos usuarios pacientes;
- perfiles asociados de médico y paciente;
- prescripciones demo;
- items de prescripción.

---

## Ejecución local

### Terminal 1: backend

```bash
cd backend
npm run start:dev
```

Backend disponible en:

```text
http://localhost:3001
```

### Terminal 2: frontend

```bash
cd frontend
npm run dev
```

Frontend disponible en:

```text
http://localhost:3000
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
| `/admin` | ADMIN | Dashboard administrativo |
| `/doctor/prescriptions` | DOCTOR | Listado de prescripciones del médico |
| `/doctor/prescriptions/new` | DOCTOR | Crear nueva prescripción |
| `/patient/prescriptions` | PATIENT | Listado de prescripciones del paciente |
| `/patient/prescriptions/:id` | PATIENT | Detalle, consumo y descarga PDF |

---

## Endpoints principales

### Auth

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Autentica usuario y devuelve tokens |
| `POST` | `/auth/refresh` | Público | Genera un nuevo access token |
| `GET` | `/auth/profile` | Autenticado | Devuelve el usuario autenticado |

### Users

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/users?role=PATIENT` | ADMIN, DOCTOR | Lista pacientes disponibles |

### Prescriptions

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/prescriptions` | ADMIN, DOCTOR | Crea una prescripción |
| `GET` | `/prescriptions` | ADMIN, DOCTOR, PATIENT | Lista prescripciones según rol |
| `GET` | `/prescriptions/:id` | ADMIN, DOCTOR, PATIENT | Muestra detalle con validación de permisos |
| `PATCH` | `/prescriptions/:id/consume` | ADMIN, PATIENT | Marca una prescripción como consumida |
| `GET` | `/prescriptions/:id/pdf` | ADMIN, DOCTOR, PATIENT | Descarga PDF con validación de permisos |

### Admin

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/admin/metrics` | ADMIN | Devuelve métricas generales del sistema |

---

## Flujo de prueba recomendado

### 1. Iniciar sesión como médico

Credenciales:

```text
doctor@test.com
doctor123
```

Acciones:

1. Entrar a `/doctor/prescriptions`.
2. Revisar el listado de prescripciones.
3. Hacer clic en **Nueva prescripción**.
4. Seleccionar `patient@test.com`.
5. Completar notas e items de medicamento.
6. Crear la prescripción.
7. Verificar que aparece en el listado médico.

### 2. Iniciar sesión como paciente

Credenciales:

```text
patient@test.com
patient123
```

Acciones:

1. Entrar a `/patient/prescriptions`.
2. Abrir la prescripción creada.
3. Revisar datos del médico, paciente, notas y medicamentos.
4. Marcar la prescripción como consumida.
5. Descargar el PDF.
6. Verificar que el PDF abre correctamente.

### 3. Iniciar sesión como administrador

Credenciales:

```text
admin@test.com
admin123
```

Acciones:

1. Entrar a `/admin`.
2. Revisar cards de totales.
3. Revisar prescripciones pendientes y consumidas.
4. Revisar tabla por día.
5. Usar el botón **Actualizar métricas**.

---

## Comandos útiles

### Backend

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run start:dev
```

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
npx prisma studio
```

Compilar backend:

```bash
npm run build
```

### Frontend

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Compilar frontend:

```bash
npm run build
```

Ejecutar build en modo producción:

```bash
npm run start
```

---

## Seguridad implementada

La seguridad principal está implementada en backend.

### Autenticación

- Login con email y password.
- Passwords hasheadas con bcrypt.
- Access token JWT.
- Refresh token simple.
- Endpoint de perfil autenticado.

### Autorización

- Guards de JWT.
- Guards de roles.
- Decorador `@Roles()`.
- Decorador `CurrentUser`.
- Validación de permisos por recurso.

### Reglas protegidas

- Paciente solo ve sus prescripciones.
- Paciente solo consume prescripciones propias.
- Paciente no puede acceder a prescripciones ajenas.
- Médico solo ve prescripciones creadas por él.
- Médico puede crear prescripciones para pacientes existentes.
- Admin puede consultar métricas generales.
- Rutas sensibles devuelven `401` sin token.
- Rutas no permitidas devuelven `403`.

---

## Decisiones técnicas

- Se construyó un MVP funcional orientado al flujo principal de evaluación.
- Se separó backend y frontend para mantener responsabilidades claras.
- Se usó Prisma para modelar relaciones y acelerar el trabajo con PostgreSQL.
- Se usó JWT para autenticación stateless.
- Se usó pdfkit para generar PDFs desde backend sin depender de navegador o Puppeteer.
- Se usó localStorage para persistencia de sesión en frontend por simplicidad del MVP.
- Se documentaron pruebas manuales por sprint para dejar trazabilidad del avance.
- Se priorizó seguridad en backend sobre validaciones únicamente visuales.

---

## Alcance MVP

Este proyecto se enfoca en entregar un flujo médico-paciente-administrador completo y evaluable.

### Incluido

- Autenticación.
- Roles.
- Seed funcional.
- Prescripciones.
- Consumo.
- PDF.
- Dashboard admin.
- Frontend funcional.
- README.
- Evidencia QA manual.

### Preparado para crecer

El diseño permite extender el sistema con futuras mejoras como:

- CRUD administrativo de usuarios;
- catálogo de medicamentos;
- firma digital;
- QR de validación;
- auditoría avanzada;
- paginación y filtros;
- notificaciones;
- despliegue productivo;
- suite de tests automatizados.

---

## Evidencia QA

El proyecto incluye evidencias de pruebas manuales por sprint en:

```text
docs/qa/
```

Archivos incluidos:

| Archivo | Validación |
|---|---|
| `sprint-2-auth-rbac.md` | Login, JWT, refresh token y roles |
| `sprint-3-prescripciones-backend.md` | Prescripciones backend y permisos |
| `sprint-4-pdf-metricas.md` | PDF y métricas admin |
| `sprint-5-frontend-login-rutas.md` | Login frontend y rutas por rol |
| `sprint-6-frontend-medico-paciente.md` | Flujo médico-paciente frontend |
| `sprint-7-admin-readme-entrega.md` | Dashboard admin, README y entrega |

---

## Estado de entrega

MVP completado y validado manualmente.

| Módulo | Estado |
|---|---|
| Setup técnico | Completado |
| Prisma y seed | Completado |
| Auth JWT | Completado |
| RBAC | Completado |
| Prescripciones backend | Completado |
| PDF backend | Completado |
| Métricas admin backend | Completado |
| Login frontend | Completado |
| Rutas por rol | Completado |
| Flujo médico frontend | Completado |
| Flujo paciente frontend | Completado |
| Dashboard admin frontend | Completado |
| README | Completado |
| QA manual | Completado |

---

## Autor

Desarrollado por **Cristofer Guillen**.

- GitHub: [@CristoferGuillen](https://github.com/CristoferGuillen)
- Repositorio: [prescripciones-mvp](https://github.com/CristoferGuillen/prescripciones-mvp)