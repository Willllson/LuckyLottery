pragma solidity ^0.5.0;

contract lottery{

    event drawedEvent (
        uint indexed _candidateId
    );

    struct prize{
        uint id;
        string name;
        uint drawCount;
        //uint probability; //概率的倒数
        address[] winners;
        uint amount;
    }

    struct random{
        uint i;
        uint drawCount;
    }


    mapping(address => bool) public drawers;
    mapping(uint=>prize) public prizes;
    //这里返还随机数i给js
    mapping(uint=>uint) public randomval;
    mapping(uint=>uint) public finalresult;

    uint public prizeCount;
    //uint public i;
    
    constructor () public{
        addPrize("1 ether",1);
        addPrize("2 ether",2);
        addPrize("3 ether",3);
        addPrize("4 ether",4);
        addPrize("5 ether",5);
        addPrize("15 ether",15);
    }

    function addPrize (string memory _name, uint _amount) private{
        prizeCount++;
        address[] memory winner;
        prizes[prizeCount] = prize(prizeCount,_name,0,winner,_amount);
    }

    function draw (uint drawValue)public payable {
        // require that they haven't drawed before
        //require(!drawers[msg.sender],"Sender has drawed before");
        uint value = msg.value;
        require(value == drawValue*5 ether && drawValue > 0,"Invalid amount");
        
        // require a valid candidate
        //require(_prizeId > 0 && _prizeId <= prizeCount,"Invalid candidate");

        // record that drawr has drawd
        drawers[msg.sender] = true;

        // update candidate draw Count
        //prizes[_prizeId].drawCount ++;

        //emit drawedEvent(_prizeId);

        //这里生成随机数i
        uint i = getRandomNum(msg.sender);
        randomval[0] = i%prizeCount;
        uint prizeIndex = prizeCount-randomval[0];
        finalresult[0] = prizes[prizeIndex].amount * drawValue;
        msg.sender.transfer(finalresult[0]*1000000000000000000);

        //这里把相对应的奖品发放给用户


    }

    function getRandomNum(address sender) internal view returns(uint) {
        bytes32 blockhashBytes = blockhash(block.number - 1);
        //bytes4 lotteryBytes = bytes4(lotteryCnt);
        uint joinLength = blockhashBytes.length + 20;//+ lotteryBytes.length;
        bytes memory hashJoin = new bytes(joinLength);
        uint k = 0;
        for (uint i = 0; i < blockhashBytes.length; i++) {
            hashJoin[k++] = blockhashBytes[i];
        }
        // bytes 拼接 msg.sender 地址
        for (uint i = 0; i < 20; i++) {
            hashJoin[k++] = byte(uint8(uint(sender) / (2 ** (8 * (19 - i))))); 
        }
        /*for (uint i = 0; i < lotteryBytes.length; i++) {
            hashJoin[k++] = lotteryBytes[i];
        }*/
        return uint(keccak256(hashJoin));
    }
}