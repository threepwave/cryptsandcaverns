/*const { expect } = require("chai");
const { network, ethers } = require("hardhat");

let loot, Loot, Render, render, Generator, generator, Dungeons, dungeons, token;

const price = 0.05;  // Send 0.05 ETH
const loot13 = '0x76fb2EbE429514eE4985a3ded3D9c6c34E963DaD' // Test user we can impersonate

describe("Dungeons", function () {

    const EM_EXCEPTION = "VM Exception while processing transaction: reverted with reason string ";

    beforeEach(async function() {
        // Deploy Loot 
        Loot = await ethers.getContractFactory("contracts/loot.sol:Loot");
        loot = await Loot.deploy();
        await loot.deployed();

        Render = await ethers.getContractFactory("dungeonsRender");
        render = await Render.deploy();
    
        Generator = await ethers.getContractFactory("dungeonsGenerator");
        generator = await Generator.deploy();
    
        Seeder = await ethers.getContractFactory("dungeonsSeeder");
        seeder = await Seeder.deploy();
    
        Dungeons = await ethers.getContractFactory("Dungeons");
        dungeons = await Dungeons.deploy(loot.address, render.address, generator.address, seeder.address);
        await dungeons.deployed();
    
         // Fund Wallet
         await hre.network.provider.send("hardhat_setBalance", [
          loot13,
          "0x11111111111111111111111",
          ]);
        
          // Impersonate user
          await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [loot13],  // 13 loot
          });
      });
    describe('edge case tests', function() {

        
        describe('Mint Out 8001->9000', function() { 
            it('Enough ETH: Should be successful', async function() {   
                const ethToSend = ethers.utils.parseEther('0.05');
                const supplyBefore = BigInt(await dungeons.totalSupply()).toString();
                let numErrors = 0;

                const initialPrice = ethers.utils.formatEther(BigInt(await dungeons.price()));
                expect(initialPrice).to.equal('0.05');

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [loot13],  // 13 loot
                });

                // Mint 1000 (8001->9000)
                let count = 1000;
                const signer = await ethers.getSigner(loot13)
                try {
                    for(let i = 0; i < count; i++) {
                        await expect(dungeons.connect(signer).mint({value: ethToSend}))
                        .to.emit(dungeons, 'Minted')
                    }
                } catch(err) {
                    expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH sent\'")
                    expect(await dungeons.totalSupply()).to.equal(supplyBefore);
                    numErrors++;
                }
                // Make sure we minted up to 9000
                expect(numErrors).to.equal(0)
                let newSupply = Number(await dungeons.totalSupply())
                expect(newSupply).to.equal(Number(supplyBefore)+count);
                
                // Make sure the last token was minted correctly
                let finalOwner
                try {
                    finalOwner = await dungeons.ownerOf(9000)
                } catch (err) {
                    console.log(err)
                } 
                expect(finalOwner).to.equal(loot13) 

                // Make sure we get 'sold out'
                try {
                    await dungeons.connect(signer).mint({value: ethToSend})
                } catch(err) {
                    expect(err.message).to.equal(EM_EXCEPTION + "'Token sold out'")
                    numErrors++;
                }
                expect(numErrors).to.equal(1)
            }) 
        }) 

        
        describe('Claim Out 1->7777', function() { 
            it('Should not throw any errors', async function() {   
                this.timeout(1000000)
                const ethToSend = ethers.utils.parseEther('0.05');
                const supplyBefore = BigInt(await dungeons.totalSupply()).toString();
                let numErrors = 0;

                const initialPrice = ethers.utils.formatEther(BigInt(await dungeons.price()));
                expect(initialPrice).to.equal('0.05');

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [loot13], 
                });

                // Mint 7777 loot (1->7777)
                let count = 7777
                const signer = await ethers.getSigner(loot13)
                try {
                    for(let i = 1; i <= count; i++) {
                        const mint = await loot.connect(signer).claim(i);
                    }
                } catch(err) {
                    numErrors++;
                    console.log(err)
                }
                // Make sure we minted up to 9000
                expect(numErrors).to.equal(0)
                let newSupply = Number(await loot.totalSupply())
                expect(newSupply).to.equal(Number(supplyBefore)+count);

                // Claim 7777 dungeons (1->7777)
                count = 7777
                try {
                    for(let i = 1; i <= count; i++) {
                        const mint = await dungeons.connect(signer).claim(i, {value: ethToSend});
                    }
                } catch(err) {
                    numErrors++;
                    console.log(err)
                }
                // Make sure we minted up to 9000
                expect(numErrors).to.equal(0)
                newSupply = Number(await dungeons.totalSupply())
                expect(newSupply).to.equal(Number(supplyBefore)+count);
                
                // Make sure the first and last tokens were claimed properly
                let finalOwner1, finalOwner2
                try {
                    finalOwner1 = await dungeons.ownerOf(1)
                } catch (err) {
                    console.log(1);
                    console.log(err)
                } 

                try {
                    finalOwner2 = await dungeons.ownerOf(7777)
                } catch(err) {
                    console.log(7777);
                    console.log(err)
                }
                expect(finalOwner1).to.equal(loot13) 
                expect(finalOwner2).to.equal(loot13) 
            }) 
        }) 
        
        describe('Owner Claim Out 7778->8000', function() { 
            it('Enough ETH: Should be successful', async function() {   
                const ethToSend = ethers.utils.parseEther('0.05');
                const supplyBefore = BigInt(await dungeons.totalSupply()).toString();
                let numErrors = 0;

                const owner = await dungeons.owner();

                const initialPrice = ethers.utils.formatEther(BigInt(await dungeons.price()));
                expect(initialPrice).to.equal('0.05');

                // Mint 223 (7778->8000)
                let count = 223;
                const signer = await ethers.getSigner(owner)

                try {
                    for(let i = 7778; i <= 7777+count; i++) {
                        await expect(dungeons.connect(signer).ownerClaim(i))
                        .to.emit(dungeons, 'Claimed')
                    }
                } catch(err) {
                    expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH sent\'")
                    expect(await dungeons.totalSupply()).to.equal(supplyBefore);
                    numErrors++;
                }
                // Make sure we minted up to 9000
                expect(numErrors).to.equal(0)
                let newSupply = Number(await dungeons.totalSupply())
                expect(newSupply).to.equal(Number(supplyBefore)+count);
                
                // Make sure the last token was minted correctly
                let finalOwner1
                let finalOwner2
                try {
                    finalOwner1 = await dungeons.ownerOf(7778)
                    finalOwner2 = await dungeons.ownerOf(8000)
                } catch (err) {
                    console.log(err)
                } 
                expect(finalOwner1).to.equal(owner) 
                expect(finalOwner2).to.equal(owner) 

                expect(numErrors).to.equal(0)
            }) 
        }) 
    })
})*/