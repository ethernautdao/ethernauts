const { createReadStream, constants } = require('fs');
const { access } = require('fs/promises');
const fleekStorage = require('@fleekhq/fleek-storage-js');
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
