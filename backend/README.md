# 🚀 FPConnect Backend - Documentación Completa

**API REST Node.js/Express para red social de FP**

---

## 📋 Tabla de contenidos

1. [Setup rápido](#setup-rápido)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura de carpetas](#estructura-de-carpetas)
4. [Variables de entorno](#variables-de-entorno)
5. [API Endpoints](#api-endpoints)
6. [Autenticación](#autenticación)
7. [WebSocket (tiempo real)](#websocket-tiempo-real)
8. [Modelo de datos](#modelo-de-datos)
9. [Testing](#testing)
10. [Deploy](#deploy)

---

## ⚡ Setup rápido

### 1. Instalación

```bash
cd backend
npm install
cp .env.example .env
```

### 2. Configurar PostgreSQL

```bash
# Opción A: PostgreSQL local
# En .env:
DATABASE_URL="postgresql://user:password@localhost:5432/fpconnect_db?schema=public"

# Opción B: PostgreSQL en Docker
docker run -e POSTGRES_USER=fpconnect_user \
           -e POSTGRES_PASSWORD=fpconnect_pass \
           -e POSTGRES_DB=fpconnect_db \
           -p 5432:5432 \
           postgres:15
```

### 3. Crear base de datos

```bash
# Ejecutar migraciones Prisma
npm run db:setup

# Generar cliente Prisma
npm run db:generate

# Opcional: agregar datos iniciales
npm run db:seed
```

### 4. Iniciar servidor

```bash
# Desarrollo (auto-reload con --watch)
npm run dev

# Producción
npm start
```

✅ Servidor corriendo en `http://localhost:3000`

---

## 🏗️ Stack Tecnológico

### Por qué estas tecnologías:

| Tecnología | Razón |
|-----------|-------|
| **Node.js + Express** | ⚡ Rápido, escalable, ecosistema npm robusto |
| **PostgreSQL** | 🔒 Relacional, índices avanzados, ACID garantizado |
| **Prisma ORM** | 📝 Type-safe, migrations automáticas, devX |
| **JWT** | 🔐 Stateless, escalable, móvil-friendly |
| **Socket.io** | 💬 Mensajería real-time con fallback |
| **Joi** | ✅ Validación robusta de inputs |
| **Helmet** | 🛡️ Security headers (XSS, CSRF prevention) |
| **Morgan** | 📊 HTTP request logging |

---

## 📁 Estructura de carpetas

```
backend/
├── src/
│   ├── config/                    # Centralizar configuración
│   │   ├── index.js              # Variables de entorno
│   │   ├── logger.js             # Sistema de logging
│   │   └── prisma.js             # Cliente Prisma
│   │
│   ├── controllers/               # Lógica HTTP (thin)
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── user.controller.js
│   │   └── ...
│   │
│   ├── routes/                    # Definir endpoints
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   └── index.js              # Agregar rutas aquí
│   │
│   ├── services/                  # Lógica de negocios (complex)
│   │   ├── auth.service.js
│   │   ├── post.service.js
│   │   └── ...
│   │
│   ├── middlewares/               # Express middlewares
│   │   ├── auth.js               # JWT verification
│   │   ├── errorHandler.js       # Error catching
│   │   └── validation.js         # Joi schemas
│   │
│   ├── validators/                # Joi schemas reutilizables
│   │   ├── auth.validator.js
│   │   └── post.validator.js
│   │
│   ├── sockets/                   # WebSocket handlers
│   │   └── messaging.socket.js
│   │
│   ├── utils/                     # Funciones auxiliares
│   │   ├── errorHandling.js
│   │   ├── dateFormatter.js
│   │   └── ...
│   │
│   ├── errors/                    # Custom error classes
│   │   └── AppError.js
│   │
│   └── index.js                   # Entry point
│
├── prisma/
│   ├── schema.prisma              # Definición de modelos
│   ├── migrations/                # Historial de cambios BD
│   └── seed.js                    # Datos iniciales
│
├── .env.example                   # Variables de ejemplo
├── .gitignore
├── package.json
└── README.md                      # Este archivo
```

---

## 🔐 Variables de entorno

### Mínimas requeridas

```env
# Servidor
NODE_ENV=development                # development, production, testing
PORT=3000                           # Puerto escucha

# Base de datos (OBLIGATORIO)
DATABASE_URL=postgresql://user:password@localhost:5432/fpconnect_db

# JWT (OBLIGATORIO) - Mínimo 20 caracteres
JWT_SECRET=your_very_long_secret_key_25_chars_min
JWT_EXPIRES_IN=7d                   # Por ej: 7d, 24h
REFRESH_TOKEN_SECRET=your_refresh_secret_25_chars_min
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:5173  # URL del frontend
FRONTEND_URL=http://localhost:5173
```

### Opcionales (producción)

```env
# Email (futuro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password

# Logging
LOG_LEVEL=info                      # debug, info, warn, error

# Almacenamiento
MAX_FILE_SIZE=5242880              # 5MB en bytes
UPLOAD_DIR=./uploads

# IA (futuro)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Autenticación

#### POST `/auth/register`
Registrar nuevo usuario

**Request:**
```json
{
  "email": "alumno@example.com",
  "password": "SecurePass123",
  "firstName": "Juan",
  "lastName": "García",
  "role": "ALUMNO"
}
```

**Response:** `201`
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "cuid123",
      "email": "alumno@example.com",
      "firstName": "Juan",
      "lastName": "García",
      "role": "ALUMNO"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST `/auth/login`
Login de usuario

**Request:**
```json
{
  "email": "alumno@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200`
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### GET `/auth/me`
Obtener perfil autenticado

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:** `200`
```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "email": "alumno@example.com",
    "firstName": "Juan",
    "lastName": "García",
    "role": "ALUMNO",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### POST `/auth/refresh-token`
Refrescar JWT

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200`
```json
{
  "success": true,
  "message": "Token refrescado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST `/auth/logout`
Logout del usuario

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:** `200`
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

---

### Posts (próximas fases)

- `POST /posts` - Crear post
- `GET /posts` - Obtener feed
- `GET /posts/:id` - Obtener post específico
- `PUT /posts/:id` - Editar post
- `DELETE /posts/:id` - Eliminar post
- `POST /posts/:id/like` - Dar like
- `POST /posts/:id/comments` - Agregar comentario

---

## 🔐 Autenticación

### Flujo JWT

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE                              │
└─────────────────────────────────────────────────────────┘
          │
          │ 1. POST /auth/login
          ├─────────────────────────────────────┬──────────┐
          │                                     │          │
          ▼                                     ▼          ▼
  ┌──────────────┐                    ┌─────────────────┐
  │ Credenciales │                    │ JWT (7 días)    │
  │ email/pass   │                    │ Refresh(30d)    │
  └──────────────┘                    └─────────────────┘
          │
          │ 2. Cada request API
          │ Header: Authorization: Bearer <JWT>
          │
          ▼
  ┌──────────────────────────────┐
  │ Middleware authMiddleware    │
  │ - Valida JWT                 │
  │ - Extrae userId + role       │
  │ - Agrega a req.user          │
  └──────────────────────────────┘
          │
          │ 3. JWT expirado? (error 401)
          │ POST /auth/refresh-token
          │ { refreshToken: "..." }
          │
          ▼
  ┌──────────────────────────────┐
  │ Generar nuevo JWT            │
  │ Continuar con request        │
  └──────────────────────────────┘
```

### Seguridad

- **Contraseñas:** Hash con bcrypt (10 rounds)
- **JWT:** Firmado con HS256
- **HTTPS:** En producción (Helmet headers + CORS)
- **Rate limiting:** (próxima fase)
- **CSRF:** Protegido por CORS + SameSite cookies (futuro)

---

## 💬 WebSocket (tiempo real)

### Conexión

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// Conectar usuario
socket.emit('user:connect', userId);
```

### Eventos disponibles

#### Mensajería

```javascript
// Enviar mensaje
socket.emit('message:send', {
  conversationId: 'conv123',
  recipientId: 'user456',
  senderId: 'user123',
  content: 'Hola, ¿qué tal?',
});

// Recibir mensaje
socket.on('message:received', (data) => {
  console.log('Mensaje:', data.content);
  console.log('De:', data.senderId);
  console.log('Hora:', data.createdAt);
});

// Marcar como leído
socket.emit('message:read', { messageId: 'msg123' });
```

#### Notificaciones

```javascript
// Recibir notificación
socket.on('notification:received', (data) => {
  console.log('Notificación:', data.title);
  console.log('Mensaje:', data.message);
});
```

#### Actividades en vivo

```javascript
// Post creado
socket.on('post:new', (post) => {
  console.log('Nuevo post:', post);
});

// Post likes en vivo
socket.on('post:liked', (data) => {
  console.log('Post', data.postId, 'likeado por', data.userId);
});

// Comentario nuevo
socket.on('comment:new', (comment) => {
  console.log('Nuevo comentario:', comment.content);
});
```

---

## 📊 Modelo de datos

### 18 Tablas principales

```
┌─────────────────┐
│      User       │ (Principal)
├─────────────────┤
│ id (CUID)       │
│ email (unique)  │
│ password (hash) │
│ firstName       │
│ lastName        │
│ role (enum)     │ → ALUMNO, CENTRO, EMPRESA, ADMIN
│ status (enum)   │ → ACTIVO, INACTIVO, SUSPENDIDO
│ createdAt       │
│ updatedAt       │
│ lastLogin       │
└─────────────────┘
    │
    ├─1:1── StudentProfile (Ciclo, Skills, CV)
    ├─1:1── EnterpriseProfile (Empresa, Vacantes)
    └─1:1── CenterProfile (Centro, Ciclos)

1:N Relaciones:
├──→ Post (Feed del usuario)
├──→ Comment (Comentarios)
├──→ Like (Me gusta)
├──→ Connection (Seguidores)
├──→ Message (Mensajes enviados/recibidos)
├──→ Notification (Notificaciones)
└──→ Activity (Auditoría)
```

### Índices para performance

```sql
-- Email: búsqueda en login
CREATE INDEX idx_user_email ON "User"(email);

-- UserId: filtrar posts, comentarios
CREATE INDEX idx_post_authorId ON "Post"("authorId");
CREATE INDEX idx_comment_postId ON "Comment"("postId");

-- CreatedAt: sorting, pagination
CREATE INDEX idx_post_createdAt ON "Post"("createdAt" DESC);
CREATE INDEX idx_message_createdAt ON "Message"("createdAt" DESC);

-- Composite: post + usuario
CREATE INDEX idx_post_author ON "Post"("authorId", "createdAt");
```

---

## ✅ Testing

### Requisitos

```bash
npm install --save-dev jest supertest
```

### Estructura tests

```
tests/
├── auth.test.js          # Tests autenticación
├── post.test.js          # Tests posts
├── socket.test.js        # Tests WebSocket
└── integration.test.js   # Tests E2E
```

### Ejecutar tests

```bash
npm run test              # Todos los tests
npm run test -- --watch  # Watch mode
npm run test -- --coverage # Con cobertura
```

---

## 🚀 Deploy

### Railway / Render

```bash
# 1. Push a GitHub
git init
git add .
git commit -m "Backend inicial"
git push origin main

# 2. Railway
# - Conectar repo
# - Auto-detecta Node.js
# - Env variables: DATABASE_URL, JWT_SECRET, etc
# - Deploy automático en push

# 3. Ver url
# https://fpconnect-api.railway.app
```

### Variables en producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://... (cloud hosted)
JWT_SECRET=<super_long_random_string>
CORS_ORIGIN=https://yourdomain.com
```

---

## 📚 Próximas fases

- [ ] Endpoints posts completos (CRUD + feed)
- [ ] Sistema de comentarios
- [ ] Connections (follow/unfollow)
- [ ] Bolsa de empleos
- [ ] Busquedas avanzadas
- [ ] Rate limiting
- [ ] Documentación Swagger
- [ ] Tests automáticos

---

## 🤝 Contribuir

```bash
# Crear rama feature
git checkout -b feature/nueva-funcionalidad

# Hacer cambios

# Commit con mensaje claro
git commit -m "feat: agregar endpoint de posts"

# Push
git push origin feature/nueva-funcionalidad

# Pull Request
```

---

## 📞 Soporte

- **Docs**: [README.md](../README.md)
- **Issues**: GitHub Issues
- **Email**: tu-email@example.com

---

**Hecho con ❤️ para TFG DAM 2024**
