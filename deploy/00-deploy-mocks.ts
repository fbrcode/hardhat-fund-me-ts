import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  developmentChainId,
  MOCK_DECIMALS,
  MOCK_INITIAL_ANSWER,
} from "../helper-hardhat-config";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // only deploy mocks for local networks
  if (chainId === developmentChainId) {
    log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [MOCK_DECIMALS, MOCK_INITIAL_ANSWER],
    });
    log("Mocks deployed!");
    log("----------------------------------");
  }
};

export default deployMocks;

deployMocks.tags = ["all", "mocks"];
