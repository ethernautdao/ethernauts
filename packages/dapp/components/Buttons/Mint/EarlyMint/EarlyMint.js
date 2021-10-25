import useMintEarly from '../../../../hooks/useEarlyMint';

import styles from './EarlyMint.module.scss';

const EarlyMint = () => {
  const [{ data, isLoading, isError }, fetchMintEarly] = useMintEarly();

  if (isError) return 'Something went wrong...';

  if (isLoading) return 'Minting...';

  if (data) return <p className={styles.minted}>{`Your token id is: ${data}`}</p>;

  return (
    <button type="button" className={styles.button} onClick={fetchMintEarly}>
      Early Mint an Ethernaut
    </button>
  );
};

export default EarlyMint;
