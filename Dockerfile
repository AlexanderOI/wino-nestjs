FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

RUN pnpm build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]

EXPOSE 3000
