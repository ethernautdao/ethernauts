const CID = require('cids');

const ensureIpfsUriPrefix = (cidOrURI) => {
  let uri = cidOrURI.toString();
  if (!uri.startsWith('ipfs://')) {
    uri = 'ipfs://' + cidOrURI;
  }
  // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
  if (uri.startsWith('ipfs://ipfs/')) {
    uri = uri.replace('ipfs://ipfs/', 'ipfs://');
  }

  return uri;
};

function stripIpfsUriPrefix(cidOrURI) {
  if (cidOrURI.startsWith('ipfs://')) {
    return cidOrURI.slice('ipfs://'.length);
  }
  return cidOrURI;
}

function extractCID(cidOrURI) {
  // remove the ipfs:// prefix, split on '/' and return first path component (root CID)
  const [cidString] = stripIpfsUriPrefix(cidOrURI).split('/');

  return new CID(cidString);
}

module.exports = {
  ensureIpfsUriPrefix,
  stripIpfsUriPrefix,
  extractCID,
};
