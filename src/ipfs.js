const path = require('path');
const CID = require('cids');
const fs = require('fs/promises');
const ipfsClient = require('ipfs-http-client');

const { ensureIpfsUriPrefix, stripIpfsUriPrefix, extractCID } = require('./utils/ipfs-uri');

// ipfs.add parameters for more deterministic CIDs
const ipfsAddOptions = {
  cidVersion: 1,
  hashAlg: 'sha2-256',
  wrapWithDirectory: true, // useful to create folders
};

class IPFS {
  constructor({ ipfsApiUrl, ipfsGatewayUrl, pinningService }) {
    this.ipfsApiUrl = ipfsApiUrl;
    this.ipfsGatewayUrl = ipfsGatewayUrl;
    this.pinningService = pinningService;

    // create ipfs client
    this.ipfs = ipfsClient.create(ipfsApiUrl);
  }

  /**
   * Upload to local ipfs node from buffer
   * @param {Buffer} content File buffer
   * @param {object} options The fields required for metadata
   * @returns {object} The data by ipfs and the pinning service
   */

  async uploadToLocalIpfsNode(content, options) {
    const filePath = options.path;

    if (!filePath) {
      throw new Error('unable to get the path');
    }

    const basename = path.basename(filePath);
    const filename = path.parse(filePath).name;

    const ipfsPath = '/assets/' + basename; // e.g. ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/assets/0.png
    const matadataPath = '/metadata/' + filename + '.json'; // e.g. ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/metadata/0.json

    const { cid: assetCid } = await this.ipfs.add({ path: ipfsPath, content }, ipfsAddOptions);

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

  /**
   * Upload to local ipfs node from a file path
   * @param {string} filename The path of the file
   * @param {object} options The fields required for metadata
   * @returns {object} The data by ipfs and the pinning service.
   */

  async uploadToLocalIpfsNodeFromAssetFile(filename, options) {
    const content = await fs.readFile(filename);

    return this.uploadToLocalIpfsNode(content, {
      ...options,
      path: filename,
    });
  }

  /**
   * Create metadata using JSON format
   * @param {string} assetURI The URI of ipfs
   * @param {object} options The fields required for metadata
   * @returns {object} Retuns a JSON of metadata.
   */

  async makeNFTMetadata(assetURI, options) {
    const { name, description } = options;

    const image = ensureIpfsUriPrefix(assetURI);

    return {
      name,
      description,
      image,
    };
  }

  /**
   * Ask the remote service to pin the content
   * Behind the scenes, this will cause the pinning service to connect to our local IPFS node
   * @param {string} cidOrURI The CID or the URI of ipfs
   */

  async pin(cidOrURI) {
    const cid = extractCID(cidOrURI);

    // Configure pinning service
    await this._configurePinningService();

    const pinned = await this.isAlreadyPinned(cid);

    if (pinned) {
      return;
    }

    await this.ipfs.pin.remote.add(cid, { service: this.pinningService.name });
  }

  /**
   * Configure pinning services to store our local ipfs data
   */
  async _configurePinningService() {
    // check if the service has already been added to js-ipfs
    for (const svc of await this.ipfs.pin.remote.service.ls()) {
      if (svc.service === this.pinningService.name) {
        // service is already configured, no need to do anything
        return;
      }
    }

    // Check if we've already pinned this CID to avoid a "duplicate pin" error.
    const { name, endpoint, key } = this.pinningService;

    await this.ipfs.pin.remote.service.add(name, { endpoint, key });
  }

  /**
   * Ask for pinned CID to avoid a "duplicate pin" error
   * @param {string} cid
   * @returns {boolean} Returns if the CID exists
   */

  async isAlreadyPinned(cid) {
    if (typeof cid === 'string') {
      cid = new CID(cid);
    }

    const opts = {
      service: this.pinningService.name,
      cid: [cid], // ls expects an array of cids
    };

    for await (const result of this.ipfs.pin.remote.ls(opts)) {
      return true;
    }

    return false;
  }

  /**
   * Build the gateway url for easy and quick access
   * @param {string} ipfsURI The ipfs URI.
   * @returns {string} The asset URL through the gateway
   */

  makeGatewayURL(ipfsURI) {
    return this.ipfsGatewayUrl + '/' + stripIpfsUriPrefix(ipfsURI);
  }
}

module.exports = IPFS;
