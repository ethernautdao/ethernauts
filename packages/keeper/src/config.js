const path = require('path');
const { cleanEnv, str, port, num } = require('envalid');

require('dotenv').config();

module.exports = cleanEnv(process.env, {
  REDIS_HOST: str({ default: '127.0.0.1' }),
  REDIS_PORT: port({ default: 6379 }),
  RESOURCES_FOLDER: str({ devDefault: path.join(__dirname, '..', 'hardhat', 'resources') }),
  MINTS_QUEUE_NAME: str({ default: 'mints' }),
  MINTS_QUEUE_CONCURRENCY: num({ default: 5 }),
});
