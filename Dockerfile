# 1. Usamos una imagen de Node limpia (similar a un SO virgen)
FROM node:20-bookworm

# 2. Saltamos la descarga de navegadores en el 'npm install' para controlarla después
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV NODE_ENV=production

WORKDIR /app

# 3. Instalamos las dependencias de tu proyecto
COPY package*.json ./
RUN npm ci

# 4. AHORA instalamos los navegadores y sus dependencias de sistema
# Esto es lo que hace que funcione como en tu PC
RUN npx playwright install --with-deps chromium

COPY . .

EXPOSE 8000

# Usamos el usuario por defecto de node por seguridad
USER node

CMD ["node", "server.js"]