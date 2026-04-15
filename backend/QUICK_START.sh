#!/bin/bash

# 🚀 GUÍA DE INICIO RÁPIDO - FPCONNECT API

echo "╔════════════════════════════════════════════╗"
echo "║   📋 FPConnect API - Guía Inicio Rápido    ║"
echo "╚════════════════════════════════════════════╝"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Setup inicial
echo -e "\n${BLUE}→ Paso 1: Instalar dependencias${NC}"
echo "cd backend && npm install"

# 2. Base de datos
echo -e "\n${BLUE}→ Paso 2: Configurar PostgreSQL${NC}"
echo "   Opción A (Local):"
echo "   - Instalar PostgreSQL 14+"
echo "   - Crear BD: fpconnect_db"
echo "   - Usuario: fpconnect_user / contraseña: fpconnect_pass"
echo ""
echo "   Opción B (Docker):"
echo "   docker run -e POSTGRES_USER=fpconnect_user \\"
echo "             -e POSTGRES_PASSWORD=fpconnect_pass \\"
echo "             -e POSTGRES_DB=fpconnect_db \\"
echo "             -p 5432:5432 postgres:15"

# 3. Configurar .env
echo -e "\n${BLUE}→ Paso 3: Crear archivo .env${NC}"
echo "cp .env.example .env"
echo ""
echo "Editar .env con:"
echo "- DATABASE_URL=postgresql://fpconnect_user:fpconnect_pass@localhost:5432/fpconnect_db"
echo "- JWT_SECRET=<contraseña_muy_larga_25_caracteres>"

# 4. Migraciones
echo -e "\n${BLUE}→ Paso 4: Ejecutar migraciones${NC}"
echo "npm run db:setup"
echo "npm run db:generate"

# 5. Iniciar servidor
echo -e "\n${BLUE}→ Paso 5: Iniciar servidor${NC}"
echo "npm run dev"
echo ""
echo -e "${GREEN}✓ Servidor corriendo en http://localhost:3000${NC}"

# 6. Primeras requests
echo -e "\n${BLUE}→ Paso 6: Probar API${NC}"
echo ""
echo "1. REGISTRAR USUARIO:"
echo "   curl -X POST http://localhost:3000/api/auth/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"email\": \"test@example.com\","
echo "       \"password\": \"TestPass123\","
echo "       \"firstName\": \"Test\","
echo "       \"lastName\": \"User\","
echo "       \"role\": \"ALUMNO\""
echo "     }'"
echo ""
echo "2. LOGIN:"
echo "   curl -X POST http://localhost:3000/api/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"email\": \"test@example.com\","
echo "       \"password\": \"TestPass123\""
echo "     }'"
echo ""
echo "3. CREAR POST (usar token del login):"
echo "   curl -X POST http://localhost:3000/api/posts \\"
echo "     -H 'Authorization: Bearer <token>' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"content\": \"¡Hola FPConnect!\","
echo "       \"visibility\": \"PUBLIC\""
echo "     }'"

# 7. Herramientas útiles
echo -e "\n${BLUE}→ Herramientas útiles${NC}"
echo ""
echo "📊 Prisma Studio (interfaz visual por BD):"
echo "   npx prisma studio"
echo ""
echo "🧪 Testear todos endpoints:"
echo "   bash test-endpoints.sh"
echo ""
echo "📚 Ver documentación:"
echo "   - API_ENDPOINTS.md  (referencia de endpoints)"
echo "   - ENDPOINTS_SUMMARY.md (lista rápida)"
echo "   - ARCHITECTURE.md (flujos y diagramas)"

# 8. Endpoints principales
echo -e "\n${BLUE}→ Endpoints principales implementados${NC}"
echo ""
echo "AUTENTICACIÓN:"
echo "  POST   /api/auth/register"
echo "  POST   /api/auth/login"
echo "  GET    /api/auth/me"
echo ""
echo "POSTS:"
echo "  POST   /api/posts          (crear)"
echo "  GET    /api/posts          (feed)"
echo "  POST   /api/posts/:id/like (like)"
echo ""
echo "COMENTARIOS:"
echo "  POST   /api/posts/:id/comments"
echo "  GET    /api/posts/:id/comments"
echo ""
echo "CONEXIONES:"
echo "  POST   /api/connections/:userId/follow"
echo "  GET    /api/connections/:userId/status"
echo ""
echo "USUARIOS:"
echo "  GET    /api/users/search/:query"
echo "  GET    /api/users/:id/stats"

# 9. Estructura
echo -e "\n${BLUE}→ Estructura del proyecto${NC}"
echo ""
echo "backend/"
echo "├── src/"
echo "│   ├── config/         (BD, JWT, logger)"
echo "│   ├── controllers/    (HTTP handlers)"
echo "│   ├── routes/         (definición endpoints)"
echo "│   ├── services/       (lógica negocio)"
echo "│   ├── middlewares/    (auth, validación)"
echo "│   └── sockets/        (WebSocket)"
echo "├── prisma/"
echo "│   ├── schema.prisma   (modelos BD)"
echo "│   └── seed.js         (datos iniciales)"
echo "├── .env.example"
echo "├── package.json"
echo "└── README.md"

# Fin
echo -e "\n${GREEN}═════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ ¡Listo para empezar!${NC}"
echo -e "${GREEN}═════════════════════════════════════════════${NC}\n"

echo "Próximos pasos:"
echo "1. Configura PostgreSQL"
echo "2. Copia .env"
echo "3. Corre: npm run db:setup"
echo "4. Corre: npm run dev"
echo "5. ¡A programar! 🚀"
