FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY prisma ./prisma

RUN npx prisma generate

COPY shared ./shared
COPY apps/user-service ./apps/user-service

RUN npm run build:user

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/apps/user-service/apps/user-service/src/main.js"]
