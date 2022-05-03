
const { ContractType } = require('hardhat/internal/hardhat-network/stack-traces/model');
const { ethers } = require("hardhat");

// const lootAbi = require('../data/abi/loot.json');

// Script to deploy our contract

// const lootAddress = '0xf701F9cd49216FA6111Ba4c8d41227178592E9B4';    // Rinkeby fake loot address
const lootAddress = '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7';   // Mainnet address

module.exports = async (hre) => {
    const ownerAddress = '0x9086F5017be8792458cBd61E24AB364EE60FFa9C';

    const signer = await hre.ethers.getSigner(ownerAddress);

    console.log(`Loot Address: ${lootAddress}`);

    // const Render = await ethers.getContractFactory("dungeonsRender", signer);
    // const render = await Render.connect(signer).deploy();
    // await render.deployed();
    // let render = {};
    // render.address = '0xf701F9cd49216FA6111Ba4c8d41227178592E9B4';
    // console.log(`Render Address: ${render.address}`)

    // let generator = {};
    // generator.address = '0x7c33284fe491A1212A99C0eDC499E282920a265c';
    // console.log(`Generator Address: ${generator.address}`)

    // let seeder = {};
    // seeder.address = '0xD2806cCE4be35ae7B84a25D11B5c2F1a6deeEdcB';
    // console.log(`Seeder Address: ${seeder.address}`)

    try {
        console.log('Render Factory');
        const Render = await ethers.getContractFactory("dungeonsRender", signer);
        console.log('Render Deploy starting');
        const render = await Render.connect(signer).deploy();
        console.log('Render Deploy kicked off, waiting for deployed()');
        await render.deployed();
        console.log(`Render Address: ${render.address}`)

        console.log('Generator Factory');
        const Generator = await ethers.getContractFactory("dungeonsGenerator", signer);
        console.log('Generator Deploy starting');
        const generator = await Generator.connect(signer).deploy();
        console.log('Generator Deploy kicked off, waiting for deployed()');
        await generator.deployed();
        console.log(`Generator Address: ${generator.address}`)
    
        console.log('Seeder Factory')
        const Seeder = await ethers.getContractFactory("dungeonsSeeder", signer);
        console.log('Seeder Deploy starting')
        const seeder = await Seeder.connect(signer).deploy();
        console.log('Seeder Deploy kicked off, waiting for deployed()')
        await seeder.deployed();
        console.log(`Seeder Address: ${seeder.address}`) 
    
        console.log('Dungeons Factory')
        const Dungeons = await ethers.getContractFactory("Dungeons", signer);
        console.log('Dungeons Deploy starting')
        const dungeons = await Dungeons.connect(signer).deploy(lootAddress, render.address, generator.address, seeder.address);
        console.log('Dungeons Deploy kicked off, waiting for deployed()')
        await dungeons.deployed();    

        console.log('Deployment from: ', signer.address);
        console.log(`Dungeons Contract Address: ${dungeons.address}`)  
    } catch (err) {
        console.log(err);
    }

}