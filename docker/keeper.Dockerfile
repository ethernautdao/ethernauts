FROM node:16.13.2-alpine

WORKDIR /src

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
COPY packages/hardhat/package.json /src/packages/hardhat/package.json
COPY packages/keeper/package.json /src/packages/keeper/package.json

RUN npm -w @ethernauts/keeper -w @ethernauts/hardhat ci

COPY ./packages/hardhat /src/packages/hardhat
COPY ./packages/keeper /src/packages/keeper
