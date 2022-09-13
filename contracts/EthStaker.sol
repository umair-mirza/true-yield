// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract EthStaker {

    address public owner;

    //Position is just amount of Ether staked by an address at a specific time for some duration
    struct Position {
        uint positionId;
        address walletAddress; //That created the position
        uint createdDate;
        uint unlockDate; //When funds can be withdrawn without penalty
        uint percentInterest;
        uint weiStaked;
        uint weiInterest; //Interest that the user will earn
        bool open;
    }

    Position private position;

    //It will increment after each new position is created
    uint256 public currentPositionId;

    //Every newly created position will be added to this mapping
    mapping (uint => Position) public positions;

    //For user to query all the positions that he has created
    mapping (address => uint[]) public positionIdsByAddress;
    
    //Data for number of days and interest rates
    mapping (uint => uint) public tiers;

    //Array that contains integers for lock periods (30 days, 90 days, 365 days)
    uint256[] public lockPeriods;

    //Payable to allow the deployer of the contract to send Ether to it when its being deployed
    constructor() payable {
        owner = msg.sender;
        currentPositionId = 0;

        tiers[30] = 700; //700 basis points which is 7% APY
        tiers[90] = 1000; //10% APY
        tiers[365] = 12000; //12% APY

        lockPeriods.push(30);
        lockPeriods.push(90);
        lockPeriods.push(365);
    }

    function stakeEther(uint numDays) external payable {
        //To make sure that the number of Days belong to one of the tiers
        require(tiers[numDays] > 0, "Mapping not found");

        positions[currentPositionId] = Position(
            currentPositionId,
            msg.sender,
            block.timestamp, //creation date
            block.timestamp + (numDays * 1 days), //unlock date
            tiers[numDays], //interest rate
            msg.value, //Ether to be staked
            calculateInterest(tiers[numDays], numDays, msg.value), //function to calculate the interest
            true //position status is set to open until user closes it
        );

        //To get the Ids of the positions a user owns
        positionIdsByAddress[msg.sender].push(currentPositionId);
        currentPositionId += 1;
    }

    function calculateInterest(uint basisPoints, uint numDays, uint weiAmount) private pure returns (uint) {
        return basisPoints * weiAmount / 10000;
    }

    function changeLockPeriods(uint numDays, uint basisPoints) external {
        require(owner == msg.sender, "Only owner can modify the staking periods");

        tiers[numDays] = basisPoints;
        lockPeriods.push(numDays);
    }
}