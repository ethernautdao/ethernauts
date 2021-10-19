import { useContext } from 'react';

import { WalletContext } from '../../contexts/WalletProvider';
import ellipseAddress from '../../helpers/ellipse-address';
import getChainData from '../../helpers/get-chain-data';

import { Dot } from '../Dot';

import styles from './WalletInfo.module.scss';

const WalletInfo = () => {
  const { state } = useContext(WalletContext);

  const { address, chainId } = state;

  const chainData = getChainData(chainId);

  if (!state.address) return null;

  return (
    <>
      <Dot />
      <div className={styles.container}>
        <div className={styles.network}>Network: {chainData?.name}</div>
        <div className={styles.address}>Address: {ellipseAddress(address)}</div>
      </div>
    </>
  );
};

export default WalletInfo;
