%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bitwise import bitwise_and
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.math import unsigned_div_rem
from starkware.cairo.common.math_cmp import is_in_range, is_le
from starkware.cairo.common.registers import get_label_location
from starkware.cairo.common.uint256 import (
    Uint256, uint256_add, uint256_sub, uint256_shl, uint256_lt, uint256_unsigned_div_rem)
from lib.keccak import keccak256
from lib.swap_endianness import swap_endianness_64

const TOP = 0xffffffffffffffff0000000000000000
const BOTTOM = 0xffffffffffffffff

func get_prefix(idx : felt) -> (prefix : felt):
    let (l) = get_label_location(prefixes)
    let arr = cast(l, felt*)
    return (arr[idx])

    prefixes:
    dw 'Abyssal'
    dw 'Ancient'
    dw 'Bleak'
    dw 'Bright'
    dw 'Burning'
    dw 'Burning'
    dw 'Collapsed'
    dw 'Corrupted'
    dw 'Dark'
    dw 'Decrepid'
    dw 'Desolate'
    dw 'Dire'
    dw 'Divine'
    dw 'Emerald'
    dw 'Empyrean'
    dw 'Fallen'
    dw 'Glowing'
    dw 'Grim'
    # the following is "Heaven's" encoded as felt,
    # because Cairo doesn't support \'s escaping,
    # so 'Heaven\'s' doesn't work
    dw 5216682904514340723
    dw 'Hidden'
    dw 'Holy'
    dw 'Howling'
    dw 'Inner'
    dw 'Morbid'
    dw 'Murky'
    dw 'Outer'
    dw 'Shimmering'
    # similar as with Heaven's above, this is
    # the felt encoded string literal of "Siren's"
    dw 23478363115890547
    dw 'Sunken'
    dw 'Whisperin'
end

func get_land(idx : felt) -> (land : felt):
    let (l) = get_label_location(land)
    let arr = cast(l, felt*)
    return (arr[idx])

    land:
    dw 'Canyon'
    dw 'Catacombs'
    dw 'Cavern'
    dw 'Chamber'
    dw 'Cloister'
    dw 'Crypt'
    dw 'Den'
    dw 'Dunes'
    dw 'Field'
    dw 'Forest'
    dw 'Glade'
    dw 'Gorge'
    dw 'Graveyard'
    dw 'Grotto'
    dw 'Grove'
    dw 'Halls'
    dw 'Keep'
    dw 'Lair'
    dw 'Labyrinth'
    dw 'Landing'
    dw 'Maze'
    dw 'Mountain'
    dw 'Necropolis'
    dw 'Oasis'
    dw 'Passage'
    dw 'Peak'
    dw 'Prison'
    dw 'Scar'
    dw 'Sewers'
    dw 'Shrine'
    dw 'Sound'
    dw 'Steppes'
    dw 'Temple'
    dw 'Tundra'
    dw 'Tunnel'
    dw 'Valley'
    dw 'Waterfall'
    dw 'Woods'
end

func get_suffix(idx : felt) -> (suffix : felt):
    let (l) = get_label_location(suffixes)
    let arr = cast(l, felt*)
    return (arr[idx])

    suffixes:
    dw 'Agony'
    dw 'Anger'
    dw 'Blight'
    dw 'Bone'
    dw 'Brilliance'
    dw 'Brimstone'
    dw 'Corruption'
    dw 'Despair'
    dw 'Dread'
    dw 'Dusk'
    dw 'Enlightenment'
    dw 'Fury'
    dw 'Fire'
    dw 'Giants'
    dw 'Gloom'
    dw 'Hate'
    dw 'Havoc'
    dw 'Honour'
    dw 'Horror'
    dw 'Loathing'
    dw 'Mire'
    dw 'Mist'
    dw 'Needles'
    dw 'Pain'
    dw 'Pandemonium'
    dw 'Pine'
    dw 'Rage'
    dw 'Rapture'
    dw 'Sand'
    dw 'Sorrow'
    dw 'the Apocalypse'
    dw 'the Beast'
    dw 'the Behemoth'
    dw 'the Brood'
    dw 'the Fox'
    dw 'the Gale'
    dw 'the Golem'
    dw 'the Kraken'
    dw 'the Leech'
    dw 'the Moon'
    dw 'the Phoenix'
    dw 'the Plague'
    dw 'the Root'
    dw 'the Song'
    dw 'the Stars'
    dw 'the Storm'
    dw 'the Sun'
    dw 'the Tear'
    dw 'the Titans'
    dw 'the Twins'
    dw 'the Willows'
    dw 'the Wisp'
    dw 'the Viper'
    dw 'the Vortex'
    dw 'Torment'
    dw 'Vengeance'
    dw 'Victory'
    dw 'Woe'
    dw 'Wisdom'
    dw 'Wrath'
end

func get_unique(idx : felt) -> (unique : felt):
    let (l) = get_label_location(unique)
    let arr = cast(l, felt*)
    return (arr[idx])

    # because short string literals in Cairo cannot
    # contain a ' character, these strings are already
    # "felt-encoded"
    unique:
    # 'Armageddon'
    dw 12149035928800249776654216743
    # 'Mind's Eye'
    dw 12163500555982197057843193127
    # 'Nostromo'
    dw 185619169760260884623143
    # 'Oblivion'
    dw 185636677773209715568167
    # 'The Chasm'
    dw 47546711497813566480936231
    # 'The Crypt'
    dw 47546711497813609833067559
    # 'The Depths'
    dw 12171958143440551260002480935
    # 'The End'
    dw 725505241360714589223
    # 'The Expanse'
    dw 3116021284720858528097726850343
    # 'The Gale'
    dw 185729341788351307212071
    # 'The Hook'
    dw 185729341788355837258535
    # 'The Maelstrom'
    dw 204211570915503538364630081108667687
    # 'The Mouth'
    dw 47546711497824591997593639
    # 'The Muck'
    dw 185729341788377411971879
    # 'The Shelf'
    dw 47546711497831158733628967
    # 'The Vale'
    dw 185729341788415731721511
    # 'The Veldt'
    dw 47546711497834444500530215
end

func get_people(idx : felt) -> (people : felt):
    let (l) = get_label_location(people)
    let arr = cast(l, felt*)
    return (arr[idx])

    # because short string literals in Cairo cannot
    # contain a ' character, these strings are already
    # "felt-encoded"
    people:
    # Fate's
    dw 77384378558323
    # Fohd's
    dw 77444306708339
    # Gremp's
    dw 20110503299786611
    # Hate's
    dw 79583401813875
    # Kali's
    dw 82881802741619
    # Kiv's
    dw 323891898227
    # Light's
    dw 21507991085000563
    # Shub's
    dw 91708111071091
    # Sol's
    dw 358351644531
    # Tish's
    dw 92811884504947
    # Viper's
    dw 24322779456350067
    # Woe's
    dw 375531054963
end

@view
func get_environment{range_check_ptr, bitwise_ptr : BitwiseBuiltin*}(seed : Uint256) -> (
        environment : felt):
    alloc_locals

    let min = Uint256(low=0, high=0)
    let max = Uint256(low=100, high=0)
    let (rand) = random(seed, min, max)

    # rand is bound to 100, we can only use "low"
    let (stone_temple) = is_in_range(rand.low, 70, 100)
    if stone_temple == 1:
        return (0)
    end

    let (mountain_deep) = is_in_range(rand.low, 45, 70)
    if mountain_deep == 1:
        return (1)
    end

    let (desert_oasis) = is_in_range(rand.low, 25, 45)
    if desert_oasis == 1:
        return (2)
    end

    let (forest_ruins) = is_in_range(rand.low, 13, 25)
    if forest_ruins == 1:
        return (3)
    end

    let (underwater_keep) = is_in_range(rand.low, 4, 13)
    if underwater_keep == 1:
        return (4)
    end

    return (5)  # ember's glow
end

@view
func get_name{range_check_ptr, bitwise_ptr : BitwiseBuiltin*}(seed : Uint256) -> (
        legendary : felt, affinity : felt, out_len : felt, out : felt*):
    alloc_locals
    let (unique_seed) = random_seed_shift_min_max(seed, 15, 0, 10000)
    let (base_seed) = random_seed_shift_min_max(seed, 16, 0, 38)

    let (is_unique) = is_le(unique_seed, 16)
    if is_unique == 1:
        let (unique) = get_unique(unique_seed)

        let r : felt* = alloc()
        assert r[0] = unique
        return (1, 'none', 1, r)
    end

    let (person_and_base) = is_le(unique_seed, 300)
    if person_and_base == 1:
        let (people_idx) = random_seed_shift_min_max(seed, 23, 0, 12)
        let (p) = get_people(people_idx)
        let (l) = get_land(base_seed)
        let r : felt* = alloc()

        assert r[0] = p
        assert r[1] = ' '
        assert r[2] = l
        return (0, 'none', 3, r)
    end

    let (prefix_baseland_suffix) = is_le(unique_seed, 1800)
    if prefix_baseland_suffix == 1:
        let (people_idx) = random_seed_shift_min_max(seed, 42, 0, 29)
        let (p) = get_people(people_idx)
        let (l) = get_land(base_seed)
        let (aff_idx) = random_seed_shift_min_max(seed, 27, 0, 59)
        let (a) = get_suffix(aff_idx)

        let r : felt* = alloc()
        assert r[0] = p
        assert r[1] = ' '
        assert r[2] = l
        assert r[3] = ' of '
        assert r[4] = a
        return (0, a, 5, r)
    end

    let (baseland_suffix) = is_le(unique_seed, 4000)
    if baseland_suffix == 1:
        let (l) = get_land(base_seed)
        let (aff_idx) = random_seed_shift_min_max(seed, 51, 0, 59)
        let (a) = get_suffix(aff_idx)

        let r : felt* = alloc()
        assert r[0] = l
        assert r[1] = ' of '
        assert r[2] = a
        return (0, a, 3, r)
    end

    let (prefix_baseland) = is_le(unique_seed, 6500)
    if prefix_baseland == 1:
        let (prefix_idx) = random_seed_shift_min_max(seed, 59, 0, 29)
        let (p) = get_prefix(prefix_idx)
        let (l) = get_land(base_seed)

        let r : felt* = alloc()
        assert r[0] = p
        assert r[1] = ' '
        assert r[2] = l
        return (0, 'none', 3, r)
    else:
        let (l) = get_land(base_seed)

        let r : felt* = alloc()
        assert r[0] = l
        return (0, 'none', 1, r)
    end
end

func random_seed_shift_min_max{range_check_ptr, bitwise_ptr : BitwiseBuiltin*}(
        seed : Uint256, shift : felt, min : felt, max : felt) -> (low : felt):
    let (shifted_seed) = uint256_shl(seed, Uint256(low=shift, high=0))
    let min_t = Uint256(low=min, high=0)
    let max_t = Uint256(low=max, high=0)
    let (rnd) = random(shifted_seed, min_t, max_t)
    return (rnd.low)
end

func hash_uint256{range_check_ptr, bitwise_ptr : BitwiseBuiltin*}(input : Uint256) -> (
        out : Uint256):
    alloc_locals

    # TODO: use temps?
    # TODO: test
    # TODO: document why / how it works
    let (t0) = bitwise_and(input.high, TOP)
    let (w0, _) = unsigned_div_rem(t0, BOTTOM)
    let (w1) = bitwise_and(input.high, BOTTOM)

    let (t2) = bitwise_and(input.low, TOP)
    let (w2, _) = unsigned_div_rem(t2, BOTTOM)
    let (w3) = bitwise_and(input.low, BOTTOM)

    let word : felt* = alloc()
    assert word[0] = w0
    assert word[1] = w1
    assert word[2] = w2
    assert word[3] = w3

    let (keccak_ptr : felt*) = alloc()
    let (hash) = keccak256{keccak_ptr=keccak_ptr}(word, 32)

    let (p0) = swap_endianness_64(hash[0], 8)
    let (p1) = swap_endianness_64(hash[1], 8)
    let (p2) = swap_endianness_64(hash[2], 8)
    let (p3) = swap_endianness_64(hash[3], 8)

    # (p0 * (1 << 64)) + p1
    let high = (p0 * 0x10000000000000000) + p1
    # (p2 * (1 << 64)) + p3
    let low = (p2 * 0x10000000000000000) + p3

    let rnd : Uint256 = Uint256(low=low, high=high)
    return (rnd)
end

@view
func random{range_check_ptr, bitwise_ptr : BitwiseBuiltin*}(
        input : Uint256, min : Uint256, max : Uint256) -> (out : Uint256):
    alloc_locals

    let (out) = hash_uint256(input)
    let (m) = uint256_sub(max, min)
    let (_, r) = uint256_unsigned_div_rem(out, m)
    let (out, _) = uint256_add(r, min)

    return (out)
end
