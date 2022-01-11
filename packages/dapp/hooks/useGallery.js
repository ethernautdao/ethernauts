import { utils } from 'ethers';
import { useCallback, useContext, useState } from 'react';

import { WalletContext } from '../contexts/WalletProvider';

import { abi } from '../config';
import { zeroAccount } from '../constants/common';

const useGallery = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const fetchGalleryItems = useCallback(async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      if (state.web3Provider) {
        const iface = new utils.Interface(abi);

        // TODO: fromBlock should be the block where the contract is deployed.
        const filter = {
          fromBlock: 0,
          toBlock: 'latest',
        };

        const logs = await state.web3Provider.getLogs(filter);

        const galleryItems = logs.reduce(
          (acumm, curr) => {
            const parsedLog = iface.parseLog(curr);

            if (parsedLog.name !== 'Transfer') return acumm;

            // Push nfts based on the current address
            if (parsedLog.args.to.toLowerCase() === state.address.toLowerCase()) {
              acumm.myGalleryItems.push(parsedLog);
            }

            // Push all nfts
            if (parsedLog.args.from.toLowerCase() === zeroAccount.toLowerCase()) {
              acumm.allGalleryItems.push(parsedLog);
            }

            return acumm;
          },
          { myGalleryItems: [], allGalleryItems: [] }
        );

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
