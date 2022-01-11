import Link from 'next/link';
import Image from 'next/image';

import Logo from '../../public/assets/ethernaut-logo.svg';

import { MAIN_ROUTES } from '../../constants/routes';

import { WalletInfo } from '../WalletInfo';
import { Navigation } from '../Navigation';
import { ConnectWallet } from '../Buttons/ConnectWallet';

import styles from './Header.module.scss';

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
          <Navigation routes={MAIN_ROUTES} />
          <WalletInfo />
          <ConnectWallet />
        </div>
      </header>
    </>
  );
};

export default Header;
