const assert = require('assert');
const { ethers } = require('hardhat');

describe('Random', () => {
  let Ethernauts;

  let users;

  const baseURI = 'http://deadpine.io/';

  before('identify signers', async () => {
    users = await ethers.getSigners();
    [owner, user] = users;
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');

    const params = Object.assign({}, hre.config.defaults);
    Ethernauts = await factory.deploy(...Object.values(params));
  });

  before('set base URI', async () => {
    await (await Ethernauts.connect(owner).setBaseURI(baseURI)).wait();
  });

  before('open the sale', async () => {
    await (await Ethernauts.connect(owner).setSaleState(2)).wait();
  });

  function simulateRandomNumber() {
    return ethers.BigNumber.from(
      ethers.utils.randomBytes(32)
    ).toString();
  }

  describe('when the first tokens are minted', () => {
    let value = ethers.utils.parseEther('0.2');

    before('mint some tokens', async () => {
      await (await Ethernauts.connect(owner).mint({ value })).wait();
      await (await Ethernauts.connect(owner).mint({ value })).wait();
      await (await Ethernauts.connect(owner).mint({ value })).wait();
    });

    it('shows that the token supply increased accordingly', async () => {
      assert.equal(await Ethernauts.totalSupply(), 3);
    });

    it('shows the temp URI for all minted tokens', async () => {
      assert.equal(await Ethernauts.tokenURI(0), `${baseURI}travelling_to_destination`);
      assert.equal(await Ethernauts.tokenURI(1), `${baseURI}travelling_to_destination`);
      assert.equal(await Ethernauts.tokenURI(2), `${baseURI}travelling_to_destination`);
    });

    describe('when the random number for the current batch is set', () => {
      let rand;

      before('set random number for batch', async () => {
        rand = simulateRandomNumber();

        await (await Ethernauts.connect(owner).setRandomNumberForBatch(0, rand)).wait();
      });

      it('shows that the random number is set', async () => {
        assert.equal((await Ethernauts.getRandomNumberForBatch(0)).toString(), rand);
      });

      // it('shows the temp URI for all minted tokens', async () => {
      //   assert.equal(await Ethernauts.tokenURI(0), `${baseURI}travelling_to_destination`);
      //   assert.equal(await Ethernauts.tokenURI(1), `${baseURI}travelling_to_destination`);
      //   assert.equal(await Ethernauts.tokenURI(2), `${baseURI}travelling_to_destination`);
      // });
    });
  });
});
