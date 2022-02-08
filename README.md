# Ethernauts

Implementation for https://forum.ethernautdao.io/t/deploy-ethernaut-avatar-nfts-to-bootstrap-the-dao-s-tokenomics/299

## Requirements

- Node.js v16.8.0
- NPM v7.21.0
- Docker
- Docker Compose

## Solidity development

The following hardhat tasks will help you to:

- Start a local node: `npx hardhat node`
- Deploy the contract: `npx hardhat deploy`
- Open the sale: `npx hardhat sale-state`
- Mint sample tokens: `npx hardhat mint`

## DAPP/Keeper development

We use Docker and Docker Compose to run the development environment.

Run `docker compose up -d` to start the whole project. It includes the following services:

- `hardhat-node`: (http://localhost:4585)
- `hardhat-deploy`: Takes care of deploying the Ethernauts.sol contract to the docker hardhat network for development
- `dapp` (Next.js) (http://localhost:3000)
- `redis` (https://localhost:6379)
- `keeper-queue`: Node server that listens to mint & batch events and enqueues the necessary jobs to be processed.
- `keeper-worker`: Node server processes the enqueued jobs by `keeper-queue` and executes them with the desired concurrency.

Run `docker compose ps` to check the status of the running services and `docker compose down` to stop them.

---

You can also run/stop a single service using:

- `docker compose up service-name`
- `docker compose down service-name`

### Interacting with the Ethernauts Contract

You can run hardhat tasks inside running docker containers using the `docker compose exec ...` command.

So, first you want to open the sale state, and you can do it with the `sale-state` hardhat task, like so:

```bash
docker compose exec hardhat-node sh -c 'cd /src/packages/hardhat && npx hardhat --network docker sale-state'
```

Then, you will be able to mint any amount of tokens using the `mint` task:

```bash
docker compose exec hardhat-node sh -c 'cd /src/packages/hardhat && npx hardhat --network docker mint'
```

Finally, you can also set the base URL changer address, with:

```bash
docker compose exec hardhat-node sh -c 'cd /src/packages/hardhat && npx hardhat --network docker exec --method setUrlChanger --args ["0x000"]'
```

## Assets Validation

The `provenanceHash` saved at the contract was generated using the IPFS hash for each asset, concatenated in order and getting an MD5 hash from that.

The final deployed provenanceHash, which can be read at the [Deployed Contract](https://optimistic.etherscan.io/address/0xa433e0bf662dd934833c66d4f03711e1cce9c9b2) using the method `Ethernauts.provenanceHash()` is the following:

```
f04a636d10f42ec5a9d4885d30834a70
```

And all the assets in order can be seen at [`provenanceHash-concatenated.txt`](provenanceHash-concatenated.txt)
