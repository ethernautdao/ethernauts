import { Contract, utils } from 'ethers';
import { useCallback, useContext, useState } from 'react';

import { WalletContext } from '../contexts/WalletProvider';

import { ABI, TOKEN_ADDRESS } from '../config';

import { zeroAccount } from '../constants/common';

const useGallery = () => {
  const [data, setData] = useState(null);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const fetchGalleryItems = useCallback(async () => {
    try {
      setData(null);
      setIsError(false);
      setIsLoading(true);

      if (state.web3Provider) {
        const signer = state.web3Provider.getSigner();

        const contract = new Contract(TOKEN_ADDRESS, ABI, signer);

        const iface = new utils.Interface(ABI);

        // TODO: fromBlock should be the block where the contract is deployed.
        const filter = {
          fromBlock: 0,
          toBlock: 'latest',
        };

        const logs = await state.web3Provider.getLogs(filter);

        const galleryItems = await logs.reduce(async (acumm, curr) => {
          const resolvedAcumm = await acumm;

          const parsedLog = iface.parseLog(curr);

          if (parsedLog.name !== 'Transfer') return resolvedAcumm;

          const to = parsedLog.args.to.toLowerCase();
          const from = parsedLog.args.from.toLowerCase();
          const tokenId = parsedLog.args.tokenId.toNumber();

          // Push nfts based on the current address
          if (to === state.address.toLowerCase()) {
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
      }
    } catch (err) {
      console.error(err);
      setIsError(err.message);
    }
    setIsLoading(false);
  }, [state.address]);

  return [{ data, isLoading, isError }, fetchGalleryItems];
};

export default useGallery;
