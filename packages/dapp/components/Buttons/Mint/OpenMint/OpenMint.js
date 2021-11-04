import { useContext } from 'react';

import { WalletContext } from '../../../../contexts/WalletProvider';

import useMint from '../../../../hooks/useMint';

import styles from './OpenMint.module.scss';

const Mint = () => {
  const { state, connect } = useContext(WalletContext);

  const [{ data, isLoading, isError }, fetchMint] = useMint();

  const isConnected = state.web3Provider !== null;

  if (!isConnected)
    return (
      <button type="button" className={styles.button} onClick={connect}>
        Connect Wallet
      </button>
    );

  if (isError) return 'Something went wrong...';

  if (isLoading) return 'Minting...';

  if (data) return <p className={styles.minted}>{`Your token id is: ${data}`}</p>;

  return (
    <button type="button" className={styles.button} onClick={fetchMint}>
      Mint an Ethernaut
    </button>
  );
};

export default Mint;
