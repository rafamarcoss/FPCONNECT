# 🌿 FPConnect

**Red profesional para alumnado, centros educativos y empresas de Formación Profesional.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)

> Proyecto final de Desarrollo de Aplicaciones Multiplataforma (DAM). FPConnect reúne identidad profesional, comunidad y oportunidades laborales de FP en una aplicación web y de escritorio.

![Pantalla de acceso de FPConnect](Documentacion/images/01_login_page.jpg)

---

## Producto

FPConnect permite que un alumno construya su perfil profesional antes de incorporarse al mercado laboral, que un centro acompañe y conecte a su alumnado, y que una empresa encuentre talento de FP y gestione candidaturas.

### Funcionalidad implementada

| Área | Funcionalidades |
| --- | --- |
| **Identidad y acceso** | Registro por rol (`ALUMNO`, `CENTRO`, `EMPRESA`), login JWT + refresh token, inicio con Google OAuth y recuperación de contraseña mediante pregunta personalizada. |
| **Red social** | Feed con publicaciones, comentarios y likes; perfiles públicos/editables; búsqueda de usuarios; seguidores, seguidos y recomendaciones. |
| **FP y empleabilidad** | Explorador de centros/empresas/alumnos, vinculación del alumno con su centro, noticias FP, ofertas de empleo/prácticas y seguimiento de candidaturas. |
| **Empresa** | Creación y retirada de ofertas, consulta de candidatos y actualización del estado de cada candidatura. |
| **Comunicación** | Conversaciones privadas, mensajes y confirmación de lectura; notificaciones; eventos en tiempo real con Socket.IO. |
| **Distribución y calidad** | Cliente web responsive, aplicación de escritorio Electron, configuración Docker/Nginx, documentación de TFG y tests backend con Jest/Supertest. |

### Experiencias por rol

| Rol | Pantallas principales |
| --- | --- |
| 🎓 **Alumno** | Feed, conexiones, explorador de centros/empresas/alumnos, ofertas, mis aplicaciones, noticias FP y edición de perfil. |
| 🏫 **Centro** | Panel con actividad, alumnado vinculado, red de contactos, mensajería/notificaciones y perfil del centro. |
| 🏢 **Empresa** | Panel, búsqueda de talento, publicación y gestión de ofertas/candidaturas, red y perfil corporativo. |

---

## Arquitectura y stack

```text
React 19 + Vite 7 + Zustand + Axios
            │ REST / Socket.IO
            ▼
Node.js + Express + JWT + Passport Google OAuth
            │ Prisma ORM
            ▼
        PostgreSQL

Electron ── empaqueta el frontend para escritorio
Nginx/Docker ── despliegue del cliente y proxy /api
```

| Capa | Tecnología | Uso actual |
| --- | --- | --- |
| Frontend | React 19, Vite 7, Zustand, Axios | Interfaz por roles, estado de sesión y consumo de la API. |
| Tiempo real | Socket.IO client/server | Chat, lectura de mensajes y notificaciones. |
| Backend | Node.js, Express, Joi, Helmet, CORS, Morgan | API REST, validación, seguridad HTTP y logging. |
| Autenticación | JWT, bcryptjs, Passport Google OAuth 2.0 | Access/refresh tokens, contraseñas cifradas y acceso social. |
| Persistencia | PostgreSQL, Prisma 5 | 15 modelos para usuarios, perfiles, comunidad, mensajes y empleo. |
| Escritorio | Electron + electron-builder | Ejecutable Windows reutilizando la aplicación React. |
| Infraestructura | Docker Compose, Docker, Nginx | PostgreSQL local y artefactos de despliegue web/backend. |
| Tests | Jest + Supertest | Pruebas de autenticación, publicaciones y candidaturas. |

### Modelo de dominio

Los modelos Prisma principales se agrupan en:

- **Identidad:** `User`, `StudentProfile`, `CenterProfile`, `EnterpriseProfile`.
- **Comunidad:** `Post`, `Comment`, `Like`, `Connection`, `Activity`.
- **Comunicación:** `Conversation`, `Message`, `Notification`.
- **Empleo:** `JobOffer`, `JobApplication`.
- **Auditoría:** `AuditLog`.

---

## Puesta en marcha local

### Requisitos

- Node.js **20.19.0** (`.nvmrc`) y npm.
- Docker Desktop, o una instalación local de PostgreSQL.
- Credenciales Google OAuth solo si se quiere probar el botón **Continuar con Google**.

### 1. Clonar e instalar

```bash
git clone https://github.com/rafamarcoss/FPCONNECT.git
cd FPCONNECT

# Frontend / Electron
npm ci

# Backend
cd backend
npm ci
cd ..
```

### 2. Levantar PostgreSQL

La forma rápida para desarrollo es iniciar únicamente la base de datos incluida en Docker Compose:

```bash
docker compose up -d db
```

Este servicio publica PostgreSQL en `localhost:5432` con:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=adminpassword
POSTGRES_DB=fpconnect
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
```

Si se utiliza la base de datos Docker anterior, actualiza en `backend/.env`:

```env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/fpconnect?schema=public"
DIRECT_URL="postgresql://admin:adminpassword@localhost:5432/fpconnect?schema=public"
```

Variables clave del backend:

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Conexión PostgreSQL usada por la aplicación. |
| `DIRECT_URL` | Sí | Conexión directa requerida por Prisma CLI y el esquema actual. |
| `JWT_SECRET`, `REFRESH_TOKEN_SECRET` | Sí | Firma de tokens de autenticación. Cambiarlas fuera de desarrollo. |
| `CORS_ORIGIN`, `FRONTEND_URL` | Sí en despliegue | Origen permitido y URL del frontend. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Para OAuth | Credenciales y callback de Google. |

Variables del frontend (`.env.local`):

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### 4. Preparar datos e iniciar servidores

Terminal 1:

```bash
cd backend
npm run db:generate
npx prisma db push
npm run db:seed
npm run dev
```

Terminal 2:

```bash
npm run dev
```

Abre **http://localhost:5173**. La API se sirve en **http://localhost:3000/api** y el health check está en **http://localhost:3000/health**.

> El seed de Prisma carga usuarios, centros, empresas, publicaciones y ofertas de demostración para recorrer los flujos principales.

---

## Scripts útiles

### Frontend y escritorio (`/`)

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Cliente web en desarrollo con Vite. |
| `npm run build` | Build de producción en `dist/`. |
| `npm run preview` | Sirve localmente el build generado. |
| `npm run dev:desktop` | Abre el cliente en Electron junto a Vite. |
| `npm run build:desktop` | Genera el instalador Windows mediante electron-builder. |

### Backend (`/backend`)

| Comando | Descripción |
| --- | --- |
| `npm run dev` | API con recarga nativa de Node. |
| `npm start` | API en modo ejecución. |
| `npm run db:generate` | Genera Prisma Client. |
| `npm run db:seed` | Inserta datos de demostración. |
| `npm test` | Ejecuta tests Jest/Supertest con cobertura. |

---

## API y tiempo real

| Recurso | Rutas base | Capacidades |
| --- | --- | --- |
| Autenticación | `/api/auth`, `/api/auth/google` | Registro, login, refresh, sesión actual, recuperación y OAuth. |
| Publicaciones | `/api/posts`, `/api/posts/:postId/comments` | Feed, CRUD, búsqueda, comentarios y likes. |
| Usuarios y red | `/api/users`, `/api/connections` | Perfiles, búsqueda, vinculación con centro, follows y recomendaciones. |
| Empleo | `/api/offers` (`/api/job-offers` alias) | Ofertas, candidaturas y estados de selección. |
| Mensajes | `/api/conversations` | Conversaciones, mensajes y marcación de lectura. |
| Notificaciones | `/api/notifications` | Consulta y lectura de alertas. |

Socket.IO expone eventos de mensajería, lectura, notificaciones, publicaciones y estado online para actualizar la interfaz sin recarga.

Para consultar payloads y ejemplos REST: [`backend/API_ENDPOINTS.md`](backend/API_ENDPOINTS.md) y [`backend/POSTMAN_COLLECTION.json`](backend/POSTMAN_COLLECTION.json).

---

## Estructura del repositorio

```text
FPCONNECT/
├── src/                         # Aplicación React
│   ├── components/              # Feed, chat, notificaciones y perfiles
│   ├── pages/                   # AlumnoApp, CentroApp, EmpresaApp y acceso
│   ├── services/                # Cliente REST y servicios por dominio
│   ├── store/                   # Estado global con Zustand
│   └── styles/
├── backend/
│   ├── prisma/                  # Esquema y seed PostgreSQL
│   └── src/
│       ├── controllers/         # Controladores REST
│       ├── routes/              # Auth, red, empleo, mensajes, alertas
│       ├── services/            # Lógica de negocio
│       ├── sockets/             # Socket.IO
│       └── tests/               # Jest + Supertest
├── Documentacion/               # Memoria TFG, manual de usuario e imágenes
├── Requisitos/                  # Entregables y criterios académicos
├── main.js                      # Entrada de Electron
├── docker-compose.yml           # PostgreSQL, backend y frontend
├── Dockerfile / nginx.conf      # Build y servidor del frontend
└── .env.example                 # Configuración local del cliente
```

---

## Pruebas

Con el backend configurado:

```bash
cd backend
npm test
```

La suite cubre flujos de autenticación, creación/interacción con publicaciones y aplicaciones a ofertas.

---

## Documentación del proyecto

- [Manual de usuario](Documentacion/Manual_Usuario_FPConnect.pdf)
- [Memoria técnica del TFG](Documentacion/FPConnect_TFG_Memoria.pdf)
- [Arquitectura backend](backend/ARCHITECTURE.md)
- [Integración frontend/API](FRONTEND_INTEGRATION.md)
- [Colección Postman](backend/POSTMAN_COLLECTION.json)

---

## Higiene del repositorio

- Las dependencias instaladas **no se versionan**: `node_modules/` está excluido en `.gitignore` para el proyecto raíz y para paquetes anidados como `backend/`.
- Los lockfiles de frontend y backend sí se versionan para asegurar instalaciones reproducibles y auditorías fiables.
- Los archivos de entorno locales (`.env`, `.env.local`) tampoco se suben; solo se versionan las plantillas `.env.example`.
- Los builds (`dist/`, `release/`) se generan localmente o en CI.

---

*FPConnect · Proyecto DAM · React + Express + PostgreSQL + Prisma + Socket.IO + Electron*
