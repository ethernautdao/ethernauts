import { useEffect, useContext } from 'react';
import { utils } from 'ethers';

import { WalletContext } from '../../../contexts/WalletProvider';
import { DonationContext } from '../../../contexts/DonationProvider';

import useSaleState from '../../../hooks/useSaleState';

import isSupportedNetwork from '../../../helpers/is-supported-network';

import { EARLY, OPEN, PAUSED, COMPLETED } from '../../../constants/sale-state';

import { Error } from '../Error';
import { Primary } from '../Primary';
import { Disabled } from '../Disabled';
import { ConnectWallet } from '../ConnectWallet';

import { EarlyMint } from './EarlyMint';
import { OpenMint } from './OpenMint';

const mintButtons = {
  [OPEN]: <OpenMint />,
  [EARLY]: <EarlyMint />,
  [PAUSED]: <Disabled text="Sale paused" fullWidth />,
  [COMPLETED]: <Disabled text="Sale completed" fullWidth />,
};

const Mint = () => {
  const { state } = useContext(WalletContext);
  const { donation } = useContext(DonationContext);
  const [{ data, isLoading, isError }, fetchSaleState] = useSaleState();

  useEffect(() => {
    if (state.web3Provider) {
      fetchSaleState();
    }
  }, [state.web3Provider, fetchSaleState]);

  const isConnected = state.web3Provider !== null;

  const hasInsufficientBalance =
    state.balance !== null ? donation > Number(utils.formatEther(state.balance.toString())) : false;

  if (isLoading) return <Primary isDisabled fullWidth text="Loading..." />;

  if (isError) return <Error isDisabled fullWidth text="Something went wrong" />;

  if (!isConnected) return <ConnectWallet fullWidth />;

  if (!isSupportedNetwork(state.chainId)) return <Disabled fullWidth text="Unsupported Network" />;

  if (hasInsufficientBalance) return <Disabled fullWidth text="Insufficient balance" />;

  if (!mintButtons[data]) return null;

  return mintButtons[data];
};

export default Mint;
