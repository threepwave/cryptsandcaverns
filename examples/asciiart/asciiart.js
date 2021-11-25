/* AsciiArt - Outputs an ascii dungeon layout */
const hre = require("hardhat");
const ethers = hre.ethers;

const id = 8032;    // Change this to your dungeon ID

const dungeonsAddress = "0x86f7692569914B5060Ef39aAb99e62eC96A6Ed45"

// Formatting for console output 
const cyanStart = '\x1b[36m\x1b[1m'
const cyanEnd = '\x1b[22m\x1b[0m'
const magentaStart = '\x1b[35m\x1b[1m'
const magentaEnd = '\x1b[22m\x1b[0m'

async function main() {

    const Dungeons = await ethers.getContractFactory('Dungeons');
    const dungeons = await Dungeons.attach(dungeonsAddress);

    const name = await dungeons.getName(id);
    const layout = await dungeons.getLayout(id);
    const size = await dungeons.getSize(id);
    const entities = await dungeons.getEntities(id);

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

	// Parse entities into array 
	let entityList = []

    // Make sure we have entities to parse
	if(entities[0].length > 0) {	
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
                dungeon[entity.y][entity.x] = `${magentaStart}p${magentaEnd}`
            } else if(entity.entityType == 0) {
                // Place a point of interest
                dungeon[entity.y][entity.x] = `${cyanStart}D${cyanEnd}`
            } 
		}
	}
    
    console.log(`#${id} ${name}`);
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
