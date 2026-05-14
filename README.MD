# Prescripciones Médicas MVP

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Fullstack-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Status-MVP%20Funcional-success?style=flat-square)
![Technical Test](https://img.shields.io/badge/Prueba-T%C3%A9cnica-blueviolet?style=flat-square)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nestjs,nextjs,typescript,postgres,prisma,tailwind,nodejs,git&theme=light" alt="Tecnologías usadas en Prescripciones Médicas MVP" />
  </a>
</p>

**Prescripciones Médicas MVP** es una aplicación full stack desarrollada como prueba técnica para gestionar un flujo digital de prescripciones médicas entre administradores, médicos y pacientes.

El sistema permite autenticar usuarios por rol, crear prescripciones desde el perfil médico, consultar recetas desde el perfil paciente, marcar prescripciones como consumidas, descargar un PDF generado desde backend y visualizar métricas operativas desde un dashboard administrativo.

El proyecto fue construido con un enfoque MVP: una entrega funcional, clara, demostrable y orientada a validar el flujo principal de extremo a extremo.

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Objetivo de la prueba técnica](#objetivo-de-la-prueba-técnica)
- [Tecnologías](#tecnologías)
- [Funcionalidades principales](#funcionalidades-principales)
- [Roles del sistema](#roles-del-sistema)
- [Modelo del dominio](#modelo-del-dominio)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Base de datos](#base-de-datos)
- [Ejecución local](#ejecución-local)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Rutas del frontend](#rutas-del-frontend)
- [Endpoints principales](#endpoints-principales)
- [Flujo de prueba recomendado](#flujo-de-prueba-recomendado)
- [Comandos útiles](#comandos-útiles)
- [Seguridad y permisos](#seguridad-y-permisos)
- [Evidencia QA](#evidencia-qa)
- [Estado de entrega](#estado-de-entrega)
- [Proyección del producto](#proyección-del-producto)
- [Autor](#autor)

## Descripción general

Prescripciones Médicas MVP centraliza el proceso básico de emisión, consulta y consumo de recetas médicas digitales.

La aplicación está organizada en tres experiencias principales:

- **Administrador:** consulta métricas generales del sistema.
- **Médico:** revisa sus prescripciones y crea nuevas recetas para pacientes existentes.
- **Paciente:** consulta sus prescripciones, revisa el detalle, marca recetas como consumidas y descarga el PDF correspondiente.

El sistema prioriza una experiencia sobria y directa, con reglas de negocio protegidas desde backend y una interfaz web preparada para demostrar el flujo completo sin depender de herramientas externas como Postman.

## Objetivo de la prueba técnica

El objetivo de esta prueba técnica fue construir un MVP full stack que demuestre dominio de:

- diseño de base de datos relacional;
- autenticación con JWT;
- autorización basada en roles;
- reglas de negocio desde backend;
- consumo de API REST desde frontend;
- generación de PDF;
- manejo de estados;
- dashboard administrativo;
- documentación técnica;
- validación manual del flujo principal.

El flujo funcional principal es:

| Paso | Actor | Acción |
|---|---|---|
| 1 | Médico | Inicia sesión |
| 2 | Médico | Crea una prescripción para un paciente existente |
| 3 | Paciente | Inicia sesión |
| 4 | Paciente | Consulta la prescripción asignada |
| 5 | Paciente | Marca la prescripción como consumida |
| 6 | Paciente | Descarga el PDF de la prescripción |
| 7 | Administrador | Inicia sesión |
| 8 | Administrador | Revisa métricas actualizadas |

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
- **localStorage para sesión MVP**

### Herramientas de desarrollo

- **npm**
- **Prisma CLI**
- **PowerShell para pruebas manuales**
- **Git / GitHub**

## Funcionalidades principales

### Autenticación

- Login con email y contraseña.
- Access token con JWT.
- Refresh token simple.
- Consulta de perfil autenticado.
- Persistencia de sesión en frontend.
- Cierre de sesión desde la interfaz.
- Redirección automática según rol.

### Control de acceso por roles

- Roles disponibles:
  - `ADMIN`
  - `DOCTOR`
  - `PATIENT`
- Guards de autenticación.
- Guards de roles.
- Decorador `@Roles()`.
- Decorador `CurrentUser`.
- Protección de rutas sensibles desde backend.
- Protección básica de rutas en frontend para mejorar la experiencia de usuario.

### Gestión de prescripciones

- Creación de prescripciones por médico.
- Selección de paciente existente.
- Registro de notas generales.
- Registro de medicamentos con:
  - nombre del medicamento;
  - dosis;
  - frecuencia;
  - duración;
  - instrucciones.
- Listado de prescripciones filtrado por rol.
- Detalle de prescripción.
- Cambio de estado de `PENDING` a `CONSUMED`.
- Prevención de consumo duplicado.
- Validación de acceso a prescripciones propias.

### PDF de prescripción

- Generación de PDF desde backend.
- Descarga protegida por permisos.
- Documento con:
  - código de prescripción;
  - ID;
  - fecha de emisión;
  - estado;
  - fecha de consumo;
  - datos del paciente;
  - datos del médico;
  - notas;
  - medicamentos e instrucciones.

### Dashboard administrativo

- Total de médicos.
- Total de pacientes.
- Total de prescripciones.
- Conteo de prescripciones pendientes.
- Conteo de prescripciones consumidas.
- Tabla de prescripciones por día.
- Botón para actualizar métricas.

## Roles del sistema

| Rol | Descripción | Funciones principales |
|---|---|---|
| `ADMIN` | Usuario administrativo | Consulta dashboard de métricas y tiene visibilidad global del sistema |
| `DOCTOR` | Médico emisor | Crea prescripciones, lista sus recetas y puede descargar PDFs propios |
| `PATIENT` | Paciente receptor | Consulta sus recetas, revisa detalle, marca como consumida y descarga PDF |

## Modelo del dominio

El sistema está organizado alrededor de entidades simples y enfocadas en el flujo principal de prescripción médica.

| Entidad | Propósito |
|---|---|
| `User` | Usuario autenticable del sistema con email, password, nombre y rol |
| `Doctor` | Perfil médico asociado a un usuario con rol `DOCTOR` |
| `Patient` | Perfil paciente asociado a un usuario con rol `PATIENT` |
| `Prescription` | Prescripción creada por un médico para un paciente |
| `PrescriptionItem` | Medicamento o indicación incluida dentro de una prescripción |

### Relaciones principales

| Relación | Descripción |
|---|---|
| `User` → `Doctor` | Un usuario médico tiene un perfil de doctor |
| `User` → `Patient` | Un usuario paciente tiene un perfil de paciente |
| `Doctor` → `Prescription` | Un médico puede crear muchas prescripciones |
| `Patient` → `Prescription` | Un paciente puede recibir muchas prescripciones |
| `Prescription` → `PrescriptionItem` | Una prescripción puede tener uno o varios medicamentos |

### Estados de prescripción

| Estado | Descripción |
|---|---|
| `PENDING` | Prescripción pendiente de consumo |
| `CONSUMED` | Prescripción marcada como consumida |

## Arquitectura del proyecto

El proyecto está separado en dos aplicaciones principales:

| Aplicación | Tecnología | Responsabilidad |
|---|---|---|
| `backend` | NestJS | API REST, autenticación, roles, reglas de negocio, Prisma, PDF y métricas |
| `frontend` | Next.js | Interfaz web, login, navegación por rol, consumo de API y flujo visual |

El backend centraliza la seguridad y las reglas del sistema. El frontend consume la API y presenta una experiencia clara para cada rol.

## Estructura del repositorio

```text
prescripciones-mvp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── prescriptions/
│   │   ├── prisma/
│   │   ├── users/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
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
│   └── package.json
│
├── docs/
│   └── qa/
├── .gitignore
└── README.md
```

## Requisitos previos

Antes de instalar el proyecto, asegúrate de tener disponible:

- Node.js.
- npm.
- PostgreSQL.
- Git.

Base de datos local recomendada:

```text
prescripciones_mvp
```

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/CristoferGuillen/prescripciones-mvp.git
```

Entra al proyecto:

```bash
cd prescripciones-mvp
```

Instala dependencias del backend:

```bash
cd backend
npm install
```

Instala dependencias del frontend:

```bash
cd ../frontend
npm install
```

## Configuración

### Backend

Crea el archivo de entorno del backend:

```bash
cd backend
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configura la conexión a PostgreSQL y secretos JWT:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prescripciones_mvp?schema=public"
JWT_ACCESS_SECRET="change_me_access_secret"
JWT_REFRESH_SECRET="change_me_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
```

Ajusta el usuario, contraseña y nombre de base de datos según tu entorno local.

### Frontend

Crea el archivo de entorno del frontend:

```bash
cd frontend
cp .env.example .env.local
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Configura la URL del backend:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Base de datos

Desde la carpeta `backend`, ejecuta las migraciones:

```bash
npm run prisma:migrate
```

Carga los datos iniciales:

```bash
npm run prisma:seed
```

También puedes reconstruir la base de datos local y volver a cargar el seed con:

```bash
npx prisma migrate reset
```

El seed crea usuarios de prueba, perfiles médicos y pacientes, además de prescripciones demo para validar los flujos desde el primer arranque.

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

## Credenciales de prueba

| Rol | Email | Password | Ruta esperada |
|---|---|---|---|
| Administrador | `admin@test.com` | `admin123` | `/admin` |
| Médico | `doctor@test.com` | `doctor123` | `/doctor/prescriptions` |
| Paciente | `patient@test.com` | `patient123` | `/patient/prescriptions` |
| Paciente 2 | `patient2@test.com` | `patient123` | `/patient/prescriptions` |

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

## Flujo de prueba recomendado

### 1. Médico crea una prescripción

1. Entrar a `http://localhost:3000/login`.
2. Iniciar sesión con:
   - `doctor@test.com`
   - `doctor123`
3. Ir a `/doctor/prescriptions`.
4. Hacer clic en **Nueva prescripción**.
5. Seleccionar `patient@test.com`.
6. Completar notas y medicamentos.
7. Crear la prescripción.
8. Confirmar que aparece en el listado médico.

### 2. Paciente consume la prescripción

1. Cerrar sesión.
2. Iniciar sesión con:
   - `patient@test.com`
   - `patient123`
3. Ir a `/patient/prescriptions`.
4. Abrir el detalle de la prescripción.
5. Revisar médico, paciente, notas y medicamentos.
6. Marcar la prescripción como consumida.
7. Descargar el PDF.
8. Verificar que el PDF abre correctamente.

### 3. Admin revisa métricas

1. Cerrar sesión.
2. Iniciar sesión con:
   - `admin@test.com`
   - `admin123`
3. Entrar a `/admin`.
4. Revisar totales, conteo por estado y tabla por día.
5. Usar el botón **Actualizar métricas**.

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

## Seguridad y permisos

La seguridad principal está implementada en backend.

| Área | Implementación |
|---|---|
| Passwords | Hash con bcrypt |
| Autenticación | JWT access token |
| Sesión | Refresh token simple |
| Autorización | Guards y roles |
| Decoradores | `@Roles()` y `CurrentUser` |
| Validación | DTOs con class-validator |
| Recursos | Validación por propietario y rol |

### Reglas protegidas

- Rutas sensibles requieren token.
- Rutas no autorizadas responden `403`.
- Pacientes solo ven sus prescripciones.
- Pacientes solo consumen prescripciones propias.
- Pacientes no acceden a recetas ajenas.
- Médicos solo listan prescripciones creadas por ellos.
- Médicos crean prescripciones para pacientes existentes.
- Administradores acceden al dashboard de métricas.

## Evidencia QA

El proyecto incluye evidencia de pruebas manuales en:

```text
docs/qa/
```

Archivos actuales:

| Archivo | Validación |
|---|---|
| `Sprint 2.md` | Autenticación, JWT, refresh token y roles |
| `Sprint 3.md` | Prescripciones backend y validación de permisos |
| `sprint 4.md` | PDF y métricas admin |
| `sprint 5.md` | Login frontend, sesión y rutas por rol |
| `sprint 6.md` | Flujo médico-paciente en frontend |

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

## Proyección del producto

El MVP deja una base sólida para evolucionar hacia una plataforma de prescripciones médicas más completa.

Posibles siguientes mejoras:

- administración visual de usuarios;
- catálogo de medicamentos;
- filtros y búsqueda avanzada;
- paginación de listados;
- auditoría de acciones;
- firma digital;
- QR de validación;
- notificaciones;
- despliegue productivo;
- pruebas automatizadas;
- documentación OpenAPI.

## Autor

Desarrollado por **Cristofer Guillen**.

- GitHub: [@CristoferGuillen](https://github.com/CristoferGuillen)
- Repositorio: [prescripciones-mvp](https://github.com/CristoferGuillen/prescripciones-mvp)