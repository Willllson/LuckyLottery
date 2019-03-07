pragma solidity ^0.5.0;

contract Ownable {
    address public _owner;

    constructor(address owner) public {
        _owner = owner;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner,"sender is not the owner");
        _;
    }
  
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0),"new owner's address is not correct");
        _owner = newOwner;
    }
}