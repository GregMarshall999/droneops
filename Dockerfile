FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build-only

FROM node:22-alpine AS production

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 8502
CMD ["serve", "-s", "dist", "-l", "8502"]
