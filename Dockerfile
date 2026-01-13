FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps chromium

COPY . .

ENV PLAYWRIGHT_BROWSERS_PATH=0
ENV NODE_ENV=production

CMD ["node", "server.js"]
