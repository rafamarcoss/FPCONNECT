# 📡 API Endpoints de FPConnect

Documentación completa de todos los endpoints disponibles en la API REST.

## Base URL
```
http://localhost:3000/api
```

## 📑 Tabla de contenidos

1. [Autenticación](#autenticación)
2. [Posts](#posts)
3. [Comentarios](#comentarios)
4. [Conexiones (Follow)](#conexiones-follow)
5. [Usuarios](#usuarios)

---

## 🔐 Autenticación

### Registrar usuario
**POST** `/auth/register`

Crear nueva cuenta (Alumno, Centro o Empresa)

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "SecurePass123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "ALUMNO"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "cuid123",
      "email": "usuario@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "ALUMNO"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login
**POST** `/auth/login`

Iniciar sesión con email y contraseña

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
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

### Refrescar token
**POST** `/auth/refresh-token`

Obtener nuevo JWT usando refresh token

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
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

### Obtener perfil actual
**GET** `/auth/me`

Obtener información del usuario autenticado

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "ALUMNO",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Logout
**POST** `/auth/logout`

Cerrar sesión (actualmente sin estado, token sigue siendo válido hasta expiration)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

---

## 📝 Posts

### Crear post
**POST** `/posts`

Crear nuevo post en el feed

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "content": "¡Hola! Este es mi primer post en FPConnect",
  "imageUrl": "https://example.com/image.jpg",
  "visibility": "PUBLIC"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Post creado exitosamente",
  "data": {
    "id": "post123",
    "authorId": "user123",
    "content": "¡Hola! Este es mi primer post",
    "imageUrl": "https://example.com/image.jpg",
    "likeCount": 0,
    "commentCount": 0,
    "visibility": "PUBLIC",
    "author": {
      "id": "user123",
      "firstName": "Juan",
      "lastName": "Pérez",
      "profileImage": null,
      "role": "ALUMNO"
    },
    "comments": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Obtener feed
**GET** `/posts`

Obtener feed del usuario (posts propios + usuarios seguidos)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (int) - Número de página (default: 1)
- `limit` (int) - Posts por página (default: 10, max: 100)

**Example:** `GET /posts?page=1&limit=10`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Feed obtenido",
  "data": {
    "posts": [
      {
        "id": "post123",
        "author": { ... },
        "content": "...",
        "likeCount": 5,
        "commentCount": 2,
        "comments": [
          {
            "id": "comment1",
            "content": "¡Excelente!",
            "author": { ... },
            "createdAt": "2024-01-15T11:00:00Z"
          }
        ],
        "likes": [],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

### Obtener post específico
**GET** `/posts/:id`

Obtener un post por ID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "post123",
    "author": { ... },
    "content": "...",
    "comments": [
      {
        "id": "comment1",
        "content": "Comentario",
        "author": { ... },
        "createdAt": "2024-01-15T11:00:00Z"
      }
    ],
    "likes": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Obtener posts de un usuario
**GET** `/posts/user/:userId`

Obtener todos los posts de un usuario específico

**Query Parameters:**
- `page` (int) - Número de página
- `limit` (int) - Posts por página

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Posts del usuario obtenidos",
  "data": {
    "posts": [ ... ],
    "pagination": { ... }
  }
}
```

### Actualizar post
**PUT** `/posts/:id`

Actualizar contenido de un post

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Contenido actualizado",
  "visibility": "FRIENDS_ONLY"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Post actualizado",
  "data": { ... }
}
```

### Eliminar post
**DELETE** `/posts/:id`

Eliminar un post

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Post eliminado"
}
```

### Dar like a post
**POST** `/posts/:id/like`

Agregar like a un post

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Like agregado"
}
```

### Quitar like a post
**DELETE** `/posts/:id/like`

Remover like de un post

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Like removido"
}
```

### Buscar posts
**GET** `/posts/search/:term`

Buscar posts por contenido

**Example:** `GET /posts/search/javascript?limit=10&offset=0`

**Query Parameters:**
- `limit` (int) - Resultados por página
- `offset` (int) - Número resultados a saltar

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Búsqueda de posts realizada",
  "data": {
    "posts": [ ... ],
    "total": 25
  }
}
```

---

## 💬 Comentarios

### Crear comentario
**POST** `/posts/:postId/comments`

Crear comentario en un post

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "¡Excelente post!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Comentario creado exitosamente",
  "data": {
    "id": "comment123",
    "postId": "post123",
    "authorId": "user123",
    "content": "¡Excelente post!",
    "likeCount": 0,
    "author": {
      "id": "user123",
      "firstName": "María",
      "lastName": "García"
    },
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

### Obtener comentarios de post
**GET** `/posts/:postId/comments`

Obtener todos los comentarios de un post

**Query Parameters:**
- `page` (int) - Número de página
- `limit` (int) - Comentarios por página

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Comentarios obtenidos",
  "data": {
    "comments": [ ... ],
    "pagination": { ... }
  }
}
```

### Actualizar comentario
**PUT** `/comments/:id`

Editar contenido de un comentario

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Contenido editado"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Comentario actualizado",
  "data": { ... }
}
```

### Eliminar comentario
**DELETE** `/comments/:id`

Eliminar un comentario

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Comentario eliminado"
}
```

### Dar like a comentario
**POST** `/comments/:id/like`

Agregar like a un comentario

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Like agregado al comentario"
}
```

### Quitar like a comentario
**DELETE** `/comments/:id/like`

Remover like de un comentario

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Like removido del comentario"
}
```

---

## 👥 Conexiones (Follow)

### Seguir usuario
**POST** `/connections/:userId/follow`

Comenzar a seguir a un usuario

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Usuario seguido exitosamente",
  "data": {
    "id": "conn123",
    "followerId": "user123",
    "followingId": "user456",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### Dejar de seguir
**DELETE** `/connections/:userId/follow`

Dejar de seguir a un usuario

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Usuario dejado de seguir"
}
```

### Obtener estado de conexión
**GET** `/connections/:userId/status`

Verificar si estoy siguiendo a un usuario y obtener estadísticas

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "isFollowing": true,
    "followers": 145,
    "following": 89
  }
}
```

### Obtener seguidores
**GET** `/users/:userId/followers`

Obtener lista de seguidores de un usuario

**Query Parameters:**
- `page` (int) - Número de página
- `limit` (int) - Usuarios por página

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Seguidores obtenidos",
  "data": {
    "followers": [
      {
        "id": "user456",
        "firstName": "Carlos",
        "lastName": "López",
        "profileImage": null,
        "role": "ALUMNO",
        "bio": "Estudiante de DAM"
      }
    ],
    "pagination": { ... }
  }
}
```

### Obtener seguidos
**GET** `/users/:userId/following`

Obtener lista de usuarios que sigue

**Query Parameters:**
- `page` (int) - Número de página
- `limit` (int) - Usuarios por página

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Usuarios seguidos obtenidos",
  "data": {
    "following": [ ... ],
    "pagination": { ... }
  }
}
```

### Bloquear usuario
**POST** `/connections/:userId/block`

Bloquear a un usuario

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Usuario bloqueado"
}
```

### Desbloquear usuario
**DELETE** `/connections/:userId/block`

Desbloquear a un usuario

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Usuario desbloqueado"
}
```

### Obtener recomendaciones
**GET** `/connections/recommendations`

Obtener recomendaciones de usuarios a seguir

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (int) - Número de recomendaciones (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Recomendaciones obtenidas",
  "data": [
    {
      "id": "user789",
      "firstName": "Ana",
      "lastName": "Martínez",
      "profileImage": null,
      "bio": "Desarrolladora Full Stack",
      "role": "ALUMNO"
    }
  ]
}
```

---

## 👤 Usuarios

### Obtener perfil público
**GET** `/users/:id`

Obtener información pública de un usuario

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "profileImage": null,
    "bio": "Estudiante de DAM",
    "location": "Málaga",
    "role": "ALUMNO",
    "createdAt": "2024-01-15T10:30:00Z",
    "studentProfile": {
      "cicle": "DAM",
      "specialization": "Desarrollo de Aplicaciones Multiplataforma",
      "skills": "[\"JavaScript\", \"React\", \"Node.js\"]",
      "projects": "[...]",
      "experience": "1 año"
    }
  }
}
```

### Actualizar perfil
**PUT** `/users/profile`

Actualizar información del usuario autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "bio": "Nuevo bio",
  "location": "Granada",
  "profileImage": "https://example.com/profile.jpg"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Perfil actualizado",
  "data": {
    "id": "user123",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "bio": "Nuevo bio",
    "location": "Granada",
    "profileImage": "https://example.com/profile.jpg"
  }
}
```

### Buscar usuarios
**GET** `/users/search/:query`

Buscar usuarios por nombre o email

**Query Parameters:**
- `role` (string) - Filtrar por rol: ALUMNO, CENTRO, EMPRESA
- `limit` (int) - Resultados por página
- `offset` (int) - Resultados a saltar

**Example:** `GET /users/search/juan?role=ALUMNO&limit=20`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Búsqueda realizada",
  "data": {
    "users": [
      {
        "id": "user123",
        "firstName": "Juan",
        "lastName": "Pérez",
        "profileImage": null,
        "role": "ALUMNO"
      }
    ],
    "total": 1
  }
}
```

### Obtener estadísticas
**GET** `/users/:id/stats`

Obtener estadísticas de un usuario (posts, followers, etc)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "postsCount": 12,
    "followersCount": 145,
    "followingCount": 89,
    "likesCount": 324
  }
}
```

---

## 📊 Códigos de estado

| Código | Significado |
|--------|-----------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Datos inválidos |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - No tiene permisos |
| `404` | Not Found - Recurso no existe |
| `409` | Conflict - El recurso ya existe |
| `500` | Internal Server Error - Error del servidor |

---

## 🔒 Autenticación

Todos los endpoints privados requieren el header:
```
Authorization: Bearer <token_jwt>
```

El token expira en 7 días. Usa el endpoint `/auth/refresh-token` para obtener uno nuevo.

---

## ⚠️ Errores comunes

### Token expirado
```json
{
  "success": false,
  "message": "Token expirado",
  "code": "TOKEN_EXPIRED"
}
```

### No autenticado
```json
{
  "success": false,
  "message": "Token no proporcionado"
}
```

### Validación fallida
```json
{
  "success": false,
  "message": "Validación fallida",
  "errors": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

---

**Última actualización:** Enero 2024
