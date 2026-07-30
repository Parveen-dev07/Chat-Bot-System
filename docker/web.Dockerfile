FROM node:22-alpine

WORKDIR /app

RUN npm install -g npm@11.6.2

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/types/package.json ./packages/types/package.json

RUN npm ci

COPY apps/web ./apps/web
COPY packages/types ./packages/types

WORKDIR /app/apps/web

RUN echo " VITE_API_URL=https://chxt-bot.duckdns.org/api" > .env && \
    echo "VITE_SOCKET_URL=https://chxt-bot.duckdns.org" >> .env

RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]   