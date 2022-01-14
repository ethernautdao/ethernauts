const path = require('path');
const { cleanEnv, str, port, num } = require('envalid');

require('dotenv').config();

module.exports = cleanEnv(process.env, {
  REDIS_HOST: str({ default: '127.0.0.1' }),
  REDIS_PORT: port({ default: 6379 }),
  MINTS_QUEUE_NAME: str({ default: 'mints' }),
  MINTS_QUEUE_CONCURRENCY: num({ default: 5 }),
  RESOURCES_METADATA_FOLDER: str({
    default: path.join(__dirname, '..', '..', 'hardhat', 'resources', 'metadata'),
  }),
  RESOURCES_ASSETS_FOLDER: str({
    default: path.join(__dirname, '..', '..', 'hardhat', 'resources', 'assets'),
  }),
  FLEEK_API_KEY: str({ default: '' }),
  FLEEK_STORAGE_API_KEY: str({ default: '' }),
  FLEEK_STORAGE_API_SECRET: str({ default: '' }),
  FLEEK_METADATA_FOLDER: str({ default: 'metadata' }),
  FLEEK_ASSETS_FOLDER: str({ default: 'assets' }),
});
