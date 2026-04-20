FROM node:18-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk update && apk add openssl

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# The command is defined in docker-compose.yml to run migrations and start the server
CMD ["npm", "start"]
