/* get-images - Downloads images for a set of dungeons and saves them as svg and png */

const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require('fs');
const sharp = require('sharp');

const dungeonsAddress = "0x86f7692569914B5060Ef39aAb99e62eC96A6Ed45"

async function main() {

    const Dungeons = await ethers.getContractFactory('Dungeons');
    const dungeons = await Dungeons.attach(dungeonsAddress);

    // Start and end token ID's
    const id = {
      start: 1,
      end: 100  // Change this if you want more images
    }

    const folder = './get-images/cache'

    for(let i = id.start; i <= id.end; i++) {
      try {
        let filename = `${folder}/${i}`
        if(!fs.existsSync(`${filename}.png`)) {
          const svg = await dungeons.getSvg(i);
          fs.writeFileSync(`${filename}.svg`, svg);
          const png = await sharp(Buffer.from(svg)).resize(1000).png().toBuffer().then((data) => {
            return(data)
          })
          fs.writeFileSync(`${filename}.png`, png);
        } else {
          console.log(`Skipping ${i}`)
        }
      } catch(err) {
        console.log(`Failed to render: ${i}`)
        // console.log(err);
      }
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
