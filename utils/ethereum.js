import axios from "axios";
import web3 from "web3";
import { ethers } from "ethers";
import { ContractAddress } from "../assets/constants/addresses";
import { Currencies } from "./currencies";
import BigNumber from "bignumber.js";
import StakingRewardsABI from "../assets/constants/abi/StakingRewards.json";
import { fromFraction, toFraction } from "./balance";
import ERC20ABI from "../assets/constants/abi/ERC20ABI.json";
import {
  client_smartdex,
  client_staking,
  client_token,
} from "../apollo/client";
import {
  SMARTDEX_FACTORY,
  STAKING_REWARDS_DATA,
  STAKING_REWARDS_DAY_DATAS,
  TOKEN_FACTORY,
} from "../apollo/queries";

const DEFAULT_PROVIDER = ethers.getDefaultProvider("kovan");

export const getGasPrice = async () => {
  //   const url = "https://gasprice.poa.network/";
  //   var priceString = await axios.get(url);
  //   const priceJSON = priceString.data;
  //   console.log("PRICE FAST:", priceJSON.fast);
  //   const factorOfSafety = 1.3;
  //   const fastGasPrice = (priceJSON.fast * factorOfSafety).toFixed().toString();
  const fastGasPrice = "20";
  return web3.utils.toWei(fastGasPrice, "gwei");
};

/**
 *
 * @param {String} account Ethereum address of the user
 * @param {Number} library Ethereum Chain ID
 * @returns
 */
export const fetchLockedBalance = async (account, library) => {
  if (!account || !library) return;

  const signer = await library.getSigner(account);

  const stakingContract = new ethers.Contract(
    ContractAddress.STAKING_REWARDS,
    StakingRewardsABI,
    signer
  );
  const balance = await stakingContract.actualBalanceOf(account);
  return toFraction(balance.toString());
};

/**
 *
 * @param {String} account Ethereum address of the user
 * @param {Number} library Ethereum Chain ID
 * @returns
 */
export const fetchAvailableBalance = async (account, library) => {
  if (!account || !library) return;

  const signer = await library.getSigner(account);

  const tokenContract = new ethers.Contract(
    ContractAddress.DEV,
    ERC20ABI,
    signer
  );
  const balance = await tokenContract.balanceOf(account);
  return toFraction(balance.toString());
};

/**
 *
 * @param {String} account Ethereum address of the user
 * @param {Number} signer Ethereum Chain ID
 * @returns
 */
export const fetchStakingRewardsBalance = async (account, library) => {
  if (!account || !library) return;

  const signer = await library.getSigner(account);

  const tokenContract = new ethers.Contract(
    ContractAddress.STAKING_REWARDS,
    StakingRewardsABI,
    signer
  );
  const balance = await tokenContract.earned(account);
  return toFraction(balance.toString());
};

/**
 *
 * @param {Number} library
 * @returns
 */
export const fetchTotalLockedBalance = async () => {
  const tokenContract = new ethers.Contract(
    ContractAddress.STAKING_REWARDS,
    StakingRewardsABI,
    DEFAULT_PROVIDER
  );

  const balance = await tokenContract.actualTotalSupply();
  return toFraction(balance.toString());
};

/**

* @param {Number} library
 * @returns
 */
export const fetchRewardRate = async (account) => {
  const tokenContract = new ethers.Contract(
    ContractAddress.STAKING_REWARDS,
    StakingRewardsABI,
    DEFAULT_PROVIDER
  );

  const totalRewardRate = await tokenContract.rewardRate();
  const totalStakedBalance = await tokenContract.actualTotalSupply();
  const earned = await tokenContract.earned(account);
  return BigNumber(totalRewardRate.toString())
  .multipliedBy(BigNumber(earned.toString()))
  .dividedBy(BigNumber(totalStakedBalance.toString())).toString();
};

export const fetchTotalTokenHoldersCount = async () => {
  let res = await client_token.query({
    query: TOKEN_FACTORY,
    variables: {
      id: ContractAddress.DEV,
    },
  });

  return res.data.tokenFactory.totalHoldersCount;
};

export const fetchTotalStakersCount = async () => {
  let res = await client_staking.query({
    query: STAKING_REWARDS_DATA,
    variables: {
      id: ContractAddress.STAKING_REWARDS,
    },
  });

  return res.data.stakingRewardsData.totalStakersCount;
};

export const getAPY = async () => {
  const tokenContract = new ethers.Contract(
    ContractAddress.STAKING_REWARDS,
    StakingRewardsABI,
    DEFAULT_PROVIDER
  );

  const totalStakedBalance = await tokenContract.actualTotalSupply();
  const dailyRewardRate = await tokenContract.rewardRate();
  return BigNumber(dailyRewardRate.toString())
    .multipliedBy(3600 * 24 * 365)
    .dividedBy(totalStakedBalance.toString());
};

export const getApproximateStakingRewards = (balance, apy) => {
  return BigNumber(balance).multipliedBy(apy).dividedBy(100);
};

export const fetchRewardsDayDatas = async () => {
  let res = await client_staking.query({
    query: STAKING_REWARDS_DAY_DATAS,
  });

  return res.data.stakingRewardsDayDatas;
};

export const getCurrentTier = async (lockedBalance, account, signer) => {
  if (!lockedBalance) lockedBalance = await fetchLockedBalance(account, signer);

  if (lockedBalance < 50000) return 0;
  if (lockedBalance < 150000) return 1;
  if (lockedBalance < 300000) return 2;
  return 3;
};

export const fetchUserLockPeriod = async (account, library) => {
  if (!account || !library) return 0;

  const signer = await library.getSigner(account);

  const tokenContract = new ethers.Contract(
    ContractAddress.STAKING_REWARDS,
    StakingRewardsABI,
    signer
  );

  const lockPeriod = await tokenContract.userLockPeriod();

  return lockPeriod;
};

export const fetchUserRewardLockPeriod = async (account, library) => {
  if (!account || !library) return 0;

  const signer = await library.getSigner(account);

  const tokenContract = new ethers.Contract(
    ContractAddress.STAKING_REWARDS,
    StakingRewardsABI,
    signer
  );

  const lockPeriod = await tokenContract.userRewardLockPeriod();

  return lockPeriod;
};

export const fetchSmartdexFactory = async () => {
  let res = await client_smartdex.query({
    query: SMARTDEX_FACTORY,
    variables: {
      id: ContractAddress.SMARTDEX,
    },
  });

  return res.data.uniswapFactory;
};

export const fetchSwarmData = async () => {
  let campaign = await axios.get(
    "https://mmcors.autonio.foundation/https://api.autonio.io/campaign/"
  );

  let rewards = await axios.get(
    "https://mmcors.autonio.foundation/https://api.autonio.io/campaign/rewards"
  );

  return {
    campaignsCount: campaign.data.length,
    rewardsDistributed: rewards.data.reward,
    rewardsVolume: rewards.data.volume,
  };
};
/**
 *
 * @param {String | Number} amount Amount to be adjusted for the slippage
 * @param {Number} slippage Slippage value in percentage
 * @returns {String}
 */
export const addSlippage = (
  amount,
  slippage = Currencies.SDAO.slippagePercent
) => {
  const mulFactor = 1 + slippage / 100;
  return BigNumber(amount).multipliedBy(mulFactor).decimalPlaces(8).toString();
};

/**
 *
 * @param {BigNumber | String | Number} amount Amount to be adjusted for the slippage
 * @param {Number} slippage Slippage value in percentage
 * @returns {String}
 */
export const reduceSlippage = (
  amount,
  slippage = Currencies.SDAO.slippagePercent
) => {
  const mulFactor = 1 - slippage / 100;
  return BigNumber(amount).multipliedBy(mulFactor).decimalPlaces(8).toString();
};

// (Number(amount) * (1 - slippage / 100)).toFixed(8);

export const defaultGasLimit = 210000;
export const defaultApprovalAmount = ethers.BigNumber.from(10)
  .pow(28)
  .toString(); // Inspired from UNISWAP default Approval
export const unitBlockTime = 13500; // milliseconds

export const getTokenPrice = async () => {
  const result = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=autonio"
  );

  return result.data[0].current_price;
};
