FROM node:16.8.0-alpine

WORKDIR /src

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
COPY packages/hardhat/package.json /src/packages/hardhat/package.json

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm -w @ethernauts/hardhat ci

COPY . /src
