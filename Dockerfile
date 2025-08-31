# ===========================
# 1. Etapa de construcción
# ===========================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiamos solo package.json y package-lock.json primero (para cachear dependencias)
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos Nest a dist/
RUN npm run build


# ===========================
# 2. Etapa de ejecución
# ===========================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copiamos solo lo necesario desde la etapa de builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Puerto que expone Nest por defecto
EXPOSE 3000

# Comando de inicio en producción
CMD ["node", "dist/main"]
