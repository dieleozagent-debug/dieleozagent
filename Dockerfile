FROM node:20-alpine

# Instalar git y pandoc para operaciones locales y conversión de documentos
RUN apk add --no-cache git pandoc

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src/ ./src/

# Directorios necesarios
RUN mkdir -p /app/data /app/repos

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
