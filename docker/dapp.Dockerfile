FROM node:16.13.2-alpine

WORKDIR /src

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
COPY packages/dapp/package.json /src/packages/dapp/package.json
COPY packages/hardhat/package.json /src/packages/hardhat/package.json

RUN npm -w @ethernauts/hardhat -w @ethernauts/dapp ci

COPY . /src
