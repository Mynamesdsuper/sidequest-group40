# Multi-stage image of the backend (used by docker-compose.demo.yml).
# Stage 1: install all dependencies and compile TypeScript.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json tsconfig.build.json ./
COPY scripts ./scripts
COPY src ./src
RUN npm run build

# Stage 2: production dependencies and the compiled code only.
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
# Applies pending migrations, then starts the API.
CMD ["sh", "-c", "node dist/db/cli.js migrate && node dist/server.js"]
