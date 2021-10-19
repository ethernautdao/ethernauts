import { useContext } from 'react';

import { WalletContext } from '../../../contexts/WalletProvider';

import useMintEarly from '../../../hooks/useEarlyMint';

import styles from './EarlyMint.module.scss';

const EarlyMint = () => {
  const { state, connect } = useContext(WalletContext);

  const [{ data, isLoading, isError }, fetchMintEarly] = useMintEarly();

  const isConnected = state.web3Provider !== null;

  if (!isConnected)
    return (
      <button type="button" className={styles.button} onClick={connect}>
        Connect Wallet
      </button>
    );

  if (isError) return 'Something went wrong...';

  if (isLoading) return 'Minting...';

  if (data) return 'Your token id is:' + data;

  return (
    <button type="button" className={styles.button} onClick={fetchMintEarly}>
      Mint an Ethernaut
    </button>
  );
};

export default EarlyMint;
