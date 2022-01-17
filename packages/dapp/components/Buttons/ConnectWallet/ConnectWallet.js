import { useContext } from 'react';
import cn from 'classnames';

import { WalletContext } from '../../../contexts/WalletProvider';

import styles from './ConnectWallet.module.scss';

const ConnectWallet = ({ fullWidth }) => {
  const { state, connect, disconnect } = useContext(WalletContext);

  const isConnected = state.web3Provider !== null;

  if (isConnected) {
    return (
      <button
        type="button"
        className={cn(styles.button, {
          [styles.fullWidth]: fullWidth,
          [styles.headerButton]: !fullWidth,
        })}
        onClick={disconnect}
      >
        <span className={styles.text}>Disconnect wallet</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(styles.button, {
        [styles.fullWidth]: fullWidth,
        [styles.headerButton]: !fullWidth,
      })}
      onClick={connect}
    >
      <span className={styles.text}>Connect wallet</span>
    </button>
  );
};

export default ConnectWallet;
