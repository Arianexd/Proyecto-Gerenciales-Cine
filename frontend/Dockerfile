# === STAGE 1: Construcción ===
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Definir la variable de entorno para la compilación
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Construir la aplicación Next.js
RUN npm run build

# === STAGE 2: Producción ===
FROM node:18-alpine AS runner

WORKDIR /app

# Establecer entorno a producción
ENV NODE_ENV production

# Copiar archivos estáticos y el output standalone generado
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 5173
ENV PORT 5173
ENV HOSTNAME "0.0.0.0"

# Ejecutar el servidor standalone (ya no necesitamos npm run start)
CMD ["node", "server.js"]
