const fs = require('fs');
const path = require('path');
const process = require('process');
const { inspect } = require('util');

const errorFilePath = path.join(process.cwd(), 'crash.log');

process.on('unhandledRejection', function (err) {
  throw err;
});

process.on('uncaughtExceptionMonitor', function (err) {
  fs.writeFileSync(errorFilePath, inspect(err));
});
