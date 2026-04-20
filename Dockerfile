# ===== Build Stage =====
FROM node:20-alpine AS build

WORKDIR /app

# Install project dependencies
COPY package*.json ./
RUN npm install

# Build the Vite React app
COPY . .
RUN npm run build


# ===== Production Stage (Nginx) =====
FROM nginx:alpine

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite 'dist' build from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
