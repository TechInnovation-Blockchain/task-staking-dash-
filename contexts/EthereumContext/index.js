import { ethers } from "ethers";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ContractAddress } from "../../assets/constants/addresses";
import useDebounce from "../../utils/hooks/useDebounce";
import { useUser } from "../UserContext";
import StakingRewardsABI from "../../assets/constants/abi/StakingRewards.json";
import ERC20ABI from "../../assets/constants/abi/ERC20ABI.json";

const Context = React.createContext({});

const Provider = ({ children }) => {
  const [realTimeBlockNumber, setRealTimeBlockNumber] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);

  const { chainId, library, account } = useUser();
  const [stakingContract, setStakingContract] = useState();
  const [tokenContract, setTokenContract] = useState();

  const blockNumberCallback = useCallback(
    (blockNumber) => {
      setRealTimeBlockNumber(blockNumber);
    },
    [chainId, setRealTimeBlockNumber]
  );

  useEffect(() => {
    if (!library) return;
    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) =>
        console.error(
          `Failed to get block number for chainId: ${chainId}`,
          error
        )
      );

    library.on("block", blockNumberCallback);
    return () => {
      library.removeListener("block", blockNumberCallback);
    };
  }, [chainId, library]);

  const debouncedBlockNumber = useDebounce(realTimeBlockNumber);

  useEffect(() => {
    setBlockNumber(debouncedBlockNumber);
  }, [debouncedBlockNumber]);

  useEffect(() => {
    loadContracts();
  }, [account, library]);

  const loadContracts = async () => {
    if (!library || !account) {
      setStakingContract(null);
      setTokenContract(null);
      return;
    }

    const signer = await library.getSigner(account);
    const stakingContract = new ethers.Contract(
      ContractAddress.STAKING_REWARDS,
      StakingRewardsABI,
      signer
    );

    setStakingContract(stakingContract);

    const tokenContract = new ethers.Contract(
      ContractAddress.DEV,
      ERC20ABI,
      signer
    );

    setTokenContract(tokenContract);
  };

  return (
    <Context.Provider
      value={{
        blockNumber,
        stakingContract,
        tokenContract,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Context;

export const EthereumContextProvider = Provider;

export const useEthereum = () => {
  return useContext(Context);
};
