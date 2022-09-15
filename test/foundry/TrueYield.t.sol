// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../../contracts/TrueYield.sol";

contract TrueYieldTest is Test {
    TrueYield public trueYield;

    address owner = address(0x1234);
    address userOne = address(0x1122);
    address deployer;

    //Setup Function
    //Owner deployed the contract
    function setUp() public {
        vm.startPrank(owner);
        trueYield = new TrueYield();
        deployer = owner;
        vm.stopPrank();
    }

    //Deployer is the owner
    function testOwner() public {
        assertEq(deployer, address(0x1234));
        assertEq(trueYield.currentPositionId(), 0);
    }

}