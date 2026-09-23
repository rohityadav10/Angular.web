# ──────────────────────────────────────────────
# Stage 1: Build Angular app with Node
# ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files first (layer caching)
COPY angular.web/package.json angular.web/package-lock.json ./

# Install dependencies (cached unless package files change)
RUN npm ci

# Copy remaining source code
COPY angular.web/ .

# Build for production
RUN npm run build -- --configuration production

# ──────────────────────────────────────────────
# Stage 2: Serve with Nginx (no Node — smaller, faster)
# ──────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config for Angular SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from build stage
COPY --from=build /app/dist/angular.web/browser /usr/share/nginx/html

# Create non-root user
RUN adduser -D -g '' nginxuser && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    chown -R nginxuser:nginxuser /var/cache/nginx && \
    chown -R nginxuser:nginxuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
