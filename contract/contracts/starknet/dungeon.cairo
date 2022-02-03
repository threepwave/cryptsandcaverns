# Crypts and Caverns - 9000 on-chain generative dungeons.
# Learn more: https://threepwave.com/cryptsandcaverns
# dungeon.cairo - main contract containing dungeon metadata

%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin

#### Data Structure ####
# token_id: [1, 9000] <- index
# owner: address
# environment: [0, 5]
# size: [6, 25]z
# name: string

struct Dungeon:
    # member token_id : felt    # [1, 9000] <- index which is not actually stored in the struct, just queried
    member owner : felt         # address of owner
    member environment : felt   # [0, 5]
    member size : felt          # [6, 25]
    member name : felt          # string
end

# owner - The token ID of the dungeon which is used as an index
@storage_var
func dungeon_owner(token_id : felt) -> (address : felt):
end

@storage_var
func dungeon_environment(token_id : felt) -> (environment : felt):
end

@storage_var
func dungeon_size(token_id : felt) -> (size : felt):
end

# name - string with lengths 5->40  @TODO - Double check this length
@storage_var
func dungeon_name(token_id : felt) -> (nname : felt):
end

# Set: Populates a dungeon owner's address by tokenId
@external
func set_dungeon{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt, address : felt, environment : felt, size : felt, name : felt):

    # Set the owner of this dungeon
    dungeon_owner.write(token_id, address)
    dungeon_environment.write(token_id, environment)
    dungeon_size.write(token_id, size)
    dungeon_name.write(token_id, name)
    
    return ()
end

# Get: Reads the current metadata for a dungeon by tokenId
@view
func get_dungeon{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (dungeon : Dungeon):
    
    let (address) = dungeon_owner.read(token_id)
    let (environment) = dungeon_environment.read(token_id)
    let (size) = dungeon_size.read(token_id)
    let (name) = dungeon_name.read(token_id)

    let dungeon = Dungeon(
        owner = address,
        environment = environment,
        size = size,
        name = name)
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


# Get: Reads the size of a dungeon by tokenId
@view
func get_size{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (size : felt):
    let (size) = dungeon_size.read(token_id)
    return (size)
end

# Get: Reads the size of a dungeon by tokenId
@view
func get_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(token_id : felt) -> (name : felt):
    let (name) = dungeon_name.read(token_id)
    return (name)
end