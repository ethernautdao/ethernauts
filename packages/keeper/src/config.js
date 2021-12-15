const { cleanEnv, str, port } = require('envalid');
require('dotenv').config();

module.exports = cleanEnv(process.env, {
  REDIS_HOST: str({ default: '127.0.0.1' }),
  REDIS_PORT: port({ default: 6379 }),
});
