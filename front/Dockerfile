# Étape de build
FROM node:20-alpine AS builder

# Installer pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste des fichiers
COPY . .

# Argument pour l'URL de l'API
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build de l'application
RUN pnpm run build

# Étape de production
FROM node:20-alpine

WORKDIR /app

# Installer serve globalement
RUN npm install -g serve

# Copier les fichiers buildés
COPY --from=builder /app/dist ./dist

EXPOSE 80

# Servir l'application avec serve
CMD ["serve", "-s", "dist", "-l", "80"]
