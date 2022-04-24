// SPDX-License-Identifier: CC0-1.0

/// @title Heroes x Crypts and Caverns staking rewards

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
    function blockStaked(uint256) external view returns (uint256);
    function ownership(uint256) external view returns (address);
}

interface Hearts {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract CNCHeroes is Ownable, ReentrancyGuard {

    DungeonsStaker dungeonsStaker;  // Reference to staking contract
    Hearts hearts;  // Reference to hearts contract

    mapping(uint256 => uint256) blockClaimed;   // Block number that rewards were last claimed (defaults to 0)

    // Hearts calculation variables
    uint256 public heartsPerBlock = 5;  // HACK - Placeholder logic

    /** 
    * @notice Calculates the rewards for a set of dungoens
    * @dev Requires staked dungeons
    * @param tokenIds Array containing ids of dungeons.
    */
    function calculateRewards(uint256[] memory tokenIds) public view returns (uint256) {
        uint256 blocks = 0;

        for(uint256 i = 0; i < tokenIds.length; i++) {
            require(dungeonsStaker.blockStaked(tokenIds[i]) != 0, "This dungeon is not staked");
            require(dungeonsStaker.ownership(tokenIds[i]) != address(0), "You don't own this dungeon");
            
            // Check when user last claimed rewards. If they haven't, default to date staked.
            uint256 lastClaim = blockClaimed[tokenIds[i]] == 0 ? dungeonsStaker.blockStaked(tokenIds[i]) : blockClaimed[tokenIds[i]];
            blocks += block.number - lastClaim;
        }

        return(blocks);
    }

    /** 
    * @notice Distributes rewards to a user for a set of dungeons
    * @dev Requires staked dungeons that are eligible for rewards
    * @param tokenIds Array containing ids of staked dungeons.
    */
    function claimRewards(uint256[] memory tokenIds) public {
        uint256 rewards = calculateRewards(tokenIds) * heartsPerBlock;    // 5 hearts per block placeholder amount
        console.log('Sending hearts: ', rewards);
        // hearts.transfer(msg.sender, rewards);

        // Update claim time so hearts can't be claimed again
        for(uint256 i = 0; i < tokenIds.length; i++) {
            blockClaimed[tokenIds[i]] = block.number;
        }
    }

    // TODO: Add setters to update dungeonsStaker and Hearts contracts
    // TODO: Add setter for heartsPerBlock

    constructor(address _dungeonsStaker, address _hearts) {
        dungeonsStaker = DungeonsStaker(_dungeonsStaker);
        hearts = Hearts(_hearts);
    }
}

