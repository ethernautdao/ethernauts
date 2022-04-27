import styles from './FairLaunch.module.scss';

const FairLaunch = () => (
  <div className={styles.container}>
    <div className={styles.innerContainer}>
      <h3 className={styles.title}>NO GAS WARS</h3>
      <p className={styles.description}>
        Ethernauts NFT avoids the typical NFT mint gas wars by launching on Optimism, although
        that's not the only reason why we choose Optimism! Transactions in the Optimism network are
        processed sequentially, so there's no point in using a higher gas price. <a href='https://optimistic.etherscan.io/address/0xA433e0Bf662Dd934833C66D4f03711e1CCE9c9B2#code'>READ OUR SMART CONTRACT</a>
      </p>

      <h3 className={styles.title}>FAIR SALE</h3>
      <p className={styles.description}>
        We want to give community members that contributed to the EthernautDAO so far to have a
        chance to get their NFT, and even pay less for it. Thus, there will be an early sale in
        which only community members that have been issued a signed coupon will be able to purchase
        an NFT. The Ethernauts dApp will automatically provide such coupon for community members,
        targeting an address that previously claimed a POAP.
      </p>

      <h3 className={styles.title}>RANDOMNESS</h3>
      <p className={styles.description}>
        Even though Ethernauts randomness is not 100% trustless, since that would be a bit expensive
        for users and the project right now, we put a lot of effort in trying to make it as
        trustless as possible. Actually, our project is considerably more trustless than 99% of any
        previous NFT launches!. Tokens are minted in batches of 50. When a batch completes, the
        previous 50 tokens are revealed using a pseudo-random number that makes it extremely hard
        for people with knowledge of token rarity to know when to mint their own with any sort of
        advantage to any other user. In fact, we will never see these assets before launch, and
        secure keepers will post batch assets as they complete. This makes this launch practically
        trustless.
      </p>
    </div>
  </div>
);

export default FairLaunch;
