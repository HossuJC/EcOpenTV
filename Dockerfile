FROM ghcr.io/puppeteer/puppeteer:21.3.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run copy-channels
RUN npm run create-directory
CMD [ "node", "dist/index.js" ]