# builder
FROM node:20-alpine as builder

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package.json pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./src ./src

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Prisma 클라이언트 생성
RUN npx prisma generate --schema=./src/shared/prisma/schema.prisma

RUN pnpm run build

# production
FROM node:20-alpine as production

RUN apk add --no-cache openssl

ARG NODE_ENV='production'
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# 필요한 파일들만 builder에서 복사
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY .env ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

CMD ["node", "dist/main"]