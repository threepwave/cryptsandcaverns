##### dungeon #####
# Represents a Crypts and Caverns dungeon on Starknet
# Currently contains basic metadata needed to interact with Realms 

%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_nn_le

#### Data Structure ####
# tokenId: [1, 9000]
# owners: address
# environment: [0, 5]
# size: [6, 25]
# name: string

# tokenId - The token ID of the dungeon (from L1) which is used as an index
@storage_var
func dungeon_tokenId() -> (res : felt):
end

# owner  - The token ID of the dungeon (from L1) which is used as an index
@storage_var
func dungeon_owner(
        tokenId : felt
    ) -> (
        user_id : felt
    ):
end


## Functions 
# HACK - Sets the tokenId
@external
func set_tokenId{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(value : felt):
    dungeon_tokenId.write(value)
    return ()
end

# HACK - Reads the tokenId
@view
func get_tokenId{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}() -> (value : felt):
    let (value) = dungeon_tokenId.read()
    return (value)
end

