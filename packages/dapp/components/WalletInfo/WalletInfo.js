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
    <>
      <div className={styles.walletInfo}>
        <div className={styles.balance}>12.345 ETH</div>
        <div className={styles.container}>
          <Dot />
          <div className={styles.address}>{ellipseAddress(address)}</div>
        </div>
      </div>
    </>
  );
};

export default WalletInfo;
