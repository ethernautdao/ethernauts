import { useContext, useEffect, useState } from 'react';
import { utils, providers, Contract } from 'ethers';

import { CONTRACT_ADDRESS, ABI } from '../../config';
import { DEFAULT_NETWORKS_PER_ENVIRONMENT } from '../../constants/networks';
import { zeroAccount } from '../../constants/common';

import { WalletContext } from '../../contexts/WalletProvider';
import ellipseAddress from '../../helpers/ellipse-address';
import getChainData from '../../helpers/get-chain-data';

import { Dot } from './Dot';

import styles from './WalletInfo.module.scss';

const WalletInfo = () => {
  const { state, disconnect, setBalance } = useContext(WalletContext);
  const [isHover, setIsHover] = useState(false);

  const defaultChainId = DEFAULT_NETWORKS_PER_ENVIRONMENT[process.env.NEXT_PUBLIC_APP_ENV];

  const { rpcUrl } = getChainData(defaultChainId);

  useEffect(() => {
    const provider = new providers.JsonRpcProvider(rpcUrl);

    const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

    contract.on('Transfer', async (from, to) => {
      if (from !== zeroAccount && to !== state.address) return;

      await setBalance();
    });
  }, []);

  const { address, chainId } = state;

  let chainData = null;
  try {
    chainData = getChainData(chainId);
  } catch (err) {
    chainData = { name: err.message };
  }

  if (!state.address) return null;

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={styles.walletInfo}>
        <div className={styles.balance}>
          {`${Number(utils.formatEther(state.balance.toString())).toFixed(2)}`} ETH
        </div>
        <div className={styles.address}>
          <Dot />
          <div>{ellipseAddress(address)}</div>
        </div>
      </div>
      {isHover && (
        <a className={styles.disconnect} onClick={disconnect}>
          <img src={'/assets/ic-disconnect.svg'} />
          <span>Disconnect wallet</span>
        </a>
      )}
    </div>
  );
};

export default WalletInfo;
