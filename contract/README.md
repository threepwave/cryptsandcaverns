```
/*****************************************************
0000000                                        0000000
0001100  Crypts and Caverns                    0001100
0001100     9000 generative on-chain dungeons  0001100
0003300                                        0003300
*****************************************************/
```

For more information, visit [our website](https://threepwave.com/cryptsandcaverns) or [join the discord](https://discord.gg/yNgwTqbA) so we can build together 🤝

Notable Files:
`/contracts` - Solidity contracts plus the Loot contract for testing.
`/data/abi` - The abi (application binary interface) to each contract.
`/deploy` - Deployment scripts used to push the contract live.
`/test` - Test suite covering most use cases and edge cases in production.
`/utils` - Build scripts and other utilities to see what's going on.
`hardhat.config.js` - Build and deployment configuration 
`package.json` - Dependencies and '=build  scripts.

# Installation
1. Clone this repository
2. Install dependencies: `npm install`

## Usage
* Generate a random dungeon and output metadata (text): `npm run build`
* Generate a random dungeon and render an svg: `npm run render`
* Run the test suite used to verify everyhing works: `npm run test`

Example:

![Example Dungeons](https://github.com/threepwave/dungeons/raw/names/images/example-dungeons.png)

Official project website: https://threepwave.com/cryptsandcaverns/

Share ideas and build: https://discord.gg/yNgwTqbA

## Principles

1. This is a primitive. It is designed to play nicely with many other primitives.
2. Let the game developers/dungeon masters make as many important decisions as possible, for example..
  a. Monsters
  b. Visual style
  c. Spawn points
3. Expose everything via Solidity API (vs proprietary formats or focusing on the art)

## NFT Structure
A Dungeon NFT is made up of three parts:
1. ID (Number) - Each dungeon has a unique identifier (integer) numbered 1-10000.
2. Image (svg) - Each dungeon has a unique image representing its layout, rendered in pixel art.
3. Metadata - Each dungeon has metadata representing it which can be accessed from getters on the smart contract:
  a. id (int) - The ID of the dungeon
  c. dungeon (string) - A string representing walls, walkable floor, interactable objects (e.g. doors), and points of interest.
  d. environment (int) - An integer depicting an environment for the dungeon
  e. name (string) - The name of the dungeon

Developers can choose to ignore any of these. 

## Dungeon Structure

Dungeons are **always square** (e.g. 10x10) and can range from 6x6 -> 25x25.

Dungeons can be 'crypts' (rectangular rooms connected by hallways) or 'caverns' (sprawling organic shapes). Most dungeon areas are connected but some dungeons have small areas that are not connected (for secret rooms, etc).

![Rooms vs Caverns](https://github.com/threepwave/dungeons/raw/names/images/rooms-caverns.png)

Dungeons contain a list of 'tiles' which have different characteristics:
* Walls: Represented by '1'
* Floors: Represented by '0' in our layout (where players can walk)
* Points of interest: Represented by '1' in our Entities data structure
* Doors: Represented by '0' in our Entities data structure

Dungeons have a name (e.g. 'Den of the Twins') to give each one a sense of permanence. Some names will be repeated (e.g. 'Stony Field') but more rare names will be unique.

Dungeons have an environment that implies a theme. Our hope is that the environment combined with the name and shape can give each dungeon its own character. Environments are as follows:
* 0 - Desert Plateau
* 1 - Forest Ruins
* 2 - Underwater Keep
* 3 - Stone Temple
* 4 - Mountain Deep
* 5 - Ember's Glow

![Environments](https://github.com/threepwave/dungeons/raw/names/images/environments.png)

Developers can choose to ignore any of the above attributes and use whatever is useful.

All other attributes (e.g. monsters, spawn point, etc) to be defined by the developer.

## What could I build with this ?

We used a simple API (string with characters) so that developers who build on top of this can mirror that structure and add metadata on top of the dungeon. Your array could indicate where players can find water, where they can ride mounts, etc.

We kept dungeons incredibly simple so developers, dungeon masters, etc so it plays 
nicely with other components. We hope that people add Encounters, Monsters, Rewards, Traps, Locks, Environmental Art, Flying, Running, Walking... even full 2D and 3D environments!

We hope that incentives are built over time to reward people that hold dungeons (e.g. a proceeds of the rewards could go to the holders).

This is just the beginning.

## Usage

To start, look at the build scripts in `/contract/scripts` to get an idea of how to interact with the contract. You can run these using `npm run` commands in the `/contract/` folder to test them out.

I'll build out specific examples in the `/examples` folder shortly 

For more details, see **API - getDungeon()** below.

## API 

*Coming Soon*

# License

Dungeons are licensed under a CC-0 (Free use) license.

Everyone has read access to every dungeon. Therefore, dungeons can be used by anyone, in any app/game/context. However they want. 


# Troubleshooting

### VSCode Errors (with OpenZeppelin imports)

Add the following to your `settings.json` (cmd+shift+p->settings (json)) file:
````
    "solidity.packageDefaultDependenciesContractsDirectory": "",
    "solidity.packageDefaultDependenciesDirectory": "node_modules"
````

## How to verify on etherscan
1. install `@nomiclabs/hardhat-etherscan`
2. put your etherscan api key into hardhat.config.js
2. Run command: `npx hardhat verify --network <blah> <contract> <arguments (optional)>`

# Contract info

## Mainet
Loot Address: 0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7

Render Address: 0xf701F9cd49216FA6111Ba4c8d41227178592E9B4
Generator Address: 0x7c33284fe491A1212A99C0eDC499E282920a265c
Seeder Address: 0xD2806cCE4be35ae7B84a25D11B5c2F1a6deeEdcB
Dungeons Address: 0x86f7692569914B5060Ef39aAb99e62eC96A6Ed45


## Rinkeby
Fake Loot Rinkeby Address: 0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7

Render Address: 0x05b0eE327FcEe826021E91A239FE619CF946E558
Generator Address: 0xA0f363E26ca2ed2cBFD33F0Bc03766c5691eC86C
Seeder Address: 0x2F613ac4E88dcCD9f7b0fC9df7F23a0D25D8eF32
Dungeons Address: 0xFe6C93C510d9777245C45720cE4f42EA98e7b351


## Goerli
Render Address: 0xe791D0077ae1Eb8bD6e220B0ab50F045Be4b6729
Generator Address: 0xF096e5050800c43A1cC351dbeCA5Ea456456c9A9
Seeder Address: 0xcE318E819Fdf84d07e2F467dA98E2cC17a06b344
Dungeons Address: 0x55819665a67D84D5A9476B7Ee0310c205a70fE75


# Starknet / Cairo

Starknet is a Layer 2 that uses zkRollup technology to offer a low-gas, fast-transaction rollup built on top of ethereum. Transactions are batched and submitted to L1 over time.

Starknet uses the language 'Cairo' which is similar to Solidity but has its own quirks.

Starknet contracts end in `.cairo` and are housed in the `./contracts/starknet` folder.

## Installation
1. Install hardhat and dependencies: `npm install`
2. Install [starknet-devnet](https://github.com/Shard-Labs/starknet-devnet) local node: `pip install starknet-devnet`

## Build / Compile
We use [`hardhat-starknet`](https://github.com/Shard-Labs/starknet-hardhat-plugin) to build and compile our Cairo contracts. 
1. Run `npm run nodestarknet` in a terminal to start a local node. This will listen for queries.
2. Run `npm run buildstarknet` in another terminal to compile and run cairo contracts.

## Deploy 
??? *(Fill in when we get here)*

## Test
1. Run `npm run nodestarknet` in a terminal to start a local node. This will listen for queries.
2. Run `npm run teststarknet` in another terminal to compile and run tests.

