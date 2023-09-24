FROM ghcr.io/puppeteer/puppeteer:21.3.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
COPY ./src/assets ./dist/assets
CMD [ "node", "dist/index.js" ]