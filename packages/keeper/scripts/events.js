require('../src/errors-catch');

const { QueueEvents } = require('bullmq');
const config = require('../src/config');
const notify = require('../src/notify');
const { JOB_PROCESS_BATCH } = require('../src/constants');

async function main() {
  const events = new QueueEvents(config.MINTS_QUEUE_NAME, {
    autorun: true,
    concurrency: config.MINTS_QUEUE_CONCURRENCY,
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    },
  });

  events
    .on('added', ({ name, data }) => {
      if (name === JOB_PROCESS_BATCH) {
        const meta = typeof data === 'string' ? JSON.parse(data) : data;
        notify.info({
          message: 'Batch added for precessing',
          meta,
        });
      }
    })
    .on('completed', (args) => {
      notify.info({
        message: 'Job completed',
        json: args,
      });
    })
    .on('failed', (args) => {
      notify.error({
        message: 'Job Run Error',
        json: args,
      });
    });

  console.log(' - Events Listener Started - ');
}

main();
