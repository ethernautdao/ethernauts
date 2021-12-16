FROM node:16.8.0-alpine

WORKDIR /src

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
COPY packages/dapp/package.json /src/packages/dapp/package.json

RUN npm -w @ethernauts/dapp ci

COPY . /src