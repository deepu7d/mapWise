FROM node:18-alpine AS base

# Add necessary tools
RUN apk add --no-cache libc6-compat

# Install turbo globally
RUN npm install -g turbo pnpm

# Stage 1: Builder - prune the monorepo for server dependencies
FROM base AS builder

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Prune the monorepo for the server app with Docker optimization
RUN turbo prune server --docker

# Stage 2: Installer - install dependencies
FROM base AS installer

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy the pruned JSON files (package.json and lockfile)
COPY --from=builder /app/out/json/ .

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Stage 3: Source - add the full source code
FROM installer AS sourcer

WORKDIR /app

# Copy the pruned full source
COPY --from=builder /app/out/full/ .

# Accept Turbo cache secrets as build arguments
ARG TURBO_TEAM
ARG TURBO_TOKEN
# Set them as environment variables *only for this stage*
ENV TURBO_TEAM=$TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN

# Generate Prisma client and build
RUN pnpm turbo run build --filter=server

# Stage 4: Runtime - final image
FROM base AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application from sourcer
COPY --from=sourcer --chown=nodejs:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=sourcer --chown=nodejs:nodejs /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=sourcer --chown=nodejs:nodejs /app/apps/server/package.json ./apps/server/package.json
COPY --from=sourcer --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=sourcer --chown=nodejs:nodejs /app/package.json ./package.json

# Copy Prisma files
COPY --from=sourcer --chown=nodejs:nodejs /app/apps/server/prisma ./apps/server/prisma

USER nodejs

EXPOSE 8000

CMD ["node", "apps/server/dist/server.js"]
