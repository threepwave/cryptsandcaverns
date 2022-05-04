# AsciiArt - Outputs an ascii dungeon layout
# Python equivalent to asciiart.js

from etherscan import Etherscan
from web3 import Web3
from web3.auto import w3
from web3.auto.infura import w3
import os
import math

contract_address = "0x86f7692569914B5060Ef39aAb99e62eC96A6Ed45"
w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/9f420f93b67041a5866c27bcb1c30659')) # Infura endpoint
INFURA_API_KEY = "9f420f93b67041a5866c27bcb1c30659" # Infura api key
api_key = "ITB9PRB1FHNQWHQI8GXU5UU463D8G8KX92"# Etherscan api key
id = 8032 #Dungeon ID

eth = Etherscan(api_key)
abi = eth.get_contract_abi(contract_address)
Contract = w3.eth.contract(address=contract_address, abi=str(abi))

# Call contract functions
layout = Contract.functions.getLayout(id).call()
entities = Contract.functions.getEntities(id).call()
size = Contract.functions.getSize(id).call()
name  = Contract.functions.getName(id).call()

# Convert layout into binary
hex_layout = Web3.toHex(layout)
int_value = int(hex_layout, 16) # Convert to int
bin_value = bin(int_value)[2:] # Convert to binary
length = math.ceil(len(bin_value)/256) * 256
bins = bin_value.zfill(length) # Add padding at the start to be a full '256' or '512'

y = range(size)
x = range(size)

# Store dungeon in 2D array
dungeon = []

counter = 0
for i in y:
    row = []
    for i in x:
        bit = int(bins[counter])
        if bit == 1:
            row.append("  ")
        else:
            row.append('X ')
        counter +=1
    dungeon.append(row)

# Parse entities into array
entitylist = []
ent = len(entities[0])
e = range(ent)

if ent > 0:
    for i in e:
        entity = [entities[1][i], entities[0][i], entities[2][i]]
        entitylist.append(entity)

    for i in entitylist:
        # Place a point
        if i[2] == 0:
            dungeon[i[0]][i[1]] = "P "
        # Place a door
        elif i[2] == 1:
            dungeon[i[0]][i[1]] = "D "

def to_string(dungeon):
    # Returns a string representing the dungeon
    rowString = ""
    for i in y:
        for t in x:
            tile = dungeon[i][t]
            rowString += tile
        rowString += '\n'
    return(rowString)

print(f"#{id} {name}")
print(to_string(dungeon))
