// SPDX-License-Identifier: CC0-1.0

/// @title Staking/Unstaking interface for Crypts and Caverns

/*****************************************************
0000000                                        0000000
0001100  Crypts and Caverns                    0001100
0001100     9000 generative on-chain dungeons  0001100
0003300                                        0003300
*****************************************************/

pragma solidity ^0.8.0;

import "hardhat/console.sol";   // HACK Remove before shipping

// TODO - Look into Upgradeable
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface Dungeons {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract DungeonsStaker is ERC721Holder, Ownable, ReentrancyGuard, Pausable {

    /* Broadcast events for subgraph graph and analytics) */
    event Stake(uint256[] tokenIds, address player);
    event Unstake(uint256[] tokenIds, address player);

    Dungeons dungeons; // Reference to our original Crypts and Caverns contract 

    // TODO - Check write gas for uint16 array, map of strct w/ uint256 vs. this map
    mapping(uint256 => uint256) epochStaked;
    mapping(uint256 => address) ownership;

    // optimization idea - store numstaked per address vs full map of tokens

    uint256 genesis;
    uint256 epoch;

    /** 
    * @notice Stakes a dungeon in the contract so rewards can be earned 
    * @dev Requires an unstaked dungeon.
    * @param tokenIds Array containing ids of dungeons.
    */
    function stake(uint256[] memory tokenIds) external whenNotPaused nonReentrant {
        for(uint256 i = 0; i < tokenIds.length; i++) {
            // Verify that user owns this dungeon
            require(dungeons.ownerOf(tokenIds[i]) == msg.sender, "You do not own this Dungeon");

            // Set ownership of token to staker
            ownership[tokenIds[i]] = msg.sender;

            // Set epoch date for this sender so we know how long they've staked for
            epochStaked[tokenIds[i]] = _epochNum(); 

            // Transfer Dungeon to staking contract
            dungeons.transferFrom(  // We can use transferFrom to save gas because we know our contract is IERC721Receivable
                msg.sender,
                address(this),
                tokenIds[i]
            );
        }
        
        emit Stake(tokenIds, msg.sender);
    }

    /** 
    * @notice Removes a dungeon from staking (and claims any accrued rewards)
    * @dev Requires a staked dungeon.
    * @param tokenIds Array containing ids of dungeons.
    */
    function unstake(uint256[] memory tokenIds) external whenNotPaused nonReentrant {
        for(uint256 i = 0; i < tokenIds.length; i++) {
            // Verify that user originally staked this dungeon
            require(ownership[tokenIds[i]] == msg.sender, "You do not own this Dungeon");

            // Set ownership of token to null (unstaked)
            ownership[tokenIds[i]] = address(0);

            // Reset epoch to zero for this token (unstaked)
            epochStaked[tokenIds[i]] = 0;

            // Transfer dungeon from staking contract back to user
            dungeons.safeTransferFrom(  // We use safeTransferFrom here to make sure the user's wallet is ERC721 compatible
                address(this),
                msg.sender,
                tokenIds[i]
            );
        }
        
        emit Unstake(tokenIds, msg.sender);
    }
    

    /** 
    * @notice Check how many dungeons are currently staked by this user
    * @dev requires a player's address
    */
    function getNumStaked(address _player) public view returns (uint256) {
       uint256 totalDungeons = 0;

        // Loop through mapping (doable because there are only 9000) and count how many the player owns
        for(uint256 i = 1; i <= 9000; i++) {
            if(ownership[i] == _player) {
                totalDungeons++;
            }
        }

        return totalDungeons;
    }

    /** 
    * @notice Check which dungeons are staked by a given player
    * @dev requires a player's address
    */
    function getStakedIds(address _player) public view returns (uint256[] memory) {
        uint256[] memory dungeonIds = new uint256[](getNumStaked(_player));

        uint256 count = 0;  // Track current array index since we can't use dynamic arrays outside of storage

        // Loop through mapping (doable because there are only 9000) and identify ids the player owns
        for(uint256 i = 1; i <= 9000; i++) {
            if(ownership[i] == _player) {
               dungeonIds[count] = i;
               count++;
            }
        }

        return dungeonIds;
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

