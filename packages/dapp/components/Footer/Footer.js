import styles from './Footer.module.scss';

import { Twitter } from '../Icons/Twitter';
import { Discord } from '../Icons/Discord';
import { Medium } from '../Icons/Medium';

const Footer = () => {

  return (
    <>
      <div className={(styles.footer)}>
        <div className={(styles.social)}>
          <Twitter />
          <Discord />
          <Medium />
        </div>
        <p>EthernautDAO 2022 ✧</p>
      </div>
    </>
  );
};

export default Footer;
