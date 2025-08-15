FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS dev-builder
COPY .env.development .env
RUN npm run build

FROM base AS prod-builder
COPY .env.production .env
RUN npm run build

FROM node:18-alpine AS dev
WORKDIR /app
COPY --from=dev-builder /app/.next ./.next
COPY --from=dev-builder /app/node_modules ./node_modules
COPY --from=dev-builder /app/package.json ./package.json
COPY --from=dev-builder /app/public ./public
COPY --from=dev-builder /app/.env ./.env
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=prod-builder /app/.next ./.next
COPY --from=prod-builder /app/node_modules ./node_modules
COPY --from=prod-builder /app/package.json ./package.json
COPY --from=prod-builder /app/public ./public
COPY --from=prod-builder /app/.env ./.env
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]