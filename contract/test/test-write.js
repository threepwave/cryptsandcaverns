const { expect } = require("chai");
const { network, ethers } = require("hardhat");

let Render, render, Generator, generator, Dungeons, dungeons, token;

const loot13 = '0x76fb2EbE429514eE4985a3ded3D9c6c34E963DaD' // Owner of 13 loots incl 4837
const price = 0.05;  // Send 0.05 ETH
const lootContract = '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7';

describe("Dungeons", function () {

    const EM_EXCEPTION = "VM Exception while processing transaction: reverted with reason string ";

    beforeEach(async function() {
        Render = await ethers.getContractFactory("dungeonsRender");
        render = await Render.deploy();
    
        Generator = await ethers.getContractFactory("dungeonsGenerator");
        generator = await Generator.deploy();

        Seeder = await ethers.getContractFactory("dungeonsSeeder");
        seeder = await Seeder.deploy();
    
    
        Dungeons = await ethers.getContractFactory("Dungeons");
        dungeons = await Dungeons.deploy(lootContract, render.address, generator.address, seeder.address);
        token = await dungeons.deployed();

        await network.provider.send("hardhat_setBalance", [
            loot13,
            "0x1000000000000000000000000000000000",
          ]);


    });

    describe('Write', function() {
        describe('claim()', function() {
            describe('Non-Loot Owner', function() {
                it('Enough ETH: should throw error', async function() {
                    const ethToSend = ethers.utils.parseEther(price.toString());
                    try {
                        const tmp = await dungeons.claim(4837, {value: ethToSend})
                    } catch(err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                })    
                it('Not enough ETH: should throw error', async function() {
                    const ethToSend = ethers.utils.parseEther('0.01');
                    try {
                        const tmp = await dungeons.claim(4837, {value: ethToSend})
                    } catch(err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                })  
                it('Enough ETH: claim if not restricted', async function() {
                    const ethToSend = ethers.utils.parseEther(price.toString());
                    
                    let numErrors = 0;
                    try {
                        await dungeons.openClaim(); // Toggle open claim
                    } catch (err) {
                        console.log(err)
                        numErrors++;
                    }

                    try {
                        const tmp = await dungeons.claim(4837, {value: ethToSend})
                    } catch(err) {
                        numErrors++
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                    expect(numErrors).to.be.equal(0);
                    const account = await dungeons.ownerOf(4837)
                    await expect(account).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                })  
            })

            describe('Loot Owner', function() {
                it('Not enough ETH: should throw error', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const ethToSend = ethers.utils.parseEther('0.01');

                    try {
                        const signer = await ethers.getSigner(loot13)
                        const tmp = await dungeons.connect(signer).claim(4837, {value: ethToSend});
                    } catch(err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH'")
                    }
                }) 

                it('claiming their piece: should be successful', async function() {   
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const ethToSend = ethers.utils.parseEther(price.toString());    
                    
                    const signer = await ethers.getSigner(loot13)
                    expect(await dungeons.connect(signer).claim(4837, {value: ethToSend}))
                        .to.emit(dungeons, 'Claimed')
                        .withArgs(loot13, '4837');
                        
                    const owner = await dungeons.ownerOf(4837);
                    expect(owner).to.equal(signer.address); // Verify that user owns the token
                })

                it('claiming someone elses piece: should fail', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
                    
                    const ethToSend = ethers.utils.parseEther(price.toString());    

                    const signer = await ethers.getSigner(loot13)

                    try {
                        const tmp = await dungeons.connect(signer).claim(1, {value: ethToSend});
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                })

                it('claim their piece again: should fail', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const ethToSend = ethers.utils.parseEther(price.toString());    
                    
                    const signer = await ethers.getSigner(loot13)

                    try {
                        await dungeons.connect(signer).claim(4837, {value: ethToSend});
                        await dungeons.connect(signer).claim(4837, {value: ethToSend});
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'ERC721: token already minted'")
                    }
                })

                it('minting out of range: should fail', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const ethToSend = ethers.utils.parseEther(price.toString());    
                    
                    const signer = await ethers.getSigner(loot13)

                    try {
                        await dungeons.connect(signer).claim(0);
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Token ID invalid'")
                    }

                    try {
                        await dungeons.connect(signer).claim(8100, {value: ethToSend});
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Token ID invalid'")
                    }
                })
                it('Enough ETH: claim if not restricted', async function() {
                    const ethToSend = ethers.utils.parseEther(price.toString());
                    
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const signer = await ethers.getSigner(loot13)

                    let numErrors = 0;
                    try {
                        await dungeons.openClaim(); // Toggle open claim
                    } catch (err) {
                        console.log(err)
                        numErrors++;
                    }

                    try {
                        const tmp = await dungeons.connect(signer).claim(4837, {value: ethToSend})
                    } catch(err) {
                        numErrors++
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                    expect(numErrors).to.be.equal(0);
                    const account = await dungeons.ownerOf(4837)
                    await expect(account).to.equal(loot13)
                })  
            })
        })

        describe('claimMany()', function() {
            describe('Non-Loot Owner', function() {
                it('should throw error', async function() {
                    const ethToSend = ethers.utils.parseEther(price.toString());    

                    let count = 0;
                    try {
                        const tmp = await dungeons.claimMany([4837, 2051, 31], {value: ethToSend});
                    } catch(err) {
                        count++;
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                    expect(count).to.be.equal(1);
                })

                it('Loot owner of some: should fail on items they dont own', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
    
                    const ethToSend = ethers.utils.parseEther((price * 3).toString());    
    
                    const signer = await ethers.getSigner(loot13)
    
                    let count = 0;
                    try {
                        await expect(dungeons.connect(signer).claimMany([4837, 2, 1288], {value: ethToSend}))
                        .to.emit(dungeons, 'Claimed')
                        .withArgs(loot13, '1288');
                    } catch(err) {
                        count++;
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                    expect(count).to.be.equal(1);
                })

                it('Not enough ETH: claim if not restricted should fail', async function() {
                    const ethToSend = ethers.utils.parseEther((price).toString());
                    
                    let numErrors = 0;
                    try {
                        await dungeons.openClaim(); // Toggle open claim
                    } catch (err) {
                        numErrors++;
                        expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH'")
                    }

                    try {
                        await dungeons.claimMany([4837, 2, 1288], {value: ethToSend})
                    } catch(err) {
                        numErrors++
                        expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH'")
                    }
                    expect(numErrors).to.be.equal(1);

                    try {
                        const account = await dungeons.ownerOf(4837)
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'ERC721: owner query for nonexistent token'")
                    } 
                })  
                it('Enough ETH: claim if not restricted', async function() {
                    const ethToSend = ethers.utils.parseEther((price*3).toString());
                    
                    let numErrors = 0;
                    try {
                        await dungeons.openClaim(); // Toggle open claim
                    } catch (err) {
                        console.log(err)
                        numErrors++;
                    }

                    try {
                        await expect(dungeons.claimMany([4837, 2, 1288], {value: ethToSend}))
                    } catch(err) {
                        numErrors++
                        console.log(err)
                        expect(err.message).to.equal(EM_EXCEPTION + "'Error: Not enough eth sent'")
                    }
                    expect(numErrors).to.be.equal(0);
                    const account = await dungeons.ownerOf(4837)
                    await expect(account).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                })  
            })
            describe('Loot Owner', function() {
                it('not enough eth minting once should fail', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
    
                    const ethToSend = ethers.utils.parseEther(price.toString());    
    
                    const signer = await ethers.getSigner(loot13)
    
                    let count = 0;
                    try {
                        const tmp = await dungeons.connect(signer).claimMany([4837, 414, 1288], {value: ethToSend});
                    } catch(err) {
                        count++;
                        expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH'")
                    }
                    expect(count).to.be.equal(1);
                })
                it('sufficient eth minting once should succeed', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
    
                    const ethToSend = ethers.utils.parseEther((price * 3).toString());    
    
                    const signer = await ethers.getSigner(loot13)
    
                    let count = 0;
                    try {
                        await expect(dungeons.connect(signer).claimMany([4837, 414, 1288], {value: ethToSend}))
                        .to.emit(dungeons, 'Claimed')
                        .withArgs(loot13, '4837');
                    } catch(err) {
                        count++;
                        console.log(err.message);
                        expect(err.message).to.not.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                    expect(count).to.be.equal(0);
    
                    let owner = await dungeons.ownerOf(4837);
                    expect(owner).to.equal(signer.address); // Verify that user owns the token
                    owner = await dungeons.ownerOf(414);
                    expect(owner).to.equal(signer.address);
                    owner = await dungeons.ownerOf(1288);
                    expect(owner).to.equal(signer.address);
                })               
                
                it('minting all again: should fail', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
    
                    const ethToSend = ethers.utils.parseEther((price * 3).toString()); 
    
                    const signer = await ethers.getSigner(loot13)
    
                    let count = 0;
                    try {
                        const tmp = await dungeons.connect(signer).claimMany([4837, 414, 1288], {value: ethToSend});
                    } catch(err) {
                        count++;
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                    expect(count).to.be.equal(0);
    
                    try {
                        const tmp = await dungeons.connect(signer).claimMany([4837, 414, 1288], {value: ethToSend});
                    } catch(err) {
                        count++;
                        expect(err.message).to.equal(EM_EXCEPTION + "'ERC721: token already minted'")
                    }
                    expect(count).to.be.equal(1);
                })
    
                it('Loot owner claiming some again, some for first time: should fail if not restricted', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
    
                    const ethToSend = ethers.utils.parseEther((price * 3).toString());    
    
                    const signer = await ethers.getSigner(loot13)
    
                    let count = 0;
                    try {
                        const tmp = await dungeons.connect(signer).claimMany([4837, 1288], {value: ethToSend});
                    } catch(err) {
                        count++;
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                    expect(count).to.be.equal(0);
    
                    try {
                        const tmp = await dungeons.connect(signer).claimMany([4837, 414, 1288], {value: ethToSend});
                    } catch(err) {
                        count++;
                        expect(err.message).to.equal(EM_EXCEPTION + "'ERC721: token already minted'")
                    }
                    expect(count).to.be.equal(1);
                })

                it('sufficient eth minting once should succeed if not restricted', async function() {
                    let numErrors = 0;
                    try {
                        await dungeons.openClaim(); // Toggle open claim
                    } catch (err) {
                        console.log(err)
                        numErrors++;
                    }

                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
    
                    const ethToSend = ethers.utils.parseEther((price * 3).toString());    
    
                    const signer = await ethers.getSigner(loot13)
    
                    let count = 0;
                    try {
                        await expect(dungeons.connect(signer).claimMany([4837, 414, 1288], {value: ethToSend}))
                        .to.emit(dungeons, 'Claimed')
                        .withArgs(loot13, '4837');
                    } catch(err) {
                        count++;
                        console.log(err.message);
                        expect(err.message).to.not.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                    expect(count).to.be.equal(0);
    
                    let owner = await dungeons.ownerOf(4837);
                    expect(owner).to.equal(signer.address); // Verify that user owns the token
                    owner = await dungeons.ownerOf(414);
                    expect(owner).to.equal(signer.address);
                    owner = await dungeons.ownerOf(1288);
                    expect(owner).to.equal(signer.address);
                })     
            })
        });

        describe('ownerClaim()', function() {
            describe('Contract Owner', function() {
                it('Valid Token id: Should succeed', async function() {
                    const owner = await dungeons.owner();
                    expect(owner).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                    
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [owner],  // Owner of contract
                    });
                    
                    const ethToSend = ethers.utils.parseEther(price.toString());
                    const signer = await ethers.getSigner(owner)

                    const supply = await dungeons.totalSupply();
                    expect(Number(supply)).to.equal(0);

                    let numErrors = 0;
                    try {
                        await expect(dungeons.connect(signer).ownerClaim(7999, {value: ethToSend}))
                        .to.emit(dungeons, 'Claimed')
                        .withArgs(owner, '7999');
                    } catch(err) {
                        expect(err.message.startsWith("sender doesn't have enough funds to send tx. The max upfront cost is: 6132240785563629968")).to.be.true;
                        numErrors++;
                    }
                    expect(numErrors).to.equal(0);
                    const newSupply = await dungeons.totalSupply();
                    expect(Number(newSupply)).to.equal(1);
                });
                it('Invalid TokenId: Should throw error', async function() {
                    const owner = await dungeons.owner();
                    expect(owner).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                    
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [owner],  // Owner of contract
                    });
                    
                    const ethToSend = ethers.utils.parseEther(price.toString());
                    const signer = await ethers.getSigner(owner)

                    const supply = await dungeons.totalSupply();
                    expect(Number(supply)).to.equal(0);

                    let numErrors = 0;
                    try {
                        const tmp = await dungeons.connect(signer).ownerClaim(8010, {value: ethToSend})
                    } catch(err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Token ID invalid'")
                        numErrors++;
                    }
                    expect(numErrors).to.equal(1);
                    const newSupply = await dungeons.totalSupply();
                    expect(Number(newSupply)).to.equal(0);
                });
                it('Already Claimed tokenId: Should throw error', async function() {
                    const owner = await dungeons.owner();
                    expect(owner).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                    
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [owner],  // Owner of contract
                    });
                    
                    const ethToSend = ethers.utils.parseEther(price.toString());
                    const signer = await ethers.getSigner(owner)

                    const supply = await dungeons.totalSupply();
                    expect(Number(supply)).to.equal(0);

                    let numErrors = 0;
                    try {
                        await dungeons.connect(signer).ownerClaim(7999, {value: ethToSend})
                        await dungeons.connect(signer).ownerClaim(7999, {value: ethToSend})
                    } catch(err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'ERC721: token already minted'")
                        numErrors++;
                    }
                    expect(numErrors).to.equal(1);
                    const newSupply = await dungeons.totalSupply();
                    expect(newSupply.toString()).to.equal('1');
                });
            }) 
            describe('Non-Contract Owner', function() { 
                it('Valid tokenId / Enough ETH: should throw error', async function() {
                    const owner = await dungeons.owner();
                    expect(owner).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                    
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
                    
                    const ethToSend = ethers.utils.parseEther(price.toString());
                    const signer = await ethers.getSigner(loot13)

                    let numErrors = 0;
                    try {
                        const tmp = await dungeons.connect(signer).ownerClaim(7999, {value: ethToSend})
                    } catch(err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Ownable: caller is not the owner'");
                        numErrors++;
                    }
                    expect(numErrors).to.equal(1);

                })

                it('Invalid tokenId / Enough ETH: should throw error', async function() {
                    const owner = await dungeons.owner();
                    expect(owner).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                    
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
                    
                    const ethToSend = ethers.utils.parseEther(price.toString());
                    const signer = await ethers.getSigner(loot13)

                    let numErrors = 0;
                    try {
                        const tmp = await dungeons.connect(signer).ownerClaim(8020, {value: ethToSend})
                    } catch(err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Ownable: caller is not the owner'")
                        numErrors++;
                    }
                    expect(numErrors).to.equal(1);

                })                  
            })

            describe('Loot Owner', function() {
                it('Not enough ETH: should throw error', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const ethToSend = ethers.utils.parseEther('0.01');

                    try {
                        const signer = await ethers.getSigner(loot13)
                        const tmp = await dungeons.connect(signer).claim(4837, {value: ethToSend});
                    } catch(err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH'")
                    }
                }) 

                it('claiming their piece: should be successful', async function() {   
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const ethToSend = ethers.utils.parseEther(price.toString());    
                    
                    const signer = await ethers.getSigner(loot13)
                    const tmp = await dungeons.connect(signer).claim(4837, {value: ethToSend});
                    const owner = await dungeons.ownerOf(4837);
                    expect(owner).to.equal(signer.address); // Verify that user owns the token
                })

                it('minting someone elses piece: should fail', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });
                    
                    const ethToSend = ethers.utils.parseEther(price.toString());    

                    const signer = await ethers.getSigner(loot13)

                    try {
                        const tmp = await dungeons.connect(signer).claim(1, {value: ethToSend});
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Not your LOOT'")
                    }
                })

                it('minting their piece again: should fail', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const ethToSend = ethers.utils.parseEther(price.toString());    
                    
                    const signer = await ethers.getSigner(loot13)

                    try {
                        await dungeons.connect(signer).claim(4837, {value: ethToSend});
                        await dungeons.connect(signer).claim(4837, {value: ethToSend});
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'ERC721: token already minted'")
                    }
                })

                it('minting out of range: should fail', async function() {
                    // Impersonate user
                    await network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [loot13],  // 13 loot
                    });

                    const ethToSend = ethers.utils.parseEther(price.toString());    
                    
                    const signer = await ethers.getSigner(loot13)

                    try {
                        await dungeons.connect(signer).claim(0);
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Token ID invalid'")
                    }

                    try {
                        await dungeons.connect(signer).claim(8100, {value: ethToSend});
                    } catch (err) {
                        expect(err.message).to.equal(EM_EXCEPTION + "'Token ID invalid'")
                    }
                })
            })
        })  
        describe('mint()', function() {
            it('Not enough ETH: should throw error', async function() {
                const ethToSend = ethers.utils.parseEther('0.01');
                const supplyBefore = await dungeons.totalSupply();
                try {
                    const tmp = await dungeons.mint({value: ethToSend});
                } catch(err) {
                    expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH'")
                    expect(Number(await dungeons.totalSupply())).to.equal(Number(supplyBefore));
                }
            })    
            it('Enough ETH: Should be successful', async function() {   
                const ethToSend = ethers.utils.parseEther('0.05');
                const supplyBefore = BigInt(await dungeons.totalSupply()).toString();
                let numErrors = 0;

                const initialPrice = ethers.utils.formatEther(BigInt(await dungeons.price()));
                expect(initialPrice).to.equal('0.05');
                try {
                    await expect(dungeons.mint({value: ethToSend}))
                    .to.emit(dungeons, 'Minted')
                    .withArgs('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '8001');;
                    const size = Number(await dungeons.getSize(8001))
                    expect(size).to.not.be.equal(null)
                    expect(size).to.be.greaterThan(5)
                } catch(err) {
                    expect(err.message).to.equal(EM_EXCEPTION + "'Insufficient ETH'")
                    expect(await dungeons.totalSupply()).to.equal(supplyBefore);
                    numErrors++;
                }
                expect(numErrors).to.equal(0)
                let newSupply = Number(await dungeons.totalSupply())

                expect(newSupply).to.equal(Number(supplyBefore)+1);
            })
        })  
        describe('withdraw()', function() {
            it('Non-Owner: should throw error', async function() {
                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [loot13],  // 13 loot
                });

                const ethToSend = ethers.utils.parseEther(price.toString());    
                
                const signer = await ethers.getSigner(loot13)

                let numErrors = 0;

                try {
                    await dungeons.connect(signer).mint({value: ethToSend});
                    await dungeons.connect(signer).mint({value: ethToSend});
                    await dungeons.connect(signer).mint({value: ethToSend});
                    // Mint 3 - 0.15ETH
                    await dungeons.connect(signer).withdraw(loot13, ethToSend);
                } catch (err) {
                    expect(err.message).to.equal(EM_EXCEPTION + "'Ownable: caller is not the owner'")
                    numErrors++;
                }

                expect(numErrors).to.equal(1);
            })
            it('Owner: should succeed', async function() {
                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [loot13],  // 13 loot
                });

                const ethToSend = ethers.utils.parseEther(price.toString());    
                
                let signer = await ethers.getSigner(loot13)

                let numErrors = 0;

                try {
                    await dungeons.connect(signer).mint({value: ethToSend});
                    await dungeons.connect(signer).mint({value: ethToSend});
                    await dungeons.connect(signer).mint({value: ethToSend});
                } catch (err) {
                    expect(err.message).to.equal(EM_EXCEPTION + "'Ownable: caller is not the owner'")
                    numErrors++;
                }
                expect(numErrors).to.equal(0);

                const owner = await dungeons.owner();
                // Switch to contract owner
                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [owner],  // Get contract owner
                });

                signer = await ethers.getSigner(owner)
                
                const balanceBefore = ethers.utils.formatEther(await ethers.provider.getBalance(owner));
                const ethToWithdraw = ethers.utils.parseEther((price*2.99).toString());   

                try {
                    await dungeons.connect(signer).withdraw(owner, ethToWithdraw);
                } catch (err) {
                    expect(err.message).to.equal(EM_EXCEPTION + "'Withdraw failed'")
                    numErrors++;
                }
                expect(numErrors).to.equal(0);

                const balanceAfter = ethers.utils.formatEther(await ethers.provider.getBalance(owner));

                expect(balanceAfter - balanceBefore).to.be.greaterThan(0.14);
            })   
        })
    })
})