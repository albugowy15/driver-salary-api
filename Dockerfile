FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM build AS production

WORKDIR /app

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "dist/index.js"]
