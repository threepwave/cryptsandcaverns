/* Build - outputs basic metadata of a single dungeon.

Useful for verifying that code is working properly or debugging a specific issue */

const hre = require("hardhat");
const ethers = hre.ethers;

const price = 0.05;  // Send 0.05
const loot13 = "0x76fb2ebe429514ee4985a3ded3d9c6c34e963dad" // Picked a random owner of 13 loots incl 4837
const lootAddress = "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7"    // Loot contract on mainnet
const id = 4837;    // Pick a random loot that the wallet holds to claim

async function main() {
    
    const Render = await ethers.getContractFactory("dungeonsRender");
    const render = await Render.deploy();

    const Generator = await ethers.getContractFactory("dungeonsGenerator");
    const generator = await Generator.deploy();

    const Seeder = await ethers.getContractFactory("dungeonsSeeder");
    const seeder = await Seeder.deploy();

    const Dungeons = await ethers.getContractFactory("Dungeons");
    const dungeons = await Dungeons.deploy(lootAddress, render.address, generator.address, seeder.address);
    await dungeons.deployed();

    // Impersonate user and fund wallet
    const ethToSend = ethers.utils.parseEther(price.toString());

    await hre.network.provider.send("hardhat_setBalance", [
        loot13,
        "0x11111111111111111111111",
    ]);
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [loot13],  // 13 loot
    });

    // A signer is required to call a 'payable' contract function
    const signer = await ethers.getSigner(loot13)

    // Claim a dungeon and pull metadata
    const mint = await dungeons.connect(signer).claim(id, {value: ethToSend});
    const size = await dungeons.getSize(id)
    const layout = await dungeons.getLayout(id) 
    const entities = await dungeons.functions.getEntities(id) 
    const name = await dungeons.getName(id)

    // Parse Layout into binary 
    layoutInt = BigInt(layout)              // Process uint256 -> javascript readable int
    let bits = layoutInt.toString(2);       // Convert BigInt to binary)
    let length = Math.ceil(bits.length / 256)*256;  // Bits are stored in chunks of 256. Figure out how many chunks we have.
    bits = bits.padStart(length, '0');              // Add padding at the start to be a full '256' or '512'

    // Store dungeon in 2D array
    dungeon = []; 

    let counter = 0;
    for(let y = 0; y < size; y++) {
        let row = []
        for(let x = 0; x < size; x++) {
            const bit = bits[counter] == 1 ? ' ' : 'X';
            row.push(bit)
            counter++;
        }
        dungeon.push(row)
    }  

	// // Parse entities into array 
	let entityList = []

	if(entities[0].length > 0) {	// Make sure we have entities to parse
		for(let i = 0; i < entities[0].length; i++) {
			let entity = {
				x: entities[0][i],
				y: entities[1][i],
				entityType: entities[2][i]
			}

			entityList.push(entity)

			// Update dungeon with our entity
			if(entity.entityType == 1) {
				// Place a door
				dungeon[entity.y][entity.x] = 'p'
			} else if(entity.entityType == 0) {
				// Place a point of interest
				dungeon[entity.y][entity.x] = 'D'
			}
		}
	}
    
    console.log(`${name} (${id})`)
    console.log(toString(dungeon));
}

function toString(dungeon) {
  // Returns a string representing the dungeon
  let rowString = ""

  for(let y = 0; y < dungeon.length; y++) {
      for(let x = 0; x < dungeon.length; x++) {
          const tile = dungeon[y][x]
          rowString += `${tile} `
      }
      rowString += '\n'
  }
  return(rowString)
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
