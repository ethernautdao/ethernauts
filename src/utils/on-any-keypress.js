const readline = require('readline');

module.exports = async function* onAnyKeypress() {
  const interface = readline.createInterface(process.stdin);
  readline.emitKeypressEvents(process.stdin, interface);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

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
      process.stdin.removeListener('keypress', listener);
    }
  }
};
