FROM node:current-alpine
RUN apk --no-cache add git

WORKDIR /app

COPY package.json package-lock.json ./


RUN npm i --silent

COPY . .

ENTRYPOINT [ "node", "--experimental-loader=./util/loader.js", "." ]