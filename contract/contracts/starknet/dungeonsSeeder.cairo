%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bitwise import bitwise_and
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.math import unsigned_div_rem
from starkware.cairo.common.uint256 import (
    Uint256, uint256_add, uint256_sub, uint256_unsigned_div_rem)
from lib.keccak import keccak256
from lib.swap_endianness import swap_endianness_64

const TOP = 0xffffffffffffffff0000000000000000
const BOTTOM = 0xffffffffffffffff

@view
func hash_uint256{range_check_ptr, bitwise_ptr : BitwiseBuiltin*}(input : Uint256) -> (
        out : Uint256):
    alloc_locals

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
