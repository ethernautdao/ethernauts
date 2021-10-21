import { useContext } from 'react';

import { WalletContext } from '../../../contexts/WalletProvider';

import styles from './ConnectWallet.module.scss';

const ConnectWallet = () => {
  const { state, connect, disconnect } = useContext(WalletContext);

  const isConnected = state.web3Provider !== null;

  if (isConnected) {
    return (
      <button type="button" className={styles.button} onClick={disconnect}>
        Disconnect Wallet
      </button>
    );
  }

  return (
    <button type="button" className={styles.button} onClick={connect}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
