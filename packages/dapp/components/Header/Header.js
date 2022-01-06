import Link from 'next/link';
import Image from 'next/image';

import Logo from '../../public/assets/ethernaut-logo.svg';

import { WalletInfo } from '../WalletInfo';
import { ConnectWallet } from '../Buttons/ConnectWallet';

import { Navigation } from './Navigation';

import styles from './Header.module.scss';
import Logo from '../../public/assets/logo.png';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <Link href="/" passHref>
          <a>
            <Image src={Logo} />
          </a>
        </Link>
        <div className={styles.end}>
          <Navigation />
          <WalletInfo />
          <ConnectWallet />
        </div>
      </header>
    </>
  );
};

export default Header;
