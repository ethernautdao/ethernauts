FROM node:16.8.0-alpine

WORKDIR /src

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
COPY packages/hardhat/package.json /src/packages/hardhat/package.json
COPY packages/keeper/package.json /src/packages/keeper/package.json

RUN npm -w @ethernauts/keeper -w @ethernauts/hardhat ci

COPY . /src

CMD [ "npm", "-w", "@ethernauts/keeper", "run", "start:mints-listener" ]
