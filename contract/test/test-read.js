const { ethers } = require("hardhat");
const { expect } = require("chai");

let Render, render, Generator, generator, Dungeons, dungeons, token;

describe("Dungeons", function () {

  const price = 0.05;  // Send 0.05 ETH
  const minSize = 5;
  const maxSize = 25;
  const nameMinSize = 3;
  const nameMaxSize = 50;

  const loot13 = "0x76fb2ebe429514ee4985a3ded3d9c6c34e963dad" // Owner of 13 loots incl 4837
  const lootContract = '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7';

  beforeEach(async function() {

      // Fund Wallet
      await hre.network.provider.send("hardhat_setBalance", [
      loot13,
      "0x11111111111111111111111",
      ]);
    
      // Impersonate user
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [loot13],  // 13 loot
      });

    
    // const signer = await ethers.getSigner(loot13);
    
    Render = await ethers.getContractFactory("dungeonsRender");
    render = await Render.deploy();

    Generator = await ethers.getContractFactory("dungeonsGenerator");
    generator = await Generator.deploy();

    Seeder = await ethers.getContractFactory("dungeonsSeeder");
    seeder = await Seeder.deploy();

    Dungeons = await ethers.getContractFactory("Dungeons");
    dungeons = await Dungeons.deploy(lootContract, render.address, generator.address, seeder.address);
    await dungeons.deployed();
  });

  describe('Deploy', function() {
    it('should deploy properly', async function() {
      expect(token).to.not.be.an('error');
    });
  });

  describe('Read', function() {
    const ethToSend = ethers.utils.parseEther(price.toString());
      
    beforeEach(async function() {
      const signer = await ethers.getSigner(loot13)
      // TODO - figure out how to convert eth price (price) to gwei and pass it in
      
      const tmp = await dungeons.connect(signer).claim(4837, {value: ethToSend});
    })

    describe('getSize()', function() {
      it("Normal Input: should return a number between 8 and 25", async function() {
        let size, message
        try {
          size = parseInt(await dungeons.getSize(4837));
        } catch(err) {
          console.log(err);
          expect(err).to.be(null)
          
        }
        
        expect(parseInt(size)).to.be.lessThanOrEqual(maxSize);
        expect(parseInt(size)).to.be.greaterThanOrEqual(minSize);
    
      }); 
    
      it("Empty Input: should throw an error", async function() {
        try {
          message = await dungeons.getSize();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getSize(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getSize(9500)).to.be.revertedWith('Token ID invalid');
      });
    })

    describe('getEnvironment()', function() {
      it("Normal Input: should return a number between 0 and 5", async function() {
        let size, message
        try {
          size = await dungeons.getEnvironment(4837)
        } catch(err) {
          expect(err).to.be(null)
        }
        
        expect(parseInt(size)).to.be.lessThanOrEqual(5);
        expect(parseInt(size)).to.be.greaterThanOrEqual(0);    
      }); 
    
      it("Empty Input: should throw an error", async function() {
        try {
          message = await dungeons.getEnvironment();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getEnvironment(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getEnvironment(9500)).to.be.revertedWith('Token ID invalid');
      });
    });

    describe('getName()', function() {
      let name
      it("Normal Input: should return a string between 3 and 35", async function() {
        try {
          name = await dungeons.getName(4837)
        } catch(err) {
          expect(err).to.be(null)
        }

        expect(name.length).to.be.greaterThanOrEqual(nameMinSize);
        expect(name.length).to.be.lessThanOrEqual(nameMaxSize);
      }); 
    
      it("Empty Input: should throw an error", async function() {
        try {
          name = await dungeons.getName();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getName(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getName(9500)).to.be.revertedWith('Token ID invalid');
      });
    });

    describe('getLayout()', function() {
      let layout
      it("Normal Input: should return a BigInt with 512 bits (", async function() {
        layout = await dungeons.getLayout(4837)
        
        expect(layout.slice(0, 2)).to.be.equal('0x'); // Make sure this is a bytes string
        expect(layout.length).to.be.greaterThan(30);  // We have 128 bits plus a '0x' at the start
        expect(layout.length).to.be.lessThan(900);
        expect(Number.isSafeInteger(layout)).to.be.false;
      }); 
    
      it("Empty Input: should throw an error", async function() {
        try {
          layout = await dungeons.getLayout();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getLayout(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getLayout(9500)).to.be.revertedWith('Token ID invalid');
      });
    });

    describe('getEntities()', function() {
      let entities
      it("Normal Input: should return an array with sets of three integers", async function() {
        entities = await dungeons.getEntities(4837)
        expect(typeof(entities)).to.equal('object');
        expect(entities.length).to.be.equal(3);
      }); 
    
      it("Empty Input: should throw an error", async function() {
        try {
          layout = await dungeons.getEntities();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getEntities(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getEntities(9500)).to.be.revertedWith('Token ID invalid');
      });
    }); 

    describe('getSvg()', function() {
      let svg
      it("Normal Input: should return a string with a valid SVG", async function() {
        svg = await dungeons.getSvg(4837);
        expect(typeof(svg)).to.equal('string');
        expect(svg).length.to.be.greaterThan(0);
        expect(svg.slice(0, 153)).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500" shape-rendering="crispEdges" transform-origin="center">');
        expect(svg.slice(-10)).to.be.equal('" /></svg>')
      }); 
    
      it("Empty Input: should throw an error", async function() {
        try {
          svg = await dungeons.getSvg();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getSvg(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getSvg(9500)).to.be.revertedWith('Token ID invalid');
      });
    });

    describe('tokenURI()', function() {
      let json;
      it("Normal Input: should return a base64 blob", async function() {

        json = await dungeons.tokenURI(4837);
        expect(json.substr(0, 29)).to.equal('data:application/json;base64,');
      }); 

      describe('token components', function() {
        let output;
        beforeEach(async function() {
          json = await dungeons.tokenURI(4837);
          json = json.substr(29); // Remove the 'data:application/json;base64,' identifier at the start
          output = JSON.parse(Buffer.from(json, 'base64').toString());
        })

        it('has metadata set properly', async function() {
          // Token Name
          expect(output.name).to.contain('Crypts and Caverns');
          expect(output.name).to.contain('#4837'); // Token = #4837

          // Description
          expect(output.description).to.equal('Crypts and Caverns is an onchain map generator that produces an infinite set of dungeons. Enemies, treasure, etc intentionally omitted for others to interpret. Feel free to use Crypts and Caverns in any way you want.');

          // Dungeon name
          expect(output.attributes[0].trait_type).to.be.a('string');
          expect(output.attributes[0].trait_type).to.equal('name');
          expect(output.attributes[0].value).to.be.a('string');
          expect(output.attributes[0].value.length).to.be.greaterThan(nameMinSize);
          expect(output.attributes[0].value.length).to.be.lessThan(nameMaxSize);

          // Size (e.g. '9x9')
          expect(output.attributes[1].trait_type).to.be.a('string');
          expect(output.attributes[1].trait_type).to.equal('size');
          expect(typeof(output.attributes[1].value)).to.equal('string');
          let size = output.attributes[1].value.split('x');
          expect(parseInt(size[0])).to.be.a('number');
          expect(parseInt(size[0])).to.be.greaterThan(minSize);
          expect(parseInt(size[0])).to.be.lessThan(maxSize);
          expect(parseInt(size[1])).to.be.a('number');
          expect(parseInt(size[1])).to.be.greaterThan(minSize);
          expect(parseInt(size[1])).to.be.lessThan(maxSize);

          // Environment
          expect(output.attributes[2].trait_type).to.be.a('string');
          expect(output.attributes[2].trait_type).to.equal('environment');
          let environment = output.attributes[2].value
          expect(environment).to.be.a('string');
          expect(environment.length).to.be.greaterThanOrEqual(12);
          expect(environment.length).to.be.lessThanOrEqual(15);

          // Doors
          expect(output.attributes[3].trait_type).to.be.a('string');
          expect(output.attributes[3].trait_type).to.equal('doors');
          let doors = parseInt(output.attributes[3].value)
          expect(doors).to.be.a('number');
          expect(doors).to.be.greaterThanOrEqual(0);
          expect(doors).to.be.lessThan(32);

          // Points
          expect(output.attributes[4].trait_type).to.be.a('string');
          expect(output.attributes[4].trait_type).to.equal('points of interest');
          let points = parseInt(output.attributes[4].value)
          expect(points).to.be.a('number');
          expect(points).to.be.greaterThanOrEqual(0);
          expect(points).to.be.lessThan(32);

          // affinity
          expect(output.attributes[5].trait_type).to.be.a('string');
          expect(output.attributes[5].trait_type).to.equal('affinity');
          expect(output.attributes[5].value).to.be.a('string');
          expect(output.attributes[5].value.length).to.be.greaterThan(3);
          expect(output.attributes[5].value.length).to.be.lessThan(14);

          // legendary
          expect(output.attributes[6].trait_type).to.be.a('string');
          expect(output.attributes[6].trait_type).to.equal('legendary');
          let legendary = output.attributes[6].value
          expect(legendary).to.be.a('string');
          expect(legendary.length).to.be.greaterThanOrEqual(2);
          expect(legendary.length).to.be.lessThanOrEqual(3);

          // structure
          expect(output.attributes[7].trait_type).to.be.a('string');
          expect(output.attributes[7].trait_type).to.equal('structure');
          let structure = output.attributes[7].value
          expect(structure).to.be.a('string');
          expect(structure.length).to.be.greaterThanOrEqual(5);
          expect(structure.length).to.be.lessThanOrEqual(6);
        });

        it('returns an svg', async function() {
          let svg = output.image.slice(26);  // Remove data type prefix
          svg = Buffer.from(svg, 'base64').toString()

          expect(output.image).to.be.a('string');
          expect(output.image.slice(0, 26)).to.equal('data:image/svg+xml;base64,');

          expect(typeof(svg)).to.equal('string');
          expect(svg).length.to.be.greaterThan(0);
          expect(svg.slice(0, 153)).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500" shape-rendering="crispEdges" transform-origin="center">');
          expect(svg.slice(-10)).to.be.equal('" /></svg>')
          
          expect()
        });
       

      });
    
      it("Empty Input: should throw an error", async function() {
        try {
          svg = await dungeons.getSvg();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getSvg(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getSvg(9500)).to.be.revertedWith('Token ID invalid');
      });
    }); 
    describe('getNumDoors()', function() {
      it("Normal Input: should return a number between 0 and 32", async function() {
        let size, message
        try {
          size = parseInt(await dungeons.getNumDoors(4837));
        } catch(err) {
          console.log(err);
          expect(err).to.be(null)
          
        }
        
        expect(parseInt(size)).to.be.lessThanOrEqual(32);
        expect(parseInt(size)).to.be.greaterThanOrEqual(0);
    
      }); 
    
      it("Empty Input: should throw an error", async function() {
        try {
          message = await dungeons.getNumDoors();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getNumDoors(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getNumDoors(9500)).to.be.revertedWith('Token ID invalid');
      });
    })

    describe('getNumPoints()', function() {
      it("Normal Input: should return a number between 0 and 32", async function() {
        let size, message
        try {
          size = parseInt(await dungeons.getNumPoints(4837));
        } catch(err) {
          console.log(err);
          expect(err).to.be(null)
        }
        
        expect(parseInt(size)).to.be.lessThanOrEqual(32);
        expect(parseInt(size)).to.be.greaterThanOrEqual(0);
    
      }); 
    
      it("Empty Input: should throw an error", async function() {
        try {
          message = await dungeons.getNumPoints();
        } catch (err) {
          expect(err.code).to.equal('MISSING_ARGUMENT');
        }
      });

      it("Unminted Input: should throw an error", async function() {
        await expect(dungeons.getNumPoints(3200)).to.be.revertedWith('Token is not minted yet');
      });

      it("Out of Bounds Input: should throw an error", async function() {
        await expect(dungeons.getNumPoints(9500)).to.be.revertedWith('Token ID invalid');
      });
    })
  }) 
});