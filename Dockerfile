FROM node:20-bookworm

# 1. Definimos una ruta fija y global para los navegadores
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install

# 2. Instalamos los navegadores en la ruta global y damos permisos
# Usamos 'chromium' directamente para evitar el headless_shell si no es necesario
RUN npx playwright install --with-deps chromium && \
    chmod -R 777 /ms-playwright

COPY . .

EXPOSE 8000

# Usamos el usuario node por seguridad, pero ahora ya tiene acceso a la carpeta global
USER node

CMD ["node", "server.js"]