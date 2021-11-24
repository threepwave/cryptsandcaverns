/* Build - outputs a svg of our build */
const fs = require('fs');
const hre = require("hardhat");
const ethers = hre.ethers;

const price = 0.1;  // Send 0.1 
const loot13 = "0x76fb2ebe429514ee4985a3ded3d9c6c34e963dad" // Owner of 13 loots incl 4837
// const lootAddress = "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7"    // Loot contract on mainnet

async function main() {

  /* Deploy fake loot contract */
  const Loot = await ethers.getContractFactory("contracts/fakeloot.sol:Loot");
  const loot = await Loot.deploy();
  await loot.deployed();

  const Render = await ethers.getContractFactory("dungeonsRender");
  const render = await Render.deploy();

  const Generator = await ethers.getContractFactory("dungeonsGenerator");
  const generator = await Generator.deploy();

  const Seeder = await ethers.getContractFactory("dungeonsSeeder");
  const seeder = await Seeder.deploy();

  const Dungeons = await ethers.getContractFactory("Dungeons");
  const dungeons = await Dungeons.deploy(loot.address, render.address, generator.address, seeder.address);
  await dungeons.deployed();

  // Impersonate user and fund wallet
  await hre.network.provider.send("hardhat_setBalance", [
    loot13,
    "0x11111111111111111111111",
  ]);
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [loot13],  // 13 loot
  });
  const ethToSend = ethers.utils.parseEther(price.toString());
  const signer = await ethers.getSigner(loot13)

  // 
  count = 100  // Change this to see less mints (max is 1000)
  for(let i = 1; i < count; i++) {
    const mint = await dungeons.connect(signer).mint({value: ethToSend});

    try {
      const svg = await dungeons.getSvg(8000 + i);
      console.log(`tmp${i}.svg`);
      fs.writeFileSync(`/tmp/tmp${i}.svg`, svg);
      
    } catch (err) {
      console.error(err);
    }
  }


  console.log('--- Job completed ---')

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });