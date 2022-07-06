import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChainId } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deployFundMe: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // get the contract address based on the chosen chain
  let ethUsdPriceFeed;
  if (chainId == developmentChainId) {
    const ethUsdAggregator = await get("MockV3Aggregator"); // get the mock contract already deployed
    ethUsdPriceFeed = ethUsdAggregator.address;
  } else {
    // if not in local development, use the real contract address
    ethUsdPriceFeed = networkConfig[network.name].ethUsdPriceFeed;
  }

  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");
  const args = [ethUsdPriceFeed];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args, // price feed address
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`FundMe deployed at ${fundMe.address}`);
  log("----------------------------------------------------");

  // if not in local and has etherscan api key, verify the deployment
  if (chainId !== developmentChainId && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, args);
  }
};

export default deployFundMe;
deployFundMe.tags = ["all", "fundMe"];
