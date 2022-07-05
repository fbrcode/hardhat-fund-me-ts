// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
// 1: Pragma statements

// Style Guide: https://docs.soliditylang.org/en/v0.8.13/style-guide.html#order-of-layout
// General style: 1: Pragma statements || 2: Import statements || 3: Interfaces || 4: Libraries || 5: Errors || 6: Contracts
// Inside contract: 6.a: Type declarations || 6.b: State variables || 6.c: Events || 6.d: Modifiers || 6.e: Functions
// Function grouping: 6.e.1: constructor || 6.e.2: receive || 6.e.3: fallback || 6.e.4: external || 6.e.5: public || 6.e.6: internal || 6.e.7: private || 6.e.8: view / pure

// hibrid smart contract combines on-chain and off-chain functionality

// 2: Import statements
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// 3: Interfaces (none in this case)

// 4: Libraries (none in this case)

// 5: Errors
error FundMe__NotOwner();

// 6: Contracts

// Code documentation: https://docs.soliditylang.org/en/v0.8.11/natspec-format.html#natspec
/** @title A contract for crowd funding
 *  @author Fabio Bressler
 *  @notice This contract is to demo a sample funding contract
 *  @dev This implements price feeds as our library
 */
contract FundMe {
  // 6.a: Type declarations
  using PriceConverter for uint256;

  // 6.b: State variables
  mapping(address => uint256) private s_addressToAmountFunded;
  address[] private s_funders;
  address private immutable i_owner; // Could we make this constant?  /* hint: no! We should make it immutable! */
  uint256 public constant MINIMUM_USD = 50 * 10**18; // contsants cost less gas than variables

  AggregatorV3Interface private immutable s_priceFeed;

  // 6.c: Events (none in this case)

  // 6.d: Modifiers
  modifier onlyOwner() {
    // require(msg.sender == owner);
    if (msg.sender != i_owner) revert FundMe__NotOwner();
    _;
  }

  // 6.e: Functions
  // 6.e.1: constructor
  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  // Explainer from: https://solidity-by-example.org/fallback/
  // Ether is sent to contract
  //      is msg.data empty?
  //          /   \
  //         yes  no
  //         /     \
  //    receive()?  fallback()
  //     /   \
  //   yes   no
  //  /        \
  //receive()  fallback()

  // 6.e.2: receive
  receive() external payable {
    fund();
  }

  // 6.e.3: fallback
  fallback() external payable {
    fund();
  }

  // 6.e.4: external (none in this case)

  // 6.e.5: public

  /** @notice This function funds this contract
   *  @dev Used price feed settings to ETH -> USD conversion and minimum USD amount check
   */
  function fund() public payable {
    require(
      msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
      "You need to spend more ETH!"
    );
    // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
    s_addressToAmountFunded[msg.sender] += msg.value;
    s_funders.push(msg.sender);
  }

  function getVersion() public view returns (uint256) {
    return s_priceFeed.version();
  }

  function withdraw() public payable onlyOwner {
    for (
      uint256 funderIndex = 0;
      funderIndex < s_funders.length;
      funderIndex++
    ) {
      address funder = s_funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);
    // // transfer
    // payable(msg.sender).transfer(address(this).balance);
    // // send
    // bool sendSuccess = payable(msg.sender).send(address(this).balance);
    // require(sendSuccess, "Send failed");
    // call
    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    require(callSuccess, "Call failed");
  }

  function cheaperWithdraw() public payable onlyOwner {
    // read into memory once and the work with it instead
    address[] memory funders = s_funders;
    // note: mappings cannot be in memory right now
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);
    (bool callSuccess, ) = i_owner.call{value: address(this).balance}("");
    require(callSuccess, "Call failed");
  }

  // 6.e.6: internal (none in this case)

  // 6.e.7: private (none in this case)

  // 6.e.8: view / pure (none in this case)
  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getFunder(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  function getAddressToAmountFunded(address funder)
    public
    view
    returns (uint256)
  {
    return s_addressToAmountFunded[funder];
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }
}

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly
