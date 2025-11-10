FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY shared ./shared
COPY apps/api-gateway ./apps/api-gateway

RUN npm run build:gateway

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/apps/api-gateway/src/main.js"]
