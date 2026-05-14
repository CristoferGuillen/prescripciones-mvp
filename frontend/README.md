# Prescripciones Médicas Frontend

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-UI-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styles-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/API-Render-46E3B7?style=flat-square)
![Roles](https://img.shields.io/badge/Roles-ADMIN%20%7C%20DOCTOR%20%7C%20PATIENT-blueviolet?style=flat-square)
![Status](https://img.shields.io/badge/Status-Frontend%20Live-success?style=flat-square)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,nodejs,git&theme=light" alt="Tecnologías usadas en el frontend de Prescripciones Médicas" />
  </a>
</p>

**Prescripciones Médicas Frontend** es la interfaz web del proyecto **Prescripciones Médicas MVP**. Está desarrollada con **Next.js App Router**, **React**, **TypeScript** y **Tailwind CSS**.

La aplicación permite operar el flujo principal desde el navegador: login por rol, dashboard administrativo, creación de prescripciones por médico, consulta de recetas por paciente, consumo con confirmación, visualización de PDF y descarga de PDF.

## Demo frontend

| Recurso | URL |
|---|---|
| Frontend | https://prescripciones-mvp.vercel.app |
| Backend API | https://prescripciones-mvp.onrender.com |
| Repositorio | https://github.com/CristoferGuillen/prescripciones-mvp |


## Tabla de contenidos

- [Demo frontend](#demo-frontend)
- [Descripción general](#descripción-general)
- [Tecnologías](#tecnologías)
- [Variables de entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Ejecución local](#ejecución-local)
- [Producción](#producción)
- [Rutas principales](#rutas-principales)
- [Credenciales demo](#credenciales-demo)
- [Flujo principal](#flujo-principal)
- [Componentes principales](#componentes-principales)
- [Acciones PDF](#acciones-pdf)
- [Comandos útiles](#comandos-útiles)
- [Estado](#estado)

## Descripción general

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
- **Vercel**

## Variables de entorno

Configuración local:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Configuración en Vercel:

```env
NEXT_PUBLIC_API_URL=https://prescripciones-mvp.onrender.com
```

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

Frontend local:

```txt
http://localhost:3000
```

Build:

```bash
npm run build
npm run start
```

## Producción

El frontend se despliega en Vercel usando:

```txt
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Install Command: npm install
Output Directory: .next
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
3. Filtra prescripciones por estado.
4. Usa la paginación simple.
5. Crea una nueva prescripción.
6. Recibe feedback de éxito.

### Paciente

1. Inicia sesión con `patient@test.com`.
2. Entra a `/patient/prescriptions`.
3. Filtra sus prescripciones.
4. Abre el detalle.
5. Confirma consumo si está pendiente.
6. Puede ver y descargar PDF.

### Administrador

1. Inicia sesión con `admin@test.com`.
2. Entra a `/admin`.
3. Revisa totales, porcentajes, tabla por día y última actualización.

## Componentes principales

| Carpeta | Propósito |
|---|---|
| `src/app` | Rutas y páginas de Next.js |
| `src/components/layout` | Layout autenticado y navegación base |
| `src/components/ui` | Componentes reutilizables de interfaz |
| `src/lib` | API client, sesión, rutas y formateadores |
| `src/types` | Tipos TypeScript compartidos |

## Acciones PDF

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

Frontend funcional y desplegado para el MVP de prescripciones médicas.
