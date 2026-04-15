# 🗄️ GUÍA DE CONFIGURACIÓN - PostgreSQL y Base de Datos

## Opción 1: PostgreSQL Local (Windows)

### 1. Descargar e Instalar PostgreSQL

1. Ve a [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Descarga la última versión (14+)
3. Ejecuta el instalador
4. **Importante**: Anota el password del usuario `postgres`
5. Deja los valores por defecto (puerto 5432)

### 2. Crear Base de Datos

Abre **pgAdmin** (viene con PostgreSQL):

```sql
-- Crear usuario específico
CREATE USER fpconnect_user WITH PASSWORD 'fpconnect_pass';

-- Crear base de datos
CREATE DATABASE fpconnect_db OWNER fpconnect_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE fpconnect_db TO fpconnect_user;
```

O por línea de comandos (PowerShell):

```powershell
# Conectar como postgres
psql -U postgres

# Ejecutar los comandos SQL arriba
```

### 3. Verificar Conexión

```bash
psql -U fpconnect_user -d fpconnect_db -h localhost
# Si pide password: fpconnect_pass
```

---

## Opción 2: PostgreSQL con Docker

Mucho más rápido si tienes Docker instalado:

```bash
docker run --name fpconnect-db \
  -e POSTGRES_USER=fpconnect_user \
  -e POSTGRES_PASSWORD=fpconnect_pass \
  -e POSTGRES_DB=fpconnect_db \
  -p 5432:5432 \
  -d postgres:15
```

Verificar que está corriendo:

```bash
docker ps
docker logs fpconnect-db
```

---

## Configurar Backend

### 1. Crear archivo `.env`

En la carpeta `/backend`:

```bash
cp .env.example .env
```

Editar `.env`:

```env
# Base de Datos
DATABASE_URL="postgresql://fpconnect_user:fpconnect_pass@localhost:5432/fpconnect_db"

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_25_caracteres
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_min_25_caracteres

# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

**Nota**: Los secrets pueden ser cualquier string, pero mínimo 25 caracteres para seguridad

### 2. Instalar Dependencias

```bash
cd backend
npm install
```

### 3. Configurar Prisma

Generar cliente de Prisma:

```bash
npx prisma generate
```

---

## Ejecutar Migraciones

### Primera vez - Crear todas las tablas:

```bash
npm run db:setup
```

Esto ejecuta:
- `prisma migrate deploy` (ejecuta migraciones)
- `prisma generate` (genera cliente)
- `node prisma/seed.js` (carga datos iniciales)

### Ver base de datos visualmente:

```bash
npx prisma studio
```

Se abre en `http://localhost:5555` - puedes ver y editar todos los datos

### Ver estado de migraciones:

```bash
npx prisma migrate status
```

---

## Problemas Comunes

### ❌ Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Solución:**
- PostgreSQL no está corriendo
- Si instalaste localmente: abre pgAdmin o reinicia el servicio
- Si usas Docker: `docker start fpconnect-db`

### ❌ Error: "password authentication failed"

**Solución:**
- Usuario/contraseña incorrecto en `.env`
- Verifica: `psql -U fpconnect_user -d fpconnect_db`

### ❌ Error: "database fpconnect_db does not exist"

**Solución:**
```bash
# Conectar como postgres
psql -U postgres

# Crear BD
CREATE DATABASE fpconnect_db OWNER fpconnect_user;
```

### ❌ Error: "Prisma schema validation failed"

**Solución:**
```bash
# Regenerar cliente
npx prisma generate

# Limpiar caché
rm -rf node_modules/.prisma
npm install
```

---

## Iniciar Servidor

Una vez configurado todo:

```bash
npm run dev
```

Deberías ver:
```
✓ Servidor corriendo en http://localhost:3000
✓ Base de datos conectada
```

---

## Verificar que funciona

Abre Postman o Terminal y prueba:

```bash
# Healthcheck
curl http://localhost:3000/health

# Debería responder:
# {"status":"OK","database":"connected"}
```

---

## Timeline esperado

| Tarea | Tiempo |
|-------|--------|
| Installing PostgreSQL | 10 min |
| Crear BD | 2 min |
| npm install | 3 min |
| npm run db:setup | 5 min |
| npm run dev | 1 min |
| **Total** | **~20 min** |

---

## Próximos Pasos

✅ Base de datos funcional  
✅ Servidor corriendo  
⏭️ **Siguiente**: Integrar frontend (React)

```bash
# En otra terminal, en la carpeta padre
cd ..
npm run dev  # Inicia Vite en :5173
```

---

## Comandos Útiles

```bash
# En carpeta /backend

# Iniciar en modo desarrollo con hot-reload
npm run dev

# Ver BD en interfaz Prisma
npx prisma studio

# Crear nueva migración (después de cambiar schema)
npx prisma migrate dev --name nombre_migracion

# Resetear BD (⚠️ borra todo)
npx prisma migrate reset

# Ver logs de BD
npm run db:logs

# Validar schema
npx prisma validate

# Ver estado general
npm run health
```

---

## Recursos

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Prisma Docs**: https://www.prisma.io/docs/
- **Docker**: https://www.docker.com/
- **pgAdmin**: https://www.pgadmin.org/

---

Cualquier duda sobre la base de datos, revisa los logs:

```bash
npm run dev  # Ver logs en tiempo real
```

¡Listo para codificar! 🚀
