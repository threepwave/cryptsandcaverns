/* Gas - estimate how much gas our contract will take */
const hre = require("hardhat");
const ethers = hre.ethers;

const price = 0.1;  // Send 0.1 
const loot13 = "0x76fb2ebe429514ee4985a3ded3d9c6c34e963dad" // Owner of 13 loots incl 4837
const lootAddress = "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7"    // Loot contract on mainnet

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
    const claim = await dungeons.connect(signer).estimateGas.claim(4837, {value: ethToSend});
    console.log(`[write] Claim: ${claim.toString()}`);
    await dungeons.connect(signer).claim(4837, {value: ethToSend});
    const mint = await dungeons.connect(signer).estimateGas.mint({value: ethToSend});
    console.log(`[write] Mint: ${mint.toString()}`);

    console.log('--- GAS Report ---')

    let sizeGas = await dungeons.estimateGas.getSize(4837)  
    console.log(`[read] getSize: ${sizeGas.toString()}`);

    let layoutGas = await dungeons.estimateGas.getLayout(4837)
    console.log(`[read] getLayout: ${layoutGas.toString()}`);

    let svgGas = await dungeons.estimateGas.getSvg(4837)
    console.log(`[read] getSvg: ${svgGas.toString()}`);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
