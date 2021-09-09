# Ethernauts

WIP implementation for https://forum.ethernautdao.io/t/deploy-ethernaut-avatar-nfts-to-bootstrap-the-dao-s-tokenomics/299

#### IPFS Demo
* Init and start IPFS daemon
  * Non M1 macs: `start:local:ipfs`
  * M1 macs: Install ipfs natively, then `ipfs init`, then `ipfs daemon`
* Confirm IPFS node is running with dashboard at `localhost:5001/webui`
* Configure local node with Pinata
  * On dashboard settings
  * If Pinata service exists, delete it
  * Add service, Pinata, set JWT token
* Run `npm run create:dummy:assets`
* Run `npx hardhat node`
* Run `npx hardhat run scripts/deploy.js --network local`
* Run `npx hardhat run scripts/bot.js --network local`
* Run `npx hardhat run scripts/simulate-mints.js --network local`
* Press keys on simulate mints
* Observe activity on dashboard
* Use brave to browse metadata.image url
