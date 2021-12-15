import { useContext } from 'react';
import cn from 'classnames';

import { WalletContext } from '../../../contexts/WalletProvider';

import styles from './ConnectWallet.module.scss';

const ConnectWallet = ({ width }) => {
  const { state, connect, disconnect } = useContext(WalletContext);

  const isConnected = state.web3Provider !== null;

  if (isConnected) {
    return (
      <button
        type="button"
        className={cn(styles.button, { [styles[`w-${width}`]]: !!width })}
        onClick={disconnect}
      >
        Disconnect wallet
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(styles.button, { [styles[`w-${width}`]]: !!width })}
      onClick={connect}
    >
      Connect wallet
    </button>
  );
};

export default ConnectWallet;
