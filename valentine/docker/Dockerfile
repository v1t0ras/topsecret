# Dockerfile — Valentine's Day Website
FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/valentine.conf

# Copy all site files into nginx serving directory
COPY .. /usr/share/nginx/html/

# Exclude docker folder from serving (clean)
RUN rm -rf /usr/share/nginx/html/docker

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1