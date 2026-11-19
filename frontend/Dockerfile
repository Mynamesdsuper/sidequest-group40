# Image of the frontend (used by docker-compose.demo.yml).
# Stage 1: install dependencies and build the production bundle.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY angular.json tsconfig.json tsconfig.app.json ./
COPY public ./public
COPY src ./src
RUN npx ng build --configuration production

# Stage 2: static files served by nginx, with the SPA fallback to index.html.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
