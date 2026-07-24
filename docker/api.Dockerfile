FROM node:22-alpine

WORKDIR /app

RUN npm install -g npm@11.6.2

COPY package.json package-lock.json ./

COPY apps/api/package.json ./apps/api/package.json

COPY packages/types/package.json ./packages/types/package.json

RUN npm ci

# COPY apps/api ./apps/api
COPY apps/api-not-found ./apps/api

COPY packages/types ./packages/types

RUN npm run build --workspace=api

WORKDIR /app/apps/api

EXPOSE 5000

CMD ["npm", "start"]