FROM node:16.8.0-alpine

WORKDIR /src

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
COPY packages/dapp/package.json /src/packages/dapp/package.json

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

RUN npm -w @ethernauts/dapp ci

COPY . /src