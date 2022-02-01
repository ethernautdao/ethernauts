import { Contract, utils, providers } from 'ethers';
import { useContext, useState } from 'react';

import { WalletContext } from '../contexts/WalletProvider';

import { ABI, CONTRACT_ADDRESS, CONTRACT_BLOCK } from '../config';

import { zeroAccount } from '../constants/common';
import { DEFAULT_NETWORKS_PER_ENVIRONMENT } from '../constants/networks';

import getChainData from '../helpers/get-chain-data';
import isSupportedNetwork from '../helpers/is-supported-network';

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

      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const iface = new utils.Interface(ABI);

      const filter = {
        address: CONTRACT_ADDRESS,
        fromBlock: CONTRACT_BLOCK,
        toBlock: 'latest',
      };

      const logs = await provider.getLogs(filter);

      const galleryItems = await logs.reduce(async (acumm, curr) => {
        const resolvedAcumm = await acumm;

        const parsedLog = iface.parseLog(curr);

        if (parsedLog.name !== 'Transfer') return resolvedAcumm;

        const to = parsedLog.args.to.toLowerCase();
        const from = parsedLog.args.from.toLowerCase();
        const tokenId = parsedLog.args.tokenId.toNumber();

        // Push nfts based on the current address
        if (to === state.address?.toLowerCase() && isSupportedNetwork(state.chainId)) {
          resolvedAcumm.myGalleryItems.push({
            tokenId,
            owner: to,
            isRevealed: await contract.isTokenRevealed(tokenId),
          });
        }

        // Push all nfts
        if (from === zeroAccount.toLowerCase()) {
          resolvedAcumm.allGalleryItems.push({
            tokenId,
            owner: to,
            isRevealed: await contract.isTokenRevealed(tokenId),
          });
        }

        return resolvedAcumm;
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
