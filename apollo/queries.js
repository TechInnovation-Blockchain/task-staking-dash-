import { gql } from "@apollo/client";

export const USER_TOKEN_DAY_DATAS = gql`
  query userTokenDayDatas($user: Bytes!) {
    userTokenDayDatas(where: { user: $user }) {
      user
      date
      balance
    }
  }
`;

export const USER_TOKEN_TRANSACTION = gql`
  query userTransactions($user: Bytes!) {
    userTransactions(
      where: { user: $user }
      orderBy: timestamp
      orderDirection: desc
    ) {
      from
      amount
      timestamp
    }
  }
`;

export const TOKEN_FACTORY = gql`
  query tokenFactory($id: ID!) {
    tokenFactory(id: $id) {
      totalHoldersCount
    }
  }
`;

export const STAKING_REWARDS_DATA = gql`
  query stakingRewardsData($id: ID!) {
    stakingRewardsData(id: $id) {
      totalStakersCount
    }
  }
`;

export const STAKING_REWARDS_DAY_DATAS = gql`
  query stakingRewardsDayDatas {
    stakingRewardsDayDatas {
      date
      totalStakingVolume
    }
  }
`;

export const SMARTDEX_FACTORY = gql`
  query uniswapFactory($id: ID!) {
    uniswapFactory(id: $id) {
      totalLiquidityUSD
      totalVolumeUSD
    }
  }
`;

// OLD
export const INDEX_POOLS = gql`
  query indexPools {
    indexPools(first: 2) {
      id
      category {
        id
      }
      size
      name
      symbol
      isPublic
      totalSupply
      totalWeight
      swapFee
      feesTotalUSD
      totalValueLockedUSD
      totalVolumeUSD
      totalSwapVolumeUSD
      tokensList
      tokens {
        id
        token {
          id
          decimals
          name
          symbol
          priceUSD
        }
        ready
        balance
        minimumBalance
        denorm
        desiredDenorm
      }
      dailySnapshots(orderBy: date, orderDirection: desc, first: 90) {
        id
        date
        value
        totalSupply
        feesTotalUSD
        totalValueLockedUSD
        totalSwapVolumeUSD
        totalVolumeUSD
      }
    }
  }
`;

export const INDEX_POOL_D = gql`
  query indexPool($id: Bytes!) {
    indexPool(id: $id) {
      id
      category {
        id
      }
      size
      name
      symbol
      isPublic
      totalSupply
      totalWeight
      swapFee
      feesTotalUSD
      totalValueLockedUSD
      totalVolumeUSD
      totalSwapVolumeUSD
      tokensList
      dailySnapshots(orderBy: date, orderDirection: desc, first: 15) {
        id
        date
        value
        totalSupply
        feesTotalUSD
        totalValueLockedUSD
        totalSwapVolumeUSD
        totalVolumeUSD
      }
      tokens {
        token {
          id
          decimals
          name
          symbol
          priceUSD
        }
        ready
        balance
        minimumBalance
        denorm
        desiredDenorm
      }
    }
  }
`;

export const LIQUID_DEMOCRACY = gql`
  query proposals {
    proposals {
      id
      state
      proposer
      description
      action
      title
      for
      against
      values
    }
  }
`;

export const PROPOSAL = gql`
  query proposal($id: ID!) {
    proposal(id: $id) {
      id
      state
      proposer
      description
      action
      title
      for
      against
      values
      votes {
        id
        voter
        option
        weight
      }
    }
  }
`;
