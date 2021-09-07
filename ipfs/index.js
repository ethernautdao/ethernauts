const path = require('path');
const CID = require('cids');
const fs = require('fs/promises');
const ipfsClient = require('ipfs-http-client');

const config = require('../config');
const { ensureIpfsUriPrefix, stripIpfsUriPrefix, extractCID } = require('./utils');

// ipfs.add parameters for more deterministic CIDs
const ipfsAddOptions = {
  cidVersion: 1,
  hashAlg: 'sha2-256',
  wrapWithDirectory: true, // useful to create folders
};

class IpfsForEthernaut {
  constructor() {
    this.ipfs = ipfsClient.create(config.ipfsApiUrl);
  }

  async uploadToLocalIpfsNode(content, options) {
    // add the asset to IPFS
    const filePath = options.path;

    if (!filePath) {
      throw new Error('unable to get the path');
    }

    const basename = path.basename(filePath);
    const filename = path.parse(filePath).name;

    const ipfsPath = '/assets/' + basename; // e.g. ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/assets/0.png
    const matadataPath = '/metadata/' + filename + '.json'; // e.g. ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/metadata/0.json

    const { cid: assetCid } = await this.ipfs.add({ path: ipfsPath, content }, ipfsAddOptions);

    // make the NFT metadata JSON
    const assetURI = ensureIpfsUriPrefix(assetCid) + ipfsPath;
    const metadata = await this.makeNFTMetadata(assetURI, options);

    const { cid: metadataCid } = await this.ipfs.add(
      { path: matadataPath, content: JSON.stringify(metadata) },
      ipfsAddOptions
    );

    const metadataURI = ensureIpfsUriPrefix(metadataCid) + matadataPath;

    // format and return the results
    return {
      metadata,
      assetURI,
      metadataURI,
      assetGatewayURL: this.makeGatewayURL(assetURI),
      metadataGatewayURL: this.makeGatewayURL(metadataURI),
    };
  }

  async uploadToLocalIpfsNodeFromAssetFile(filename, options) {
    const content = await fs.readFile(filename);

    return this.uploadToLocalIpfsNode(content, {
      ...options,
      path: filename,
    });
  }

  async makeNFTMetadata(assetURI, options) {
    const { name, description } = options;

    const image = ensureIpfsUriPrefix(assetURI);

    return {
      name,
      description,
      image,
    };
  }

  async pin(cidOrURI) {
    const cid = extractCID(cidOrURI);

    // Configure pinning service
    await this._configurePinningService();

    // Check if we've already pinned this CID to avoid a "duplicate pin" error.
    const pinned = await this.isAlreadyPinned(cid);

    if (pinned) {
      return;
    }

    // Ask the remote service to pin the content.
    // Behind the scenes, this will cause the pinning service to connect to our local IPFS node
    // and fetch the data using Bitswap, IPFS's transfer protocol.
    await this.ipfs.pin.remote.add(cid, { service: config.pinningService.name });
  }

  async _configurePinningService() {
    // check if the service has already been added to js-ipfs
    for (const svc of await this.ipfs.pin.remote.service.ls()) {
      if (svc.service === config.pinningService.name) {
        // service is already configured, no need to do anything
        return;
      }
    }

    // add the service to IPFS
    const { name, endpoint, key } = config.pinningService;

    await this.ipfs.pin.remote.service.add(name, { endpoint, key });
  }

  async isAlreadyPinned(cid) {
    if (typeof cid === 'string') {
      cid = new CID(cid);
    }

    const opts = {
      service: config.pinningService.name,
      cid: [cid], // ls expects an array of cids
    };

    for await (const result of this.ipfs.pin.remote.ls(opts)) {
      return true;
    }

    return false;
  }

  makeGatewayURL(ipfsURI) {
    return config.ipfsGatewayUrl + '/' + stripIpfsUriPrefix(ipfsURI);
  }
}

module.exports = {
  IpfsForEthernaut,
};
