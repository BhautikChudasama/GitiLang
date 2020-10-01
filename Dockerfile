
FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install

ENTRYPOINT [ "./bin/run" ]

