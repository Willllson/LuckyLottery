pragma solidity ^0.5.0;

import "./DappToken.sol";

contract DappTokenSale {
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
        // assign an admin
        admin = msg.sender;
        tokenContract = _tokenContract;
        //set token price
        tokenPrice = _tokenPrice;
    }

    function multiple(uint x, uint y) internal pure returns (uint z){
        require(y == 0 ||(z = x * y) / y ==x);
    }

    // buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        //require the value is equal to the tokens
        require(msg.value == multiple(_numberOfTokens, tokenPrice));
        //require the contract has enough tokens
        require(tokenContract.balanceOf(msg.sender) >= _numberOfTokens);
        //require the transfer is a success
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // keep track of tokens sold
        tokensSold += _numberOfTokens;
        // trigger sell event
        emit Sell(msg.sender, _numberOfTokens);
    }

    // end sale
    function endSale() public {
        // require admin
        require(msg.sender == admin);
        // transfer remaining tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(msg.sender)));
        // destroy contract
        selfdestruct(msg.sender);
    }
}