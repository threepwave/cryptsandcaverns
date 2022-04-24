// SPDX-License-Identifier: CC0-1.0

/// @title List of projects with calls for each

/*****************************************************
0000000                                        0000000
0001100  Crypts and Caverns                    0001100
0001100     9000 generative on-chain dungeons  0001100
0003300                                        0003300
*****************************************************/

pragma solidity ^0.8.0;

import "hardhat/console.sol";   // HACK Remove before shipping
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface DungeonsStaker {
    function blockStaked(uint256 tokenId) external returns (uint256); // TODO: add interface for staking contract (to get stake time)
}

contract DungeonsStakerHelper is Ownable, ReentrancyGuard {

    DungeonsStaker dungeonsStaker;  // Reference to staking contract

    // function editProject()
    constructor(address _dungeonsStaker) {
        dungeonsStaker = DungeonsStaker(_dungeonsStaker);
    }
}

