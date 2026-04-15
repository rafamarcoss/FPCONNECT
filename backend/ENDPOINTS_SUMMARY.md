# 📡 Resumen Rápido de Endpoints

## ✅ Endpoints Implementados

### 🔐 Autenticación (5 endpoints)
```
POST   /auth/register              ✅ Registrar usuario
POST   /auth/login                 ✅ Login
POST   /auth/refresh-token         ✅ Refrescar JWT
GET    /auth/me                    ✅ Obtener perfil
POST   /auth/logout                ✅ Logout
```

### 📝 Posts (7 endpoints)
```
POST   /posts                      ✅ Crear post
GET    /posts                      ✅ Obtener feed
GET    /posts/:id                  ✅ Obtener post
GET    /posts/user/:userId         ✅ Posts de usuario
PUT    /posts/:id                  ✅ Actualizar post
DELETE /posts/:id                  ✅ Eliminar post
POST   /posts/:id/like             ✅ Like/Unlike
GET    /posts/search/:term         ✅ Buscar posts
```

### 💬 Comentarios (6 endpoints)
```
POST   /posts/:postId/comments     ✅ Crear comentario
GET    /posts/:postId/comments     ✅ Obtener comentarios
PUT    /comments/:id               ✅ Editar comentario
DELETE /comments/:id               ✅ Eliminar comentario
POST   /comments/:id/like          ✅ Like comentario
DELETE /comments/:id/like          ✅ Unlike comentario
```

### 👥 Conexiones (6 endpoints)
```
POST   /connections/:userId/follow          ✅ Seguir
DELETE /connections/:userId/follow          ✅ Dejar de seguir
GET    /connections/:userId/status          ✅ Estado conexión
POST   /connections/:userId/block           ✅ Bloquear
DELETE /connections/:userId/block           ✅ Desbloquear
GET    /connections/recommendations         ✅ Recomendaciones
```

### 👤 Usuarios (4 endpoints)
```
GET    /users/:id                  ✅ Perfil público
PUT    /users/profile              ✅ Actualizar perfil
GET    /users/:id/stats            ✅ Estadísticas
GET    /users/search/:query        ✅ Buscar usuarios
```

### 🌐 Conexiones Usuario (2 endpoints adicionales)
```
GET    /users/:userId/followers    ✅ Obtener seguidores
GET    /users/:userId/following    ✅ Obtener seguidos
```

---

## 📊 Estadísticas

| Categoría | Endpoints | Estado |
|-----------|-----------|--------|
| Autenticación | 5 | ✅ Completo |
| Posts | 8 | ✅ Completo |
| Comentarios | 6 | ✅ Completo |
| Conexiones | 6 | ✅ Completo |
| Usuarios | 4 | ✅ Completo |
| **TOTAL** | **29** | ✅ **Implementados** |

---

## 🔄 Flujo típico de usuario

```
1. POST   /auth/register         → Crear cuenta
2. POST   /auth/login            → Obtener token
3. POST   /posts                 → Crear post
4. GET    /posts                 → Ver feed
5. POST   /posts/:id/like        → Dar like
6. POST   /posts/:id/comments    → Comentar
7. POST   /connections/:id/follow → Seguir usuario
8. GET    /users/:id/stats       → Ver estadísticas
```

---

## 🛠️ Próximos endpoints (Fase 3)

```
[ ] POST   /jobs                  ▶️ Crear oferta empleo
[ ] GET    /jobs                  ▶️ Listar ofertas
[ ] POST   /jobs/:id/apply        ▶️ Aplicar a oferta
[ ] GET    /messages              ▶️ Obtener mensajes
[ ] POST   /messages              ▶️ Enviar mensaje
[ ] GET    /notifications         ▶️ Obtener notificaciones
[ ] POST   /notifications/read    ▶️ Marcar como leído
```

---

## 🧪 Testing

### Script de prueba
```bash
bash test-endpoints.sh
```

Este script:
- ✅ Registra usuario
- ✅ Login
- ✅ Crea post
- ✅ Comenta
- ✅ Da likes
- ✅ Sigue usuario
- ✅ Busca usuarios

---

## 📚 Documentación

- **API Completa**: [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- **Backend Setup**: [README.md](./README.md)
- **Modelo Datos**: [../prisma/schema.prisma](../prisma/schema.prisma)

---

## 💡 Casos de uso implementados

### Alumno
- ✅ Crear/editar/eliminar posts
- ✅ Ver feed personalizado (posts seguidos)
- ✅ Comentar en posts
- ✅ Dar likes
- ✅ Seguir otros usuarios
- ✅ Ver perfil de otros alumnos
- ✅ Buscar alumnos/posts

### Centro
- ✅ Crear posts institucionales
- ✅ Seguir y ser seguido
- ✅ Ver perfiles de alumnos

### Empresa
- ✅ Crear posts sobre empleo
- ✅ Seguir alumnos y centros
- ✅ Ver perfil de alumnos

---

**Total de endpoints funcionales: 29** ✅
