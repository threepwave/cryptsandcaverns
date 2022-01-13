// SPDX-License-Identifier: CC0-1.0

/// @title Staking/Unstaking interface for Crypts and Caverns

/*****************************************************
0000000                                        0000000
0001100  Crypts and Caverns                    0001100
0001100     9000 generative on-chain dungeons  0001100
0003300                                        0003300
*****************************************************/

pragma solidity ^0.8.0;

import "hardhat/console.sol";

// TODO - Look into Upgradeable
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface Dungeons {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract DungeonsStaker is ERC721Holder, Ownable, ReentrancyGuard, Pausable {

    /* Broadcast events for subgraph graph and analytics) */
    event Stake(uint256[] tokenIds, address player);
    event UnStake(uint256[] tokenIds, address player);

    Dungeons dungeons; // Reference to our original Crypts and Caverns contract 

    mapping(address => uint256) epochClaimed;
    mapping(uint256 => address) ownership;
    mapping(address => mapping(uint256 => uint256)) public dungeonsStaked;

    uint256 genesis;
    uint256 epoch;

    /** 
    * @notice Stakes a dungeon in the contract so rewards can be earned 
    * @dev Requires an unstaked dungeon.
    */
    function stake(uint256[] memory tokenIds) external whenNotPaused nonReentrant {
        for(uint256 i = 0; i < tokenIds.length; i++) {
            // Verify that user owns this dungeon
            require(dungeons.ownerOf(tokenIds[i]) == msg.sender, "You do not own this Dungeon");

            // Set ownership of token to staker
            ownership[tokenIds[i]] = msg.sender;

            // Transfer Dungeon to staking contract
            dungeons.transferFrom(  // We can use transferFrom to save gas because we know our contract is IERC721Receivable
                msg.sender,
                address(this),
                tokenIds[i]
            );
        }

        // Set epoch date for this sender
        if (getNumStaked(msg.sender) == 0) {
            epochClaimed[msg.sender] = _epochNum();
        }

        // Update number of dungeons staked this epoch
        dungeonsStaked[msg.sender][_epochNum()] += uint256(tokenIds.length);
        
         emit Stake(tokenIds, msg.sender);
    }

    /** 
    * @notice Check how many dungeons are currently staked by this user
    * @dev requires a player's address
    */
    function getNumStaked(address _player) public view returns (uint256) {
        uint256 totalDungeons;

        if (_epochNum() >= 1) {
            for (uint256 i = epochClaimed[_player]; i <= _epochNum(); i++) {
                totalDungeons += dungeonsStaked[_player][i];
            }
            return totalDungeons;
        } else {
            return dungeonsStaked[_player][0];
        }
    }

    /**
     * @notice Check the current epoch for calculating how long a dungeon has been staked
     */
    function _epochNum() internal view returns (uint256) {
        return (block.timestamp - genesis) / (epoch * 3600);
    }

    constructor(uint256 _epoch, address _dungeonsAddress) {
        genesis = block.timestamp;
        epoch = _epoch;
        dungeons = Dungeons(_dungeonsAddress);
    }
}

