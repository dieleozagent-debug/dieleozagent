FROM node:20-alpine

# Instalar git, pandoc, tesseract y poppler para operaciones soberanas de documentos
RUN apk add --no-cache bash git pandoc tesseract-ocr tesseract-ocr-data-spa poppler-utils ttf-dejavu font-noto

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src/ ./src/

# Directorios necesarios
RUN mkdir -p /app/data /app/repos

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
