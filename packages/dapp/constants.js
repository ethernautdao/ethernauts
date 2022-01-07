const zeroAccount = '0x0000000000000000000000000000000000000000';

const OPEN = 'OPEN';
const EARLY = 'EARLY';
const PAUSED = 'PAUSED';
const COMPLETED = 'COMPLETED';

const saleState = {
  0: PAUSED,
  1: EARLY,
  2: OPEN,
  3: COMPLETED,
};

const INITIAL_DONATION = 1;
const MIN_DONATION = 0.2;
const MAX_DONATION = 14;

export {
  zeroAccount,
  saleState,
  EARLY,
  PAUSED,
  OPEN,
  INITIAL_DONATION,
  MIN_DONATION,
  MAX_DONATION,
};
