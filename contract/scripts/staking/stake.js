/* Stake - Test Staking a dungeon and unstaking it

Useful for verifying that code is working properly or debugging a specific issue */

const hre = require("hardhat");
const ethers = hre.ethers;

const cncAddress = "0x86f7692569914B5060Ef39aAb99e62eC96A6Ed45" // Crypts and Caverns contract
const userAddress = "0x8A5a244B08678a7DE0605494fe4E76C552935d38"    // User to impersonate (with many crypts and caverns)

async function main() {
    
    const Dungeons = await ethers.getContractFactory("Dungeons");
    const dungeons = await Dungeons.attach(cncAddress);

    // Impersonate user and fund wallet
    await hre.network.provider.send("hardhat_setBalance", [
        userAddress,
        "0x11111111111111111111111",
    ]);
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddress],  // 13 loot
    });

    // A signer is required to call a 'payable' contract function
    const signer = await ethers.getSigner(userAddress)

    // Verify that you own a dungeon
    const id = 	3043;
    
    // Stake a dungeon
    const mine = await dungeons.ownerOf(id);
    console.log(mine);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
