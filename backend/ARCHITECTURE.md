diagrama de arquitectura mostrando cómo están conectados los endpoints y servicios.

# 🏗️ Arquitectura de Endpoints y Servicios

## Flujo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENTE (FRONTEND)                         │
├─────────────────────────────────────────────────────────────────┤
│  - React app (http://localhost:5173)                            │
│  - Envía JWT en header Authorization                            │
│  - Recibe JSON responses                                         │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP/REST
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  EXPRESS SERVER (http://localhost:3000)                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ MIDDLEWARES (Global)                                        ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ • Helmet (seguridad headers)                                ││
│  │ • CORS (validar origen)                                     ││
│  │ • Morgan (logging HTTP)                                     ││
│  │ • express.json (parsear body)                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                          ▼                                        │
│  ┌──────────────┬──────────────┬──────────────┬────────────────┐│
│  │ /api/auth    │ /api/posts   │ /api/users   │ /api/connections││
│  │              │              │              │                ││
│  │ Register     │ CRUD Posts   │ Perfil       │ Follow         ││
│  │ Login        │ Feed         │ Search       │ Unfollow       ││
│  │ Logout       │ Like         │ Stats        │ Block          ││
│  │              │ Search       │              │ Recommendations││
│  │              │              │              │                ││
│  │ /comments → Comentarios     │                                ││
│  │              │              │              │                ││
│  └──────────────┴──────────────┴──────────────┴────────────────┘│
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ CONTROLLERS (Routing handlers)                               ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ • Post Controller       • User Controller                     ││
│  │ • Comment Controller    • Connection Controller              ││
│  │ • Auth Controller                                            ││
│  └──────────────────────────────────────────────────────────────┘│
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ MIDDLEWARES (Por ruta)                                       ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ • authMiddleware (verificar JWT)                             ││
│  │ • validate (Joi schemas)                                     ││
│  │ • asyncHandler (try/catch wrapper)                           ││
│  └──────────────────────────────────────────────────────────────┘│
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ SERVICES (Lógica de negocio)                                 ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ • Post Service          • User Service                        ││
│  │ • Comment Service       • Connection Service                 ││
│  │ • Auth Service                                               ││
│  │                                                               ││
│  │ Funciones:                                                    ││
│  │ - Validación lógica     - Transacciones BD                   ││
│  │ - Queries Prisma        - Manejo de errores                  ││
│  └──────────────────────────────────────────────────────────────┘│
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ PRISMA ORM (Type-safe queries)                               ││
│  │                                                               ││
│  │ await prisma.post.create({...})                              ││
│  │ await prisma.comment.findMany({...})                         ││
│  │ await prisma.connection.delete({...})                        ││
│  └──────────────────────────────────────────────────────────────┘│
│                          ▼                                        │
└─────────────────────────────────────────────────────────────────┘
                  │ SQL Queries
                  ▼
         ┌──────────────────────┐
         │    PostgreSQL        │
         │  (18 tablas + índices)
         │                      │
         │ • User               │
         │ • Post               │
         │ • Comment            │
         │ • Connection         │
         │ • Like               │
         │ • Notification       │
         │ • ... (más)          │
         └──────────────────────┘
```

---

## Flujo de una solicitud típica (GET /posts - Feed)

```
1. CLIENTE
   ┌───────────────────────────────────────────┐
   │ GET /posts                                │
   │ Header: Authorization: Bearer <JWT>       │
   │ Query: page=1&limit=10                    │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
2. SERVIDOR LLEGA A RUTA
   ┌───────────────────────────────────────────┐
   │ /api/posts (GET)                          │
   │ └─ postRoutes.get('/')                    │
   │    → postController.getFeed               │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
3. MIDDLEWARES
   ┌───────────────────────────────────────────┐
   │ authMiddleware                            │
   │ ├ Extrae JWT del header                   │
   │ ├ Verifica firma JWT                      │
   │ ├ Agrega req.userId a objeto request      │
   │ └ Continúa si es válido                   │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
4. CONTROLLER
   ┌───────────────────────────────────────────┐
   │ postController.getFeed(req, res)          │
   │ ├ Extrae: page = req.query.page           │
   │ ├ Extrae: limit = req.query.limit         │
   │ └ Llama:                                  │
   │   postService.getFeed(userId, page,limit)│
   └──────────────────┬──────────────────────┘
                      │
                      ▼
5. SERVICE (Lógica)
   ┌───────────────────────────────────────────┐
   │ postService.getFeed()                     │
   │ ├ Busca usuarios seguidos                 │
   │ │  await prisma.connection.findMany({...})│
   │ ├ Filtra posts (own + following)          │
   │ ├ Paginación (skip, take)                 │
   │ ├ Incluye author, comments, likes         │
   │ └ Retorna { posts[], pagination{} }       │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
6. PRISMA → BD
   ┌───────────────────────────────────────────┐
   │ SELECT * FROM "Post"                      │
   │ WHERE                                     │
   │   authorId IN (userId, ...followingIds)   │
   │ ORDER BY createdAt DESC                   │
   │ LIMIT 10 OFFSET 0                         │
   │                                           │
   │ (+ 2 JOINs para author, comments, likes)  │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
7. RESULTADO
   ┌───────────────────────────────────────────┐
   │ [                                         │
   │   {                                       │
   │     id: "post123",                        │
   │     content: "...",                       │
   │     author: { name, profileImage },       │
   │     comments: [...],                      │
   │     likes: [],                            │
   │     createdAt: "2024-01-15T10:30:00Z"    │
   │   },                                      │
   │   ...                                     │
   │ ]                                         │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
8. RESPONSE
   ┌───────────────────────────────────────────┐
   │ HTTP 200 OK                               │
   │ {                                         │
   │   "success": true,                        │
   │   "message": "Feed obtenido",             │
   │   "data": {                               │
   │     "posts": [...],                       │
   │     "pagination": {                       │
   │       "page": 1,                          │
   │       "limit": 10,                        │
   │       "total": 45,                        │
   │       "pages": 5                          │
   │     }                                     │
   │   }                                       │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
9. CLIENTE RECIBE
   ┌───────────────────────────────────────────┐
   │ JSON en respuesta                         │
   │ Renderiza posts en el feed                │
   │ Muestra información de autor              │
   │ Permite acciones (like, comentar)         │
   └───────────────────────────────────────────┘
```

---

## Relaciones entre Servicios

```
┌─────────────────────────────────────────────────────────────┐
│                    Auth Service                             │
│  - Registrar usuario                                        │
│  - Login (generar JWT)                                      │
│  - Validar token                                            │
│  └─→ Crea User + perfil específico (Student/Enterprise)    │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴──────────┬──────────────┐
         │                      │              │
         ▼                      ▼              ▼
    ┌──────────┐    ┌────────────────┐   ┌────────────────┐
    │ USER     │    │ POST SERVICE   │   │ COMMENT        │
    │ SERVICE  │    │                │   │ SERVICE        │
    │          │    │ - Create post  │   └────────────────┘
    │ - Profile│    │ - Get feed     │
    │ - Search │    │ - Like/Unlike  │
    │ - Stats  │    │ - Pagination   │
    └────┬─────┘    └────────┬───────┘
         │                   │
         │    ┌──────────────┼──────────────┐
         │    │              │              │
         ▼    ▼              ▼              ▼
    ┌──────────────────────────────────────────┐
    │     CONNECTION SERVICE                   │
    │  - Follow / Unfollow                     │
    │  - Get Followers / Following             │
    │  - Block / Unblock                       │
    │  - Recommendations                       │
    └──────────────────────────────────────────┘
```

---

## Manejo de errores

```
┌─ REQUEST ─────┐
               │
               ▼
    ┌─────────────────────┐
    │ Validación          │
    │ (Joi schemas)       │
    │                     │
    │ ✓ OK → Siguiente    │
    │ ✗ Error → 400       │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Middleware Auth     │
    │                     │
    │ ✓ Token válido      │
    │ ✗ No token → 401    │
    │ ✗ Token exp → 401   │
    │ ✗ Invalid → 403     │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Controller/Service  │
    │                     │
    │ ✓ OK → Response 200 │
    │ ✗ Error → AppError  │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Global Error Handler│
    │                     │
    │ - Log error         │
    │ - Format respuesta  │
    │ - HTTP status code  │
    │ - JSON response     │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ CLIENT              │
    │                     │
    │ {                   │
    │  success: false,    │
    │  message: "...",    │
    │  statusCode: 400    │
    │ }                   │
    └─────────────────────┘
```

---

## Stack de Tecnologías

```
┌──────────────────────────────────────────────┐
│         FRONTEND                             │
│         React 18 + Vite                      │
└──────────────────────────────────────────────┘
                    │
                    │ HTTP REST
                    │
┌──────────────────────────────────────────────┐
│         BACKEND (Express.js)                 │
│ ┌────────────────────────────────────────────┐
│ │ Node.js 18+                                │
│ └────────────────────────────────────────────┘
└──────────────────────────────────────────────┘
                    │
                    │ SQL (Prisma)
                    │
┌──────────────────────────────────────────────┐
│         DATA LAYER                           │
│ ┌────────────────────────────────────────────┐
│ │ PostgreSQL 14+                             │
│ │ - 18 tablas                                │
│ │ - Índices (email, userId, createdAt)      │
│ │ - Relaciones (FK, M2M)                     │
│ └────────────────────────────────────────────┘
└──────────────────────────────────────────────┘

EXTRA:
Socket.io → WebSocket (tiempo real)
```

---

## próximas integraciones

```
┌─────────────────────────────────────────────┐
│ FASE 3: Notificaciones + Mensajería         │
├─────────────────────────────────────────────┤
│                                             │
│ Socket.io (WebSocket)                       │
│ ├─ message:send                             │
│ ├─ message:received                         │
│ ├─ notification:received                    │
│ └─ user:online                              │
│                                             │
│ → Controllers + Services para mensajería    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ FASE 4: Job Offers                          │
├─────────────────────────────────────────────┤
│                                             │
│ POST   /jobs                                │
│ GET    /jobs                                │
│ POST   /jobs/:id/apply                      │
│ GET    /jobs/applications                   │
│                                             │
│ → Adicionales: Service, Controller, Routes  │
└─────────────────────────────────────────────┘
```

---

**Documentación creada:** Enero 2024
