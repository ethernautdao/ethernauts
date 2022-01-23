const { default: DiscordLogger } = require('node-discord-logger');
const config = require('./config');

function setupLogger(logLevels, webhookUrl) {
  if (!webhookUrl) {
    logLevels.forEach((logLevel) => {
      module.exports[logLevel] = console[logLevel].bind(console);
    });

    return;
  }

  const logger = new DiscordLogger({
    hook: webhookUrl,
    serviceName: 'Keeper',
  });

  logLevels.forEach((logLevel) => {
    module.exports[logLevel] = logger[logLevel].bind(logger);
  });
}

setupLogger(['error', 'warn'], config.KEEPER_ERRORS_WEBHOOK_URL);
setupLogger(['info', 'debug'], config.KEEPER_LOGS_WEBHOOK_URL);
