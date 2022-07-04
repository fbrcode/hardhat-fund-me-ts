# Fund Me Hardhat Project

## Init

- `git init`
- `yarn init -y`
- `yarn add --dev hardhat`
- `yarn hardhat`

Options:

```txt
👷 Welcome to Hardhat v2.9.9 👷‍

✔ What do you want to do? · Create an advanced sample project
✔ Hardhat project root: · /Users/fabiobressler/src/code-along-solidity/hardhat-fund-me-ts
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with yarn (
  @nomiclabs/hardhat-waffle
  ethereum-waffle
  chai
  @nomiclabs/hardhat-ethers
  ethers
  @nomiclabs/hardhat-etherscan
  dotenv
  eslint
  eslint-config-prettier
  eslint-config-standard
  eslint-plugin-import
  eslint-plugin-node
  eslint-plugin-prettier
  eslint-plugin-promise
  hardhat-gas-reporter
  prettier
  prettier-plugin-solidity
  solhint
  solidity-coverage
)? (Y/n) · y
```

### About solhint

Solidity Linter <https://www.npmjs.com/package/solhint> - analyses the code and look for errors.

## Install chainlink contracts

In order to compile the fund me contract, we need the chainlink contracts. Import them with:

`yarn add --dev @chainlink/contracts`
