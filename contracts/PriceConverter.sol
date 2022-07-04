// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Library ==> https://solidity-by-example.org/library

// Why is this a library and not abstract?
// Why not an interface?
library PriceConverter {
    // We could make this public, but then we'd have to deploy it
    function getPrice() internal view returns (uint256) {
      // We need two things from an external contract:
      // 1. Contract address :: comes from the fixed address in this case
      // 2. ABI (Application Binary Interface) :: comes from the imported interface AggregatorV3Interface.sol
      // Rinkeby ETH / USD Address ==> 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
      // https://docs.chain.link/docs/ethereum-addresses/
      AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
      (, int256 answer, , , ) = priceFeed.latestRoundData();
      // ETH to USD rate in 18 digit
      return uint256(answer * 1e10); // 1e10 = 1**10 == 10000000000
    }

    // 1000000000
    function getConversionRate(uint256 ethAmount) internal view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18; // 1000000000000000000
        // the actual ETH/USD conversion rate, after adjusting the extra 0s.
        return ethAmountInUsd;
    }
}
