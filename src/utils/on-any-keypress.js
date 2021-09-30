const readline = require('readline');

module.exports = async function* onAnyKeypress() {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  const rl = readline.createInterface(process.stdin);
  readline.emitKeypressEvents(process.stdin, rl);

  let listener = null;
  try {
    while (true) {
      yield await new Promise((resolve) => {
        listener = (chunk, key) => {
          listener = null;
          resolve(key);
        };

        process.stdin.once('keypress', listener);
      });
    }
  } finally {
    if (listener) {
      rl.close();
      process.stdin.removeListener('keypress', listener);
    }
  }
};
