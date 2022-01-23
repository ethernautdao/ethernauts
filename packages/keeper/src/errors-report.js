const fs = require('fs');
const path = require('path');
const notify = require('./notify');

const errorFilePath = path.join(process.cwd(), 'crash.log');

async function main() {
  if (!fs.existsSync(errorFilePath)) return;

  const description = fs.readFileSync(errorFilePath).toString();

  fs.renameSync(errorFilePath, path.join(process.cwd(), `crash-${process.hrtime.bigint()}.log`));

  await notify.error({
    message: 'Application Crashed',
    description: `\`\`\`\n${description}\n\`\`\``,
  });
}

main().catch((err) => console.error(err));
