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
    # member token_id : felt    # [1, 9000] <- index which is not actually stored in the struct, just queried
    member owner : felt         # address of owner
    member environment : felt   # [0, 5]
    # member size : felt          # [6, 25]
    # member name : felt          # string
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
        range_check_ptr}(token_id : felt, address : felt, environment : felt):

    # Set the owner of this dungeon
    dungeon_owner.write(token_id, address)
    dungeon_environment.write(token_id, environment)
    
    return ()
end

# Get: Reads the current metadata for a dungeon by tokenId
@view
func get_dungeon{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (dungeon : Dungeon):
   
    let (address) = dungeon_owner.read(token_id)
    let (environment) = dungeon_environment.read(token_id)

    let dungeon = Dungeon(
        owner = address,
        environment = environment)
    return (dungeon)
end

## Individual variable getters ##
# Get: Reads the owner of a dungeon by tokenId
@view
func get_owner{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (address : felt):
    let (address) = dungeon_owner.read(token_id)
    return (address)
end

# Get: Reads the environment of a dungeon by tokenId
@view
func get_environment{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (environment : felt):
    let (environment) = dungeon_environment.read(token_id)
    return (environment)
end