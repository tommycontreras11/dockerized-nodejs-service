FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY config ./config
COPY src ./src

EXPOSE 3000

CMD ["node", "src/index.js"]