import { Contract, providers, utils } from 'ethers';
import { useContext, useState } from 'react';

import getChainData from '../helpers/get-chain-data';
import isSupportedNetwork from '../helpers/is-supported-network';
import { ABI, CONTRACT_ADDRESS, CONTRACT_BLOCK } from '../config';
import { DEFAULT_NETWORKS_PER_ENVIRONMENT } from '../constants/networks';
import { WalletContext } from '../contexts/WalletProvider';
import { zeroAccount } from '../constants/common';

const useGallery = () => {
  const [data, setData] = useState(null);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const defaultChainId = DEFAULT_NETWORKS_PER_ENVIRONMENT[process.env.NEXT_PUBLIC_APP_ENV];

  const { rpcUrl } = getChainData(defaultChainId);

  const fetchGalleryItems = async () => {
    try {
      setData(null);
      setIsError(false);
      setIsLoading(true);

      const provider = new providers.JsonRpcProvider(rpcUrl);

      const Ethernauts = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const iface = new utils.Interface(ABI);

      const filter = {
        address: CONTRACT_ADDRESS,
        fromBlock: CONTRACT_BLOCK,
        toBlock: 'latest',
      };

      const [batchSize, totalSupply] = await Promise.all([
        Ethernauts.batchSize().then(Number),
        Ethernauts.totalSupply().then(Number),
      ]);

      const maxBatchRevealed = Math.floor(totalSupply / batchSize - 1);
      const maxTokenIdRevealed = totalSupply - (totalSupply % batchSize) - 1;

      const offsets = [];

      for (let batchId = 0; batchId <= maxBatchRevealed; batchId++) {
        const randomNumber = await Ethernauts.getRandomNumberForBatch(batchId);
        const offset = Number(randomNumber.mod(batchSize));
        offsets.push(offset);
      }

      const logs = await provider.getLogs(filter);

      const galleryItems = await logs.reduce(async (pGalleryItems, curr) => {
        const galleryItems = await pGalleryItems;

        const parsedLog = iface.parseLog(curr);

        if (parsedLog.name !== 'Transfer' || parsedLog.args.from !== zeroAccount) {
          return galleryItems;
        }

        const to = parsedLog.args.to.toLowerCase();
        const tokenId = parsedLog.args.tokenId.toNumber();
        const isRevealed = tokenId <= maxTokenIdRevealed;
        const batchNumber = Math.floor(tokenId / batchSize);
        const maxTokenIdInBatch = batchSize * (batchNumber + 1) - 1;
        const offset = offsets[batchNumber];

        let assetId = tokenId + offset;
        if (assetId > maxTokenIdInBatch) assetId -= batchSize;

        const item = {
          tokenId,
          assetId,
          owner: to,
          isRevealed,
        };

        // Push all nfts
        galleryItems.allGalleryItems.push(item);

        // Push nfts based on the current address
        if (to === state.address?.toLowerCase() && isSupportedNetwork(state.chainId)) {
          galleryItems.myGalleryItems.push(item);
        }

        return galleryItems;
      }, Promise.resolve({ myGalleryItems: [], allGalleryItems: [] }));

      setData(galleryItems);
    } catch (err) {
      console.error(err);
      setIsError(err.message);
    }
    setIsLoading(false);
  };

  return [{ data, isLoading, isError }, fetchGalleryItems];
};

export default useGallery;
