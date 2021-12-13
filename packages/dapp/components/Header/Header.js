import { ConnectWallet } from '../Buttons/ConnectWallet';
import { WalletInfo } from '../WalletInfo';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.end}>
          <WalletInfo />
          <ConnectWallet />
        </div>
      </header>
      <h1 className={styles.title}>
        EthernautDAO
        <p className={styles.subtitle}>Solidifying the future</p>
      </h1>
    </>
  );
};

export default Header;
