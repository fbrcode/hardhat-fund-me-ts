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

## Using hardhat-deploy

This package make this a lot easier to handle deployments: <https://github.com/wighawag/hardhat-deploy>

`yarn add --dev hardhat-deploy`

Remap ethers to work with **hardhat-deploy**:

`yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers`

## Coding styling

Some basic rules con code styling, ordering and documentation.

- <https://docs.soliditylang.org/en/v0.8.13/style-guide.html#order-of-layout>
- <https://docs.soliditylang.org/en/v0.8.11/natspec-format.html#natspec>

## Testing

**`tests/unit`** : Unit tests are done locally.

**`tests/staging`** : Staging tests are done on a testnet (LAST STOP!).

## GAS Optimization

Tutorial: <https://youtu.be/gyMwXuJrbJQ?t=42758>

Storage <https://docs.soliditylang.org/en/v0.8.11/internals/layout_in_storage.html>

EVM Opcodes: <https://github.com/crytic/evm-opcodes>

## Typescript your JS code

Installing typescript packages:

yarn add --dev @typechain/ethers-v5 @typechain/hardhat @types/chai @types/node @types/mocha ts-node typechain typescript
