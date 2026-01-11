# Utiliser l'image Node.js officielle
FROM node:20-alpine AS base

# Installer pnpm
RUN npm install -g pnpm

# Étape de build
FROM base AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste des fichiers
COPY . .

# Générer le client Prisma
RUN pnpm exec prisma generate

# Étape de production
FROM base AS runner

WORKDIR /app

# Copier les dépendances depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma/

# Copier le code source
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p uploads/gallery uploads/pp temp

# Exposer le port
EXPOSE 3000

# Script de démarrage
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "start"]
