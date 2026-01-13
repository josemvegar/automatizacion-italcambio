FROM mcr.microsoft.com/playwright:v1.57.0-jammy

ENV PLAYWRIGHT_BROWSERS_PATH=0
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000
CMD ["node", "server.js"]
