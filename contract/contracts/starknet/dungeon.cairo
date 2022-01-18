##### dungeon #####
# Represents a Crypts and Caverns dungeon on Starknet
# Currently contains basic metadata needed to interact with Realms 

%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import (assert_nn_le, assert_nn)

#### Data Structure ####
# tokenId: [1, 9000]
# owner: address
# environment: [0, 5]
# size: [6, 25]
# name: string

struct Dungeon:
    member token_id : felt
    member owner : felt
    member environment : felt
    # member size : felt
    # member name : felt
end

# tokenIds - The token ID of the dungeon (from L1) which is used as an index
# Set minimum and maximum so we know the range of valid IDs
const MIN_TOKENID = 1
const MAX_TOKENID = 9000

## STORAGE ##

# owner  - The token ID of the dungeon (from L1) which is used as an index
@storage_var
func dungeon_owner(token_id : felt) -> (address : felt):
end

@storage_var
func dungeon_environment(token_id : felt) -> (environment : felt):
end


## WRITES ##

# Populates a tokenId (via mainnet)
@external
func set_dungeon{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt, owner : felt, environment : felt):
        # range_check_ptr}(token_id : felt, environment : felt):
    
    # Check that id is valid (between 1-9000
    # assert_nn_le(token_id, MAX_TOKENID)
    # assert_nn_le(MIN_TOKENID, token_id)

    # Set the owner of this dungeon
    dungeon_owner.write(token_id, owner)
    dungeon_environment.write(token_id, environment)
    
    return ()
end

## READS ##

# Reads the current metadata for a dungeon by id
@view
func get_dungeon{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(id : felt) -> (dungeon : Dungeon):
    let (owner) = dungeon_owner.read(id)
    let (environment) = dungeon_environment.read(id)

    let dungeon = Dungeon(
        token_id = id,
        owner = owner,
        environment = environment)

    return (dungeon)
end

# Reads the owner's address (address) for a dungeon by id
@view
func get_address{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (address : felt):
    let (address) = dungeon_owner.read(token_id)
    return (address)
end

# Reads the environment (int 0->5) for a dungeon by id
@view
func get_environment{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (environment : felt):
    let (environment) = dungeon_environment.read(token_id)
    return (environment)
end