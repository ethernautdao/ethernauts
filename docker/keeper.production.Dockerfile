FROM node:16.13.2-alpine as dependencies

ENV NODE_ENV=production

RUN mkdir /src && chown -R node:node /src

WORKDIR /src

USER node

COPY --chown=node:node package.json /src/package.json
COPY --chown=node:node package-lock.json /src/package-lock.json
COPY --chown=node:node packages/hardhat/package.json /src/packages/hardhat/package.json
COPY --chown=node:node packages/keeper/package.json /src/packages/keeper/package.json

RUN npm -w @ethernauts/keeper -w @ethernauts/hardhat ci

FROM node:16.13.2-alpine

ENV NODE_ENV=production

RUN mkdir /src && chown -R node:node /src

WORKDIR /src

USER node

COPY --chown=node:node package.json /src/package.json
COPY --chown=node:node package-lock.json /src/package-lock.json
COPY --chown=node:node packages/hardhat /src/packages/hardhat
COPY --chown=node:node packages/keeper /src/packages/keeper

COPY --chown=node:node --from=dependencies /src/node_modules /src/node_modules
COPY --chown=node:node --from=dependencies /src/packages/hardhat/node_modules /src/packages/hardhat/node_modules
COPY --chown=node:node --from=dependencies /src/packages/keeper/node_modules /src/packages/keeper/node_modules

RUN cd /src/packages/hardhat && npx hardhat compile && cd /src
