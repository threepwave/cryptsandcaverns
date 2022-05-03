const { ContractType } = require('hardhat/internal/hardhat-network/stack-traces/model');
const { ethers } = require("hardhat");

const lootAbi = require('../data/abi/loot.json');
// Script to deploy our fake loot / testing contract to Rinkeby

module.exports = async (hre) => {
/*    const ownerAddress = '0x34734543e8a2505224a7b4Ad42Ac89AD88FEf39A';
    
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const signer = await hre.ethers.getSigner(ownerAddress);

    const Loot = await ethers.getContractFactory("contracts/loot.sol:Loot", signer);
    const loot = await Loot.connect(signer).deploy();
    await loot.deployed();
    console.log('Deployment from: ', signer.address);
    console.log(`Loot Contract Address: ${loot.address}`) */
} 