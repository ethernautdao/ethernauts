const path = require('path');
const { cleanEnv, str, port, num } = require('envalid');

require('dotenv').config();

module.exports = cleanEnv(process.env, {
  REDIS_HOST: str({ default: '127.0.0.1' }),
  REDIS_PORT: port({ default: 6379 }),
  MINTS_QUEUE_NAME: str({ default: 'mints' }),
  MINTS_QUEUE_CONCURRENCY: num({ default: 5 }),
  RESOURCES_METADATA_FOLDER: str({
    devDefault: path.join(__dirname, '..', '..', 'hardhat', 'resources', 'metadata'),
  }),
  RESOURCES_ASSETS_FOLDER: str({
    devDefault: path.join(__dirname, '..', '..', 'hardhat', 'resources', 'assets'),
  }),
  FLEEK_STORAGE_API_KEY: str({ devDefault: '' }),
  FLEEK_STORAGE_API_SECRET: str({ devDefault: '' }),
  FLEEK_METADATA_FOLDER: str({ default: 'metadata' }),
  FLEEK_ASSETS_FOLDER: str({ default: 'assets' }),
});
