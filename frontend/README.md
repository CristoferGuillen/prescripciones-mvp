# Prescripciones Médicas Frontend

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-UI-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styles-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Fetch API](https://img.shields.io/badge/Fetch_API-HTTP-blue?style=flat-square)
![Roles](https://img.shields.io/badge/Roles-ADMIN%20%7C%20DOCTOR%20%7C%20PATIENT-blueviolet?style=flat-square)
![Status](https://img.shields.io/badge/Status-Frontend%20Funcional-success?style=flat-square)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,nodejs,git&theme=light" alt="Tecnologías usadas en el frontend de Prescripciones Médicas" />
  </a>
</p>

**Prescripciones Médicas Frontend** es la interfaz web del proyecto **Prescripciones Médicas MVP**. Está desarrollada con **Next.js App Router**, **React**, **TypeScript** y **Tailwind CSS**.

La aplicación permite operar el flujo principal desde el navegador: login por rol, dashboard administrativo, creación de prescripciones por médico, consulta de recetas por paciente, consumo con confirmación, visualización de PDF y descarga de PDF.

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Tecnologías](#tecnologías)
- [Variables de entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Ejecución local](#ejecución-local)
- [Rutas principales](#rutas-principales)
- [Credenciales demo](#credenciales-demo)
- [Flujo principal](#flujo-principal)
- [Componentes principales](#componentes-principales)
- [Componentes UI creados](#componentes-ui-creados)
- [Sesión](#sesión)
- [Integración con API](#integración-con-api)
- [Acciones PDF](#acciones-pdf)
- [Comandos útiles](#comandos-útiles)
- [Estado](#estado)

## Descripción general

El frontend presenta una experiencia separada para cada rol:

| Rol | Ruta principal | Experiencia |
|---|---|---|
| `ADMIN` | `/admin` | Dashboard con métricas operativas |
| `DOCTOR` | `/doctor/prescriptions` | Listado, filtros, paginación y creación de prescripciones |
| `PATIENT` | `/patient/prescriptions` | Listado, filtros, detalle, consumo, ver PDF y descargar PDF |

La seguridad principal está en backend. En frontend se implementa protección de navegación para mejorar la experiencia de usuario, evitar rutas incorrectas y redirigir según rol.

## Tecnologías

- **Next.js App Router**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Fetch API**
- **localStorage para sesión MVP**

## Variables de entorno

Crea el archivo:

```txt
frontend/.env.local
```

Puedes copiarlo desde:

```txt
frontend/.env.example
```

Configuración esperada:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Instalación

Desde la carpeta `frontend`:

```bash
npm install
```

## Ejecución local

Modo desarrollo:

```bash
npm run dev
```

La aplicación queda disponible en:

```txt
http://localhost:3000
```

Compilar frontend:

```bash
npm run build
```

Ejecutar build:

```bash
npm run start
```

## Rutas principales

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Redirige a `/login` |
| `/login` | Público | Inicio de sesión |
| `/admin` | ADMIN | Dashboard administrativo |
| `/doctor/prescriptions` | DOCTOR | Listado de prescripciones del médico |
| `/doctor/prescriptions/new` | DOCTOR | Formulario para crear prescripción |
| `/patient/prescriptions` | PATIENT | Listado de prescripciones del paciente |
| `/patient/prescriptions/:id` | PATIENT | Detalle, consumo, ver PDF y descargar PDF |

## Credenciales demo

| Rol | Email | Password | Ruta esperada |
|---|---|---|---|
| Administrador | `admin@test.com` | `admin123` | `/admin` |
| Médico | `doctor@test.com` | `doctor123` | `/doctor/prescriptions` |
| Paciente | `patient@test.com` | `patient123` | `/patient/prescriptions` |
| Paciente 2 | `patient2@test.com` | `patient123` | `/patient/prescriptions` |

## Flujo principal

### Médico

1. Inicia sesión con `doctor@test.com`.
2. Entra a `/doctor/prescriptions`.
3. Filtra prescripciones por estado:
   - Todas.
   - Pendientes.
   - Consumidas.
4. Usa la paginación simple del listado.
5. Crea una nueva prescripción desde `/doctor/prescriptions/new`.
6. Selecciona un paciente.
7. Agrega medicamentos, dosis, frecuencia, duración e instrucciones.
8. Guarda la prescripción.
9. Recibe mensaje de éxito y vuelve al listado.

### Paciente

1. Inicia sesión con `patient@test.com`.
2. Entra a `/patient/prescriptions`.
3. Filtra sus prescripciones por estado.
4. Abre el detalle de una receta.
5. Revisa médico, paciente, notas y medicamentos.
6. Si está pendiente, marca la receta como consumida.
7. Confirma la acción antes de consumir.
8. Puede ver el PDF en una nueva pestaña.
9. Puede descargar el PDF.

### Administrador

1. Inicia sesión con `admin@test.com`.
2. Entra a `/admin`.
3. Revisa:
   - total de médicos;
   - total de pacientes;
   - total de prescripciones;
   - pendientes;
   - consumidas;
   - porcentajes;
   - barra visual;
   - tabla por día;
   - última actualización.
4. Puede actualizar métricas desde el botón correspondiente.

## Componentes principales

| Carpeta | Propósito |
|---|---|
| `src/app` | Rutas y páginas de Next.js |
| `src/components/layout` | Layout autenticado y navegación base |
| `src/components/ui` | Componentes reutilizables de interfaz |
| `src/lib` | API client, sesión, rutas y formateadores |
| `src/types` | Tipos TypeScript compartidos |

## Componentes UI creados

| Componente | Uso |
|---|---|
| `Button` | Botones reutilizables |
| `Input` | Campos de formulario |
| `Card` | Contenedores visuales |
| `Alert` | Mensajes de éxito, error o información |
| `EmptyState` | Estados vacíos contextuales |
| `PaginationControls` | Paginación visual |
| `PrescriptionStatusFilter` | Filtros Todas/Pendientes/Consumidas |
| `StatusBadge` | Estado visual de prescripción |

## Sesión

El frontend guarda la sesión MVP en localStorage usando la key:

```txt
prescripciones_mvp_session
```

La sesión incluye:

- `accessToken`;
- `refreshToken`;
- `user`.

## Integración con API

El frontend consume la API usando `fetch` mediante un helper central:

```txt
src/lib/api.ts
```

La URL base se toma desde:

```txt
NEXT_PUBLIC_API_URL
```

## Acciones PDF

En el detalle del paciente existen dos acciones:

| Acción | Descripción |
|---|---|
| Ver PDF | Solicita el PDF con token y lo abre en una nueva pestaña usando Blob |
| Descargar PDF | Solicita el PDF con token y descarga el archivo localmente |

## Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta el frontend en desarrollo |
| `npm run build` | Compila la aplicación |
| `npm run start` | Ejecuta el build |
| `npm run lint` | Ejecuta ESLint |

## Estado

Frontend funcional para el MVP de prescripciones médicas.

Incluye login, rutas por rol, listados con filtros y paginación, creación de prescripciones, detalle del paciente, consumo con confirmación, PDF y dashboard administrativo mejorado.
