
FROM node:alpine

WORKDIR /app

COPY . .

RUN npm ci --only=production

RUN npm install --global typescript@latest

RUN npm run prepack

ENTRYPOINT [ "./bin/run" ]

