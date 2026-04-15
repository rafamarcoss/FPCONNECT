#!/bin/bash

# Script para testear los endpoints principales de FPConnect API

BASE_URL="http://localhost:3000/api"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para hacer requests
call_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local token=$4
  
  echo -e "\n${YELLOW}[${method}] ${BASE_URL}${endpoint}${NC}"
  
  if [ -z "$token" ]; then
    curl -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$BASE_URL$endpoint" | jq .
  else
    curl -X "$method" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $token" \
      -d "$data" \
      "$BASE_URL$endpoint" | jq .
  fi
}

echo -e "${GREEN}===============================\n  FPCONNECT API TEST SUITE\n===============================${NC}"

# 1. REGISTRO
echo -e "\n${YELLOW}1. Registro de usuario${NC}"
REGISTER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-'$(date +%s)'@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User",
    "role": "ALUMNO"
  }' \
  "$BASE_URL/auth/register")

echo "$REGISTER_RESPONSE" | jq .

# Extraer token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.id')

echo -e "${GREEN}✓ Token obtenido: ${TOKEN:0:20}...${NC}"
echo -e "${GREEN}✓ User ID: ${USER_ID}${NC}"

# 2. LOGIN
echo -e "\n${YELLOW}2. Login de usuario${NC}"
EMAIL=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.email')
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"TestPass123\"
  }" \
  "$BASE_URL/auth/login")

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

# 3. OBTENER PERFIL
echo -e "\n${YELLOW}3. Obtener perfil actual${NC}"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/auth/me" | jq .

# 4. CREAR POST
echo -e "\n${YELLOW}4. Crear post${NC}"
POST_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "¡Hola! Este es mi primer post en FPConnect 🚀",
    "visibility": "PUBLIC"
  }' \
  "$BASE_URL/posts")

echo "$POST_RESPONSE" | jq .
POST_ID=$(echo "$POST_RESPONSE" | jq -r '.data.id')

# 5. OBTENER FEED
echo -e "\n${YELLOW}5. Obtener feed${NC}"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/posts?page=1&limit=5" | jq .

# 6. COMENTAR POST
echo -e "\n${YELLOW}6. Crear comentario${NC}"
COMMENT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content": "¡Buena onda! 👍"}' \
  "$BASE_URL/posts/$POST_ID/comments")

echo "$COMMENT_RESPONSE" | jq .
COMMENT_ID=$(echo "$COMMENT_RESPONSE" | jq -r '.data.id')

# 7. DAR LIKE A POST
echo -e "\n${YELLOW}7. Dar like a post${NC}"
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/posts/$POST_ID/like" | jq .

# 8. OBTENER COMENTARIOS
echo -e "\n${YELLOW}8. Obtener comentarios del post${NC}"
curl -s -X GET \
  "$BASE_URL/posts/$POST_ID/comments" | jq .

# 9. REGISTRAR SEGUNDO USUARIO (para probar follow)
echo -e "\n${YELLOW}9. Crear segundo usuario para seguir${NC}"
REGISTER2_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2-'$(date +%s)'@example.com",
    "password": "TestPass123",
    "firstName": "Usuario",
    "lastName": "Dos",
    "role": "ALUMNO"
  }' \
  "$BASE_URL/auth/register")

USER2_ID=$(echo "$REGISTER2_RESPONSE" | jq -r '.data.user.id')
echo "$REGISTER2_RESPONSE" | jq .

# 10. SEGUIR USUARIO
echo -e "\n${YELLOW}10. Seguir a usuario${NC}"
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/connections/$USER2_ID/follow" | jq .

# 11. VER ESTADO DE CONEXIÓN
echo -e "\n${YELLOW}11. Ver estado de conexión${NC}"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/connections/$USER2_ID/status" | jq .

# 12. BUSCAR USUARIOS
echo -e "\n${YELLOW}12. Buscar usuarios${NC}"
curl -s -X GET \
  "$BASE_URL/users/search/test?limit=10" | jq .

# 13. OBTENER PERFIL PÚBLICO
echo -e "\n${YELLOW}13. Obtener perfil público${NC}"
curl -s -X GET \
  "$BASE_URL/users/$USER2_ID" | jq .

# 14. OBTENER ESTADÍSTICAS
echo -e "\n${YELLOW}14. Obtener estadísticas de usuario${NC}"
curl -s -X GET \
  "$BASE_URL/users/$USER_ID/stats" | jq .

# 15. BÚSQUEDA DE POSTS
echo -e "\n${YELLOW}15. Búsqueda de posts${NC}"
curl -s -X GET \
  "$BASE_URL/posts/search/FPConnect?limit=5" | jq .

echo -e "\n${GREEN}===============================\n  TESTS COMPLETADOS ✓\n===============================${NC}\n"
