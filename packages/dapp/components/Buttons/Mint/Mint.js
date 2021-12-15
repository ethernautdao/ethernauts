import { useEffect, useContext } from 'react';

import { WalletContext } from '../../../contexts/WalletProvider';
import { EARLY, OPEN, PAUSED } from '../../../constants';
import useSaleState from '../../../hooks/useSaleState';

import { ConnectWallet } from '../ConnectWallet';
import { EarlyMint } from './EarlyMint';
import { OpenMint } from './OpenMint';

const mintButtons = {
  [EARLY]: <EarlyMint />,
  [OPEN]: <OpenMint />,
  [PAUSED]: <p>Sale paused</p>,
};

const Mint = () => {
  const { state } = useContext(WalletContext);
  const [{ data, isLoading, isError }, fetchSaleState] = useSaleState();

  useEffect(() => {
    if (state.web3Provider) fetchSaleState();
  }, [state.web3Provider, fetchSaleState]);

  if (isLoading) return 'Loading...';

  if (isError) return 'Something went wrong...';

  if (!mintButtons[data]) return <ConnectWallet width={100} />;

  return mintButtons[data];
};

export default Mint;
