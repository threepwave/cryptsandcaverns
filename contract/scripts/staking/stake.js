/* Stake - Test Staking a dungeon and unstaking it

Useful for verifying that code is working properly or debugging a specific issue */

const hre = require("hardhat");
const ethers = hre.ethers;

const cncAddress = "0x86f7692569914B5060Ef39aAb99e62eC96A6Ed45" // Crypts and Caverns contract
const userAddress = "0x8A5a244B08678a7DE0605494fe4E76C552935d38"    // User to impersonate (with many crypts and caverns)

const epoch = 1;

async function main() {
    
    const Dungeons = await ethers.getContractFactory("contracts/dungeons.sol:Dungeons");
    const dungeons = await Dungeons.attach(cncAddress);

    const Staker = await ethers.getContractFactory("contracts/dungeonsStaker.sol:DungeonsStaker")
    const staker = await Staker.deploy(epoch, cncAddress);

    const StakerProjects = await ethers.getContractFactory("DungeonsStakerProjects")
    const stakerprojects = await StakerProjects.deploy(staker.address);


    // Impersonate user and fund wallet
    await hre.network.provider.send("hardhat_setBalance", [
        userAddress,
        "0x11111111111111111111111",
    ]);
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddress],  // Owns many crypts and caverns
    });

    // A signer is required to call a 'payable' contract function
    const signer = await ethers.getSigner(userAddress)

    // Approve Dungeons tokens (just ask for single approval to save gas)
    await dungeons.connect(signer).setApprovalForAll(staker.address, true);

    // Stake dungeons
    const ids = [3043, 6];
    let numStaked, stakedIds;
    await staker.connect(signer).stake(ids);
    console.log('staking')
    numStaked = await staker.getNumStaked(userAddress);
    console.log(`Num staked: ${parseInt(numStaked)}`);
    stakedIds = await staker.getStakedIds(userAddress);
    let tmp = [];
    for(let i = 0; i < stakedIds.length; i++) {
      tmp.push(parseInt(stakedIds[i]));
      // console.log(parseInt(stakedIds[i]))
    }
    console.log(tmp);

    await staker.connect(signer).unstake(ids);
    console.log('unstake')
    numStaked = await staker.getNumStaked(userAddress);
    console.log(`Num unstaked: ${numStaked}`);
    stakedIds = await staker.getStakedIds(userAddress);
    console.log(stakedIds);



}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
