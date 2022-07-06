// config addresses (chainlink price feed) for already deployed contracts in each chain
export interface networkConfigItem {
  ethUsdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  rinkeby: {
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    blockConfirmations: 6,
  },
  polygon: {
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    blockConfirmations: 6,
  },
};

// define which chains are for local development
export const developmentChainId = 31337;

// define price feed mock initial values (for local development)
export const MOCK_DECIMALS = 8;
export const MOCK_INITIAL_ANSWER = 200000000000; // 2k + 8 decimals
