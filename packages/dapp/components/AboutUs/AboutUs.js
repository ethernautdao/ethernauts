import styles from './AboutUs.module.scss';

const AboutUs = () => (
  <div className={styles.container}>
    <div className={styles.innerContainer}>
      <h3 className={styles.title}>ABOUT US</h3>
      <p className={styles.description}>
        We are a developer's bridge from web2 to web3.
        As we see Ethereum’s body grow, we need the head to get bigger too. The issue at hand is that while there are millions of exceptionally skilled and experienced senior developers out there, senior Solidity developers remain scarce. We seek out to solve this imbalance and flip the supply deficiency by combining our forces and knowledge. With the right incentives, we can rapidly transform senior developers into senior Solidity developers.
      </p>
      <h3 className={styles.title}>HOW IT WORKS</h3>
      <p className={styles.description}>

       Mentors come to the DAO with mentorship proposals, interview prospects and pick their trainees. We act as a meeting place and provide incentives to jump-start a rapid two-month mentoring program.
      At the end of the process, new Ethereum engineers will arise who in return one day will be able to mentor new trainees. 
     </p>
      <p className={styles.description}>
      We do not charge mentees for their trainings, we actually give them the possibility to ask for funds to cover the non-paid time they put in. All of our funding comes from donations. If you see value in what we do, go ahead and <a href="#donate">mint an NFT!</a>
     </p>
     <h3 className={styles.title}>JOIN OUR QUEST</h3>
      <p className={styles.description}>
      The EthernautDAO is open for everyone willing to contribute by sharing their knowledge and know-how, or to simply broaden their horizons and learn together with the best!
      For information sharing and community discussions, <a href='https://discord.gg/RQ5WYDxUF3' target="_blank">join our Discord server!</a>
     </p>
    </div>
  </div>
);

export default AboutUs;
