pragma solidity ^0.5.0;

contract election{

    event votedEvent (
        uint indexed _candidateId
    );

    struct candidate{
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint=>candidate) public candidates;

    uint public candidatesCount;
    
    constructor () public{
        addCandidate("can1");
        addCandidate("can2");
    }

    function addCandidate (string memory _name) private{
        candidatesCount++;
        candidates[candidatesCount] = candidate(candidatesCount,_name,0);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender],"Sender has voted before");

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount,"Invalid candidate");

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        emit votedEvent(_candidateId);
    }
}