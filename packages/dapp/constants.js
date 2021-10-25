const zeroAccount = '0x0000000000000000000000000000000000000000';

const OPEN = 'OPEN';
const EARLY = 'EARLY';
const PAUSED = 'PAUSED';

const saleState = {
  0: PAUSED,
  1: EARLY,
  2: OPEN,
};

export { zeroAccount, saleState, EARLY, PAUSED, OPEN };
