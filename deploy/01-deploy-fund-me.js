// mode #1 - deploy the contract with function naming
// function deployFundMe() {
//   console.log("Deploying fund me");
// }
// module.exports.default = deployFundMe;

const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// mode #1 - deploy the contract with anonymous function
// module.exports = async (hre) => { const { getNamedAccounts, deployments } = hre; };
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // what happens when we want to change chains?
  // when going for a localhost or hardhat network, we want to use a mock

  // get the contract address based on the chosen chain
  // const ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;
  let ethUsdPriceFeed;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator"); // get the mock contract already deployed
    ethUsdPriceFeed = ethUsdAggregator.address;
  } else {
    // if not in local development, use the real contract address
    ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;
  }

  // deploy FundMe contract
  const args = [ethUsdPriceFeed];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // price feed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // if not in local and has etherscan api key, verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }

  log("----------------------------------");
};

module.exports.tags = ["all", "fundme"];
