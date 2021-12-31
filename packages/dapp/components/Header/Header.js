import Image from 'next/image';
import { ConnectWallet } from '../Buttons/ConnectWallet';
import { WalletInfo } from '../WalletInfo';

import styles from './Header.module.scss';
import Logo from '../../public/assets/logo.png';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <div>
          <Image src={Logo} />
        </div>
        <div className={styles.end}>
          <WalletInfo />
          <ConnectWallet />
        </div>
      </header>
    </>
  );
};

export default Header;
