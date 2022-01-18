##### dungeon #####
# Represents a Crypts and Caverns dungeon on Starknet
# Currently contains basic metadata needed to interact with Realms 

%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import (assert_nn_le, assert_nn)

#### Data Structure ####
# tokenId: [1, 9000]
# owners: address
# environment: [0, 5]
# size: [6, 25]
# name: string

# tokenIds - The token ID of the dungeon (from L1) which is used as an index
# Set minimum and maximum so we know the range of valid IDs
const MIN_TOKENID = 1
const MAX_TOKENID = 9000

# owner  - The token ID of the dungeon (from L1) which is used as an index
@storage_var
func dungeon_owner(token_id : felt) -> (address : felt):
end


## Functions 
# Populates a tokenId (via mainnet)
@external
func set_token_id{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt, address : felt):
    
    # Check that id is valid (between 1-9000
    assert_nn_le(token_id, MAX_TOKENID)
    assert_nn_le(MIN_TOKENID, token_id)

    # Check that address is valid (not null)
    assert_nn(address)

    # Set the owner of this dungeon
    dungeon_owner.write(token_id, address)
    
    return ()
end

# Reads the current metadata for a dungeon by id
@view
func get_dungeon{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (address : felt):
    let (address) = dungeon_owner.read(token_id)
    return (address)
end

