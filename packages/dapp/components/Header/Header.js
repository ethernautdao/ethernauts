import Link from 'next/link';
import useBreakpoint from 'use-breakpoint';

import { BREAKPOINTS } from '../../constants/common';
import { MAIN_ROUTES } from '../../constants/routes';

import { WalletInfo } from '../WalletInfo';
import { Navigation } from '../Navigation';
import { ConnectWallet } from '../Buttons/ConnectWallet';

import styles from './Header.module.scss';

const Header = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');

  const isMobile = breakpoint === 'mobile';

  return (
    <>
      <header className={styles.header}>
        <Link href="/" passHref>
          <a>
            <img src={'/assets/ethernaut-logo.svg'} />
          </a>
        </Link>
        <div className={styles.end}>
          <Navigation routes={MAIN_ROUTES} />
          {!isMobile && (
            <>
              <WalletInfo />
              <ConnectWallet />
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
