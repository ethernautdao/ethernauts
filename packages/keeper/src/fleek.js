const { createReadStream, constants } = require('fs');
const { access } = require('fs/promises');
const fleekStorage = require('@fleekhq/fleek-storage-js');
const memoize = require('lodash.memoize');
const needle = require('needle');
const config = require('./config');

exports.fileExists = async function getFileData({ key }) {
  const data = await fleekStorage.get({
    apiKey: config.FLEEK_STORAGE_API_KEY,
    apiSecret: config.FLEEK_STORAGE_API_SECRET,
    getOptions: ['hash'],
    key,
  });

  return !!data?.hash;
};

exports.uploadFile = async function uploadFile({ key, location }) {
  await access(location, constants.R_OK);

  return await fleekStorage.streamUpload({
    apiKey: config.FLEEK_STORAGE_API_KEY,
    apiSecret: config.FLEEK_STORAGE_API_SECRET,
    key,
    stream: createReadStream(location),
  });
};

exports.getDefaultBucket = async function getDefaultBucket() {
  const res = await fleekStorage.listBuckets({
    apiKey: config.FLEEK_STORAGE_API_KEY,
    apiSecret: config.FLEEK_STORAGE_API_SECRET,
  });

  if (!Array.isArray(res)) {
    throw new Error(`Invalid response from .listBuckets: ${JSON.stringify(res)}`);
  }

  if (res.length !== 1) {
    throw new Error(`Invalid amount of buckets found: ${JSON.stringify(res)}`);
  }

  return res[0].name;
};

const _memoizedGetDefaultBucket = memoize(exports.getDefaultBucket);

exports.getFolderHash = async function getFolderHash({ key }) {
  const bucket = await _memoizedGetDefaultBucket();
  const folder = key.endsWith('/') ? key : `${key}/`;

  const res = await needle(
    'get',
    'https://api.fleek.co/graphql',
    {
      query: `query { getStorageObject(bucket: "${bucket}", key: "${folder}") { hash } }`,
    },
    {
      headers: { Authorization: config.FLEEK_API_KEY },
    }
  );

  return res.body?.data?.getStorageObject?.hash || null;
};
