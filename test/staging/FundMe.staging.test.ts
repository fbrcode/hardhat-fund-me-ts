// test for the testnet stage, assuming that the contracts got deployed there already
const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

// if is a local chain, skip these tests
developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe;
      let deployer;
      const send1ETH = ethers.utils.parseEther("1"); // 1 ETH
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: send1ETH });
        await fundMe.withdraw();
        const endingFundMeBallance = await fundMe.provider.getBalance(
          fundMe.address
        );
        assert.equal(endingFundMeBallance.toString(), "0");
      });
    });
