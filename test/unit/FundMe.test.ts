const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

// if is a NOT a local chain, skip these tests
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe;
      let deployer;
      let mockV3aggregator;
      const send1ETH = ethers.utils.parseEther("1"); // 1 ETH
      beforeEach(async function () {
        // deploy our FundMe contract using hardhat-deploy
        deployer = (await getNamedAccounts()).deployer;
        // another way to get the deployer and other accounts in the next two lines below
        // const accounts = await ethers.getSigners();
        // const accountZero = accounts[0];
        await deployments.fixture(["all"]); // run through all deployment scripts on deployment folder
        fundMe = await ethers.getContract("FundMe", deployer); // get the most recent deployed "FundMe" contract with the account we want to be connected to it (deployer)
        mockV3aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", async function () {
        it("sets the aggregator address correctly", async function () {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3aggregator.address);
        });
      });

      describe("fund", async function () {
        it("fails if you don't send enough ETH", async function () {
          // await fundMe.fund();
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });

        it("update the amount funded data structure", async function () {
          await fundMe.fund({ value: send1ETH });
          const response = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(response.toString(), send1ETH.toString());
        });

        it("adds funder to the array of funders", async function () {
          await fundMe.fund({ value: send1ETH });
          const funder = await fundMe.getFunder(0);
          assert.equal(funder, deployer);
        });
      });

      describe("withdraw", async function () {
        // fund the contract with 1 ETH for each test case
        beforeEach(async function () {
          await fundMe.fund({ value: send1ETH });
        });

        it("withdraw ETH from a single funder", async function () {
          // 1. arrange
          const startingFundMeBallance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBallance = await fundMe.provider.getBalance(
            deployer
          );
          // 2. act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = effectiveGasPrice.mul(gasUsed);
          const endingFundMeBallance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBallance = await fundMe.provider.getBalance(
            deployer
          );

          // 3. assert
          assert.equal(endingFundMeBallance, 0);
          assert.equal(
            startingFundMeBallance.add(startingDeployerBallance).toString(),
            endingDeployerBallance.add(gasCost).toString()
          );
        });

        it("allow us to withdraw with multiple funders", async function () {
          // 1. arrange
          const accounts = await ethers.getSigners();
          // start with 1 because 0 is the deployer and send 1 ETH from 5 different accounts
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: send1ETH });
          }
          const startingFundMeBallance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBallance = await fundMe.provider.getBalance(
            deployer
          );
          // 2. act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = effectiveGasPrice.mul(gasUsed);
          const endingFundMeBallance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBallance = await fundMe.provider.getBalance(
            deployer
          );

          // 3. assert
          assert.equal(endingFundMeBallance, 0);
          assert.equal(
            startingFundMeBallance.add(startingDeployerBallance).toString(),
            endingDeployerBallance.add(gasCost).toString()
          );
          // check if the funders are reset properly
          await expect(fundMe.getFunder(0)).to.be.reverted;
          for (let i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });

        it("only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await fundMe.connect(attacker);
          await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner()"
          );
        });
      });

      // test a cheaper withdrawal
      describe("cheaper withdraw test", async function () {
        // fund the contract with 1 ETH for each test case
        beforeEach(async function () {
          await fundMe.fund({ value: send1ETH });
        });

        it("withdraw ETH from a single funder", async function () {
          // 1. arrange
          const startingFundMeBallance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBallance = await fundMe.provider.getBalance(
            deployer
          );
          // 2. act
          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = effectiveGasPrice.mul(gasUsed);
          const endingFundMeBallance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBallance = await fundMe.provider.getBalance(
            deployer
          );

          // 3. assert
          assert.equal(endingFundMeBallance, 0);
          assert.equal(
            startingFundMeBallance.add(startingDeployerBallance).toString(),
            endingDeployerBallance.add(gasCost).toString()
          );
        });

        it("allow us to withdraw with multiple funders", async function () {
          // 1. arrange
          const accounts = await ethers.getSigners();
          // start with 1 because 0 is the deployer and send 1 ETH from 5 different accounts
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: send1ETH });
          }
          const startingFundMeBallance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBallance = await fundMe.provider.getBalance(
            deployer
          );
          // 2. act
          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = effectiveGasPrice.mul(gasUsed);
          const endingFundMeBallance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBallance = await fundMe.provider.getBalance(
            deployer
          );

          // 3. assert
          assert.equal(endingFundMeBallance, 0);
          assert.equal(
            startingFundMeBallance.add(startingDeployerBallance).toString(),
            endingDeployerBallance.add(gasCost).toString()
          );
          // check if the funders are reset properly
          await expect(fundMe.getFunder(0)).to.be.reverted;
          for (let i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });

        it("only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await fundMe.connect(attacker);
          await expect(
            attackerConnectedContract.cheaperWithdraw()
          ).to.be.revertedWith("FundMe__NotOwner()");
        });
      });
    });
