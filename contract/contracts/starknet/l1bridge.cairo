# Crypts and Caverns - 9000 on-chain generative dungeons.
# Learn more: https://threepwave.com/cryptsandcaverns
# l1bridge.cairo - contract that synchronized state across L1/L2.

## How it works:
# Users hold and stake dungeons on ETH mainnet. 
# When a dungeon is staked or unstaked, an event is sent from the L1 contract to this contract.
# This contract then 'creates' or 'deletes' a dungeon at the given tokenId for the given user.

%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin

#### Interaces ####
# interface for dungeon contract
@contract_interface
namespace IDungeonContract:
    func set_dungeon(token_id : felt, address : felt, environment : felt, size : felt, name : felt):
    end
end

#### Configuration ####
# l1_address - The address of our L1 contract that will be sending stake/unstake messages
@storage_var
func l1_address() -> (address : felt):
end

# starknet_address - The address of our dungeons contract on starknet
@storage_var
func starknet_address() -> (address : felt):
end

#### Data Structure ####
# message
#   from_address [address] - The address of the L1 contract (to ensure the message is authentic)
#   token_id [1-9000] - The ID of the dungeon in question
#   staked [0-1] - if '1' the user has staked a dungeon and if '0' the user has unstaked a dungeon
#   user_address - The user's starknet address (required for stake but not unstake)

@constructor
func constructor{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    range_check_ptr
}(
    _l1_address : felt,
    _starknet_address : felt
):
    
    # Initialize contracts
    l1_address.write(_l1_address)   # Crypts and Caverns staking contraft on mainnet
    starknet_address.write(_starknet_address)   # dungeon.cairo contract on starknet

    return()
end



@l1_handler
func receive_message{
        syscall_ptr : felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr}(
        from_address : felt, token_id : felt, staked : felt, user_address : felt, environment : felt, size : felt, name : felt):
    
    # Make sure the message was sent by the intended L1 contract.
    let (contract) = l1_address.read()
    assert from_address = contract

    # Instantiate the dungeon
    IDungeonContract.set_dungeon(
        contract_address=from_address,
        token_id=token_id,
        address=user_address,
        environment=environment,
        size=size,
        name=name)

    return ()
end

