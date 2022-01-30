import styles from './Footer.module.scss';

import { Twitter } from '../Icons/Twitter';
import { Discord } from '../Icons/Discord';
import { Medium } from '../Icons/Medium';

const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.social}>
      <a href="https://twitter.com/EthernautDAO" target="_blank">
        <Twitter />
      </a>
      <a href="https://discord.gg/RQ5WYDxUF3" target="_blank">
        <Discord />
      </a>
      <a href="https://ethernautdao.medium.com/" target="_blank">
        <Medium />
      </a>
    </div>
    <p>EthernautDAO 2022 ✧</p>
  </div>
);

export default Footer;
