pragma solidity ^0.5.0;

contract DappToken{
    string public name = "DApp Token";
    string public symbol ="DApp";
    string public standard = "DApp Token v1.0";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    // constructor
    constructor(uint256 _initialsupply) public{
        balanceOf[msg.sender] = _initialsupply;
        totalSupply = _initialsupply;
        // allocate the initial supply
    }

    // transfer value
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender,_to,_value);

        return true;
    }

    // delegate your transfer to others, i don't think it is necessary in this project
}