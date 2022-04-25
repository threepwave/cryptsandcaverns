// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IStarknetCore.sol";

import "hardhat/console.sol";   // HACK Remove before shipping

interface DungeonsStaker {
    function blockStaked(uint256) external view returns (uint256);
    function ownership(uint256) external view returns (address);
    function locked(uint256) external view returns (uint256);
    function lock(uint256[] memory) external;
    function unlock(uint256[] memory) external;
}

contract DungeonsBridgeStarknet is
    Ownable,
    ReentrancyGuard
{
    DungeonsStaker public l1contract;
    uint256 public l2bridge; // Address of Dungeons starknet contract
    // The StarkNet core contract.
    IStarknetCore starknetCore;

    /* Starknet */
    // The selector of the "depositFromL1" @l1_handler at StarkNet contract
    uint256 constant private DEPOSIT_SELECTOR =
        512408049450392852989582095984328044240489742106100269794433337059943365139;

    /** 
    * @notice Sets a new address for the L2 dungeons contract on Starknet
    * @param _newAddress uint256 containing a felt contract address
    */
    function setL2BridgeAddress(uint256 _newAddress) external onlyOwner {
        l2bridge = _newAddress;
    }

    /** 
    * @notice Sets a new address for the L1 dungeons contract on Eth mainnet
    * @param _newAddress a valid contract address
    */
    function setL1ContractAddress(address _newAddress) external onlyOwner {
        l1contract = DungeonsStaker(_newAddress);
    }

    function setStarknetCore(address _starknetCoreAddress) external onlyOwner {
        starknetCore = IStarknetCore(_starknetCoreAddress);
    }

    /** 
    * @notice Lock your staked dungeon and transport it to Starknet
    * @dev The dungeon needs to be staked in the DungeonsStaker contract
    * @param _l2Address a uint256 containing the user's l2 wallet address
    * @param tokenIds a uint256 array containing tokens to deposit
    */
    function depositToL2(uint256 _l2Address, uint256[] memory tokenIds) external nonReentrant {
        require(l2bridge != 0, "L2_CONTRACT_ADDRESS_REQUIRED");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(l1contract.blockStaked(tokenIds[i]) != 0, "This dungeon must be staked before bridging.");
            require(l1contract.ownership(tokenIds[i]) == msg.sender, "You do not own this dungeon.");
            console.log('Bridging dungeon: ', tokenIds[i]);
        }

        l1contract.lock(tokenIds);   // Lock the token so it can't be unstaked while on L2 (until unlocked).

        /* TODO: Test sending payload to starknet (which is hard to test locally)
        uint256[] memory payload = new uint256[](2 + (_realmIds.length * 2));
        // payload[0] = uint256(uint160(address(msg.sender))); // address should be converted to uint256 first
        payload[0] = _l2AccountAddress;
        payload[1] = _realmIds.length * 2; // multiplying because there are low/high values for each uint256
        for (uint256 i = 0; i < _realmIds.length; i++) {
          (uint256 low, uint256 high) = splitUint256(_realmIds[i]);
          payload[2 + (i * 2)] = low; // save low bits
          payload[2 + (i * 2) + 1] = high; // save high bits
        }

        // Send the message to the StarkNet core contract.
        starknetCore.sendMessageToL2(l2BridgeAddress, DEPOSIT_SELECTOR, payload); */
    }

    /** 
    * @notice Unlock your staked dungeon and transport it to ETH mainnet
    * @dev Required the dungeon to already be staked in the DungeonsStaker contract
    * @param tokenIds a uint256 array containing tokens to deposit
    */
    function withdrawFromL2(uint256[] memory tokenIds) external nonReentrant {
        require(l2bridge != 0, "L2_CONTRACT_ADDRESS_REQUIRED");
        

        // TODO - pickup message from L2 containing these tokenIds

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(l1contract.blockStaked(tokenIds[i]) != 0, "This dungeon must be staked before bridging back.");
            // TODO - check the owner from L2 bridge and make sure they still own the dungeon
            require(l1contract.locked(tokenIds[i]) != 0, "This dungeon has not been bridged to L2.");
            console.log('Un-bridging dungeon: ', tokenIds[i]);
        }

        l1contract.unlock(tokenIds);   // Lock the token so it can't be unstaked while on L2 (until unlocked).
    }

    /*
    function withdrawFromL2(
        address _to,
        uint256[] memory _realmIds
    ) public override {
        require(l2BridgeAddress != 0, "L2_CONTRACT_ADDRESS_REQUIRED");
        
        // Construct the withdrawal message's payload.
        uint256[] memory payload = new uint256[](1 + (_realmIds.length * 2));

        payload[0] = uint256(uint160(address(_to))); // TODO: needs to be tested 
        
        for (uint256 i = 0; i < _realmIds.length; i++) {
          (uint256 low, uint256 high) = splitUint256(_realmIds[i]);
          payload[1 + (i * 2)] = low; // save low bits
          payload[1 + (i * 2) + 1] = high; // save high bits
        }

        // Consume the message from the StarkNet core contract.
        // This will revert the (Ethereum) transaction if the message does not exist.
        starknetCore.consumeMessageFromL2(l2BridgeAddress, payload);

        for (uint256 i = 0; i < _realmIds.length; i++) {
          l1RealmsContract.safeTransferFrom(address(this), _to, _realmIds[i]);
        }
    }

    function splitUint256(uint256 value) internal pure returns (uint256, uint256) {
      uint256 low = value & ((1 << 128) - 1);
      uint256 high = value >> 128;
      return (low, high);
    }
 */
    constructor(address _l1contract, uint256 _l2bridge, address _starknetCoreAddress) {
        l1contract = DungeonsStaker(_l1contract);
        l2bridge = _l2bridge;
        starknetCore = IStarknetCore(_starknetCoreAddress);
    }
}