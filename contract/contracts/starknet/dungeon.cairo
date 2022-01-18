%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin

#### Data Structure ####
# token_id: [1, 9000] <- index
# owner: address
# environment: [0, 5]
# size: [6, 25]
# name: string

struct Dungeon:
    # member token_id : felt    # index which is not actually stored in the struct, just queried
    member owner : felt
    # member environment : felt
    # member size : felt
    # member name : felt
end

# owner - The token ID of the dungeon which is used as an index
@storage_var
func dungeon_owner(token_id : felt) -> (address : felt):
end

@storage_var
func dungeon_environment(token_id : felt) -> (environment : felt):
end

# Set: Populates a dungeon owner's address by tokenId
@external
func set_token_id{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt, address : felt):

    # Set the owner of this dungeon
    dungeon_owner.write(token_id, address)
    
    return ()
end

# Get: Reads the current metadata for a dungeon by tokenId
@view
func get_dungeon{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (dungeon : Dungeon):
    let (address) = dungeon_owner.read(token_id)

    let dungeon = Dungeon(
        address = address)
    return (dungeon)
end