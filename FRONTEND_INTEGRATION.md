# 🎨 Frontend FPConnect - Guía de Integración con API

## 📁 Estructura de Carpetas

```
src/
├── components/          # Componentes React reutilizables
│   ├── Feed.jsx        # Feed de posts (ejemplo completo)
│   ├── UserCard.jsx    # Tarjeta de usuario (reutilizable)
│   └── UI.jsx          # Componentes UI básicos
├── pages/              # Páginas principales
│   ├── LoginPage.jsx   # Login/Registro (integrado con API)
│   ├── AlumnoApp.jsx   # App para estudiantes
│   ├── CentroApp.jsx   # App para centros
│   └── EmpresaApp.jsx  # App para empresas
├── services/           # Clientes HTTP y servicios API
│   ├── api.js          # Cliente Axios con interceptores
│   └── index.js        # Todos los servicios (auth, posts, etc)
├── store/              # Estado global (Zustand)
│   └── authStore.js    # Store de autenticación
├── hooks/              # Hooks personalizados
│   └── index.js        # Hooks para cada feature
├── utils/              # Utilidades
├── styles/             # Estilos CSS
├── App.jsx             # Componente raíz
└── main.jsx            # Punto de entrada
```

---

## 🔐 Autenticación

### Login/Registro con Auth Store

```javascript
import { useAuthStore } from '../store/authStore';

function MyComponent() {
  const { login, register, logout, user, isAuthenticated, error } = useAuthStore();

  // Login
  const handleLogin = async () => {
    try {
      await login('email@example.com', 'password123');
      // Usuario autenticado, App redirige automáticamente
    } catch (err) {
      console.error('Login fallido:', err);
    }
  };

  // Register
  const handleRegister = async () => {
    try {
      await register({
        email: 'nuevo@example.com',
        password: 'pass123',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'ALUMNO', // ALUMNO | CENTRO | EMPRESA
      });
    } catch (err) {
      console.error('Registro fallido:', err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    // App redirige a LoginPage automáticamente
  };

  return (
    <div>
      {isAuthenticated && <p>Hola {user?.firstName}!</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
    </div>
  );
}
```

---

## 📝 Posts

### Usar el Hook useFeed()

```javascript
import { useFeed } from '../hooks';

function PostsComponent() {
  const { posts, loading, error, loadFeed, addPost, removePost } = useFeed();

  // Cargar feed
  useEffect(() => {
    loadFeed(1, 10); // página, límite
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.author.firstName}</h3>
          <p>{post.content}</p>
          <button onClick={() => removePost(post.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
```

### Crear Post

```javascript
import { useCreatePost } from '../hooks';

function CreatePostForm() {
  const { createPost, loading, error } = useCreatePost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = await createPost('Mi contenido aquí', 'PUBLIC');
      console.log('Post creado:', newPost);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Like/Unlike en Posts

```javascript
import { useLike } from '../hooks';

function LikeButton({ postId, isLiked }) {
  const { likePost, unlikePost, loading } = useLike();

  const handleClick = async () => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (err) {
      console.error('Error al likes:', err);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {isLiked ? '❤️ Ya le gusta' : '🤍 Me gusta'}
    </button>
  );
}
```

---

## 💬 Comentarios

### Cargar comentarios con useComments()

```javascript
import { useComments } from '../hooks';

function CommentsSection({ postId }) {
  const { comments, loading, addComment, deleteComment } = useComments(postId);

  useEffect(() => {
    loadComments(1, 10);
  }, []);

  const handleAddComment = async (content) => {
    try {
      await addComment(content);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <button onClick={() => deleteComment(comment.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔗 Conexiones/Follows

### Usar useConnections()

```javascript
import { useConnections } from '../hooks';

function FollowSystem() {
  const {
    connections,
    loading,
    loadFollowers,
    loadFollowing,
    loadRecommendations,
    followUser,
    unfollowUser,
  } = useConnections();

  // Cargar al montar
  useEffect(() => {
    loadFollowers();
    loadFollowing();
    loadRecommendations();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      console.log('Usuario seguido');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <h3>Mis Seguidores: {connections.followers?.length}</h3>
      <h3>Siguiendo: {connections.following?.length}</h3>
      
      <h4>Recomendaciones:</h4>
      {connections.recommendations?.map(user => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
          <button onClick={() => handleFollow(user.id)}>Seguir</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 👤 Usuarios

### Buscar usuarios

```javascript
import { useUserSearch } from '../hooks';

function UserSearch() {
  const { results, loading, search } = useUserSearch();

  const handleSearch = (query) => {
    search(query, 1, 10); // query, página, límite
  };

  return (
    <div>
      <input
        placeholder="Buscar usuarios..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {results.map(user => (
        <div key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
        </div>
      ))}
    </div>
  );
}
```

### Obtener perfil público

```javascript
import { usersService } from '../services';

async function getPublicProfile(userId) {
  try {
    const response = await usersService.getProfile(userId);
    console.log('Perfil:', response.data);
  } catch (err) {
    console.error('Error:', err);
  }
}
```

---

## 🌐 Servicios Disponibles

### authService
```javascript
import { authService } from '../services';

authService.register(userData)        // Registrar
authService.login(email, password)    // Login
authService.getMe()                   // Mi perfil
authService.refreshToken(token)       // Refrescar token
authService.logout()                  // Logout
```

### postsService
```javascript
postsService.getFeed(page, limit)              // Feed
postsService.createPost(content, visibility)   // Crear
postsService.getPost(postId)                   // Obtener uno
postsService.getUserPosts(userId, page, limit) // Posts de usuario
postsService.updatePost(id, content, vis)      // Actualizar
postsService.deletePost(postId)                // Eliminar
postsService.likePost(postId)                  // Like
postsService.unlikePost(postId)                // Unlike
postsService.searchPosts(query, page, limit)   // Buscar
```

### commentsService
```javascript
commentsService.createComment(postId, content)
commentsService.getComments(postId, page, limit)
commentsService.updateComment(postId, commentId, content)
commentsService.deleteComment(postId, commentId)
commentsService.likeComment(postId, commentId)
commentsService.unlikeComment(postId, commentId)
```

### connectionsService
```javascript
connectionsService.followUser(userId)
connectionsService.unfollowUser(userId)
connectionsService.getConnectionStatus(userId)
connectionsService.getFollowers(page, limit)
connectionsService.getFollowing(page, limit)
connectionsService.getRecommendations(limit)
connectionsService.blockUser(userId)
connectionsService.unblockUser(userId)
```

### usersService
```javascript
usersService.getProfile(userId)
usersService.updateProfile(updates)
usersService.searchUsers(query, page, limit)
usersService.getStats()
```

---

## ⚙️ Configuración del Backend

El cliente HTTP busca el backend en: `http://localhost:3000/api`

Para cambiar, edita `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // ← Cambiar aquí
```

---

## 🚀 Instalación y Setup

### 1. Instalar dependencias

```bash
npm install
```

Se instalarán:
- `react`: Framework UI
- `react-router-dom`: Enrutamiento (opcional, para implementar luego)
- `axios`: Cliente HTTP
- `zustand`: State management
- `socket.io-client`: WebSocket en tiempo real

### 2. Iniciar frontend

```bash
npm run dev
```

Se abre en: `http://localhost:5173`

### 3. Asegúrate de que backend está corriendo

```bash
# En otra terminal
cd backend
npm run dev
```

Backend en: `http://localhost:3000`

---

## 📱 Componentes Listos para Usar

### Feed.jsx
Componente completo con crear posts, ver feed, likes.

```javascript
import Feed from '../components/Feed';

function MyApp() {
  return <Feed />;
}
```

### UserCard.jsx
Tarjeta de usuario con botón de seguir/dejar de seguir.

```javascript
import UserCard from '../components/UserCard';

function UsersList() {
  return (
    <UserCard
      user={user}
      isFollowing={false}
      onFollow={(id) => console.log('Seguir:', id)}
      onUnfollow={(id) => console.log('Dejar de seguir:', id)}
    />
  );
}
```

---

## 🔄 Manejo de Errores

Todos los servicios devuelven errores estructurados:

```javascript
try {
  await authService.login(email, password);
} catch (error) {
  console.log('Status:', error.status);        // 400, 401, 500, etc
  console.log('Mensaje:', error.message);      // "Email no registrado"
  console.log('Datos:', error.data);           // Respuesta del servidor
}
```

---

## 🔐 Token Management

Los tokens se guardan automáticamente en `localStorage`:
- `token`: Access token (7 días)
- `refreshToken`: Refresh token (30 días)

El cliente HTTP:
1. ✅ Agrega token a cada request
2. ✅ Si expira (401), intenta refrescar
3. ✅ Si refresh falla, hace logout automático

No necesitas gestionar tokens manualmente.

---

## ⏳ Estado de Carga

Cada hook devuelve `loading` boolean:

```javascript
const { posts, loading } = useFeed();

if (loading) return <div>⏳ Cargando...</div>;
return <div>Datos: {posts.length}</div>;
```

---

## 📊 Próximos Componentes para Integrar

| Componente | Estado | Descripción |
|-----------|--------|-------------|
| Feed | ✅ Listo | Feed de posts |
| UserCard | ✅ Listo | Tarjeta usuario |
| Comments | 🟡 Hook Listo | Mostrar comentarios |
| Follow List | 🟡 Hook Listo | Followers/Following |
| Search | 🟡 Hook Listo | Búsqueda de usuarios |
| Job Offers | ⏳ Pendiente | Sistema de ofertas |
| Messages | ⏳ Socket.io | Chat en tiempo real |

---

## 🐛 Debugging

Habilitar logs en `src/services/api.js`:

```javascript
// Antes de hacer request
api.interceptors.request.use((config) => {
  console.log('📤 Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Después de recibir respuesta
api.interceptors.response.use((response) => {
  console.log('✅ Response:', response);
  return response;
});
```

---

## 📚 Recursos

- **Axios Docs**: https://axios-http.com/
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **React Hooks**: https://react.dev/reference/react/hooks
- **Backend API Docs**: `/backend/API_ENDPOINTS.md`

---

¡Listo! Ya tienes todo para integrar el frontend con la API. 🚀

Próximos pasos:
1. Actualizar AlumnoApp.jsx, CentroApp.jsx, EmpresaApp.jsx
2. Agregar más componentes (search, followers, etc)
3. Implementar Socket.io para notificaciones en tiempo real
4. Agregar más páginas según necesites
