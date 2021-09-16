export const debounceDelay = 500; //milliseconds
export const stakingTabs = [
  "Niox suite dashboard",
  "Smartdex",
  "Market maker/swarm",
];
export const ACTIVE_CURRENCIES = ["NIOX", "$"];

export const CARD_PERIODS = ["Block", "Day", "Month", "Year"];
export const stakingPlanInfos = [
  {
    name: "Standard",
    pricing: "Stake 0 - Stake 49,999 NIOX",
    features: [
      {
        active: false,
        value: "no",
      },
      {
        active: false,
        value: "no",
      },
      {
        active: false,
        value: "1x",
      },
      {
        active: false,
        value: "2%",
      },
      {
        active: false,
        value: "no",
      },
    ],
  },
  {
    name: "Advanced",
    pricing: "Stake 50,000 - 149,999 NIOX",
    features: [
      {
        active: true,
        value: "yes",
      },
      {
        active: true,
        value: "yes",
      },
      {
        active: false,
        value: "1.25x",
      },
      {
        active: false,
        value: "10%",
      },
      {
        active: false,
        value: "no",
      },
    ],
  },
  {
    name: "DAO",
    pricing: "Stake 150,000 - 299,999 NIOX",
    features: [
      {
        active: true,
        value: "double-yes",
      },
      {
        active: true,
        value: "double-yes",
      },
      {
        active: true,
        value: "1.5x",
      },
      {
        active: true,
        value: "30%",
      },
      {
        active: false,
        value: "no",
      },
    ],
  },
  {
    name: "DAO+",
    pricing: "Stake 300,000 NIOX and more",
    features: [
      {
        active: true,
        value: "triple-yes",
      },
      {
        active: true,
        value: "triple-yes",
      },
      {
        active: true,
        value: "2x",
      },
      {
        active: true,
        value: "50%",
      },
      {
        active: true,
        value: "yes",
      },
    ],
  },
];

export const stakingPlans = [
  { name: "Standard", unlockAmount: 0, multiplier: 0.5 },
  { name: "Advanced", unlockAmount: 50000, multiplier: 0.63 },
  { name: "DAO", unlockAmount: 150000, multiplier: 0.75 },
  {
    name: "DAO+",
    unlockAmount: 300000,
    multiplier: 1,
  },
];

export const stakingPlanFeatures = [
  {
    name: "AI services",
    model: "Maker",
    tooltip:
      "AI services include access to price prediction agents, sentiment analysis, portfolio management individually or combined as services that help improve your trading strategy and performance",
  },
  {
    name: "Premium strategies",
    model: "Maker",
    tooltip:
      "Premium strategies are in-house trading strategies and pre-sets designed to help users navigate the space with profitability regardless of the market conditions.",
  },
  {
    name: "Reward multiplier",
    model: "Staking",
    tooltip:
      "Reward multiplier reflects the increase in rewards baesd on users staking tier.",
  },
  {
    name: "Fee rebate",
    model: "Smartdex",
    tooltip:
      "Stakers and traders will recieve fee rebates based on their staking tier and trading activity",
  },
  {
    name: "Pre-sale access",
    model: "Smartdex",
    tooltip:
      "Pre-sale access to top upcoming projects will be granted to DAO plus members",
  },
];

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const DEFAULT_LOCK_PERIOD = 180000;
