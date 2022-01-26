import { useContext } from 'react';

import { WalletContext } from '../../contexts/WalletProvider';
import ellipseAddress from '../../helpers/ellipse-address';
import getChainData from '../../helpers/get-chain-data';

import { Dot } from './Dot';

import styles from './WalletInfo.module.scss';

const WalletInfo = () => {
  const { state } = useContext(WalletContext);

  const { address, chainId } = state;

  let chainData = null;
  try {
    chainData = getChainData(chainId);
  } catch (err) {
    chainData = { name: err.message };
  }

  if (!state.address) return null;

  return (
    <div className={styles.container}>
      <div className={styles.walletInfo}>
        <div className={styles.balance}>12.345 ETH</div>
        <div className={styles.address}>
          <Dot />
          <div>{ellipseAddress(address)}</div>
        </div>
      </div>
      {/* Show this only when clicking / hovering the 'walletInfo' component */}
      <a className={styles.disconnect}>
        <img src={'/assets/ic-disconnect.svg'} />
        <span>Disconnect</span>
      </a>
    </div>
  );
};

export default WalletInfo;
