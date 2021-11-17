# Ethernauts

WIP implementation for https://forum.ethernautdao.io/t/deploy-ethernaut-avatar-nfts-to-bootstrap-the-dao-s-tokenomics/299

## Getting Started

Lorem ipsum

### Solidity development

The following hardhat tasks will help you to:

- Start a local node: `npx hardhat node`
- Deploy the contract: `npx hardhat deploy`
- Open the sale: `npx hardhat sale-state`
- Mint sample tokens: `npx hardhat mint`

### DAPP development

We use Docker and Docker Compose to run the development environment.

Run `docker-compose -f docker/development.docker-compose.yml up` to start the whole project. It includes the following services:

- `hardhat-node`: (http://localhost:4585)
- `hardhat-deploy`
- `ipfs` (http://localhost:5001)
- `dapp` (Next.js) (http://localhost:3000)
- `redis` (https://localhost:6379)
- `keeper`

Run `docker-compose -f docker/development.docker-compose.yml down` to stop them.

---

You can also run/stop a single service using:

- `docker-compose -f docker/development.docker-compose.yml up service-name`
- `docker-compose -f docker/development.docker-compose.yml down service-name`
