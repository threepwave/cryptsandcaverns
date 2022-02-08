const { ethers, starknet } = require("hardhat");
const { expect } = require("chai");

function feltToString(feltBigInt) {
    return Buffer.from(feltBigInt.toString(16), 'hex').toString();
}

describe("Starknet Dungeons Seeder", function () {
    const iterations = 100;
    this.timeout(300_000_000);
    let cairoSeeder;
    let solSeeder;

    beforeEach(async function () {
        const cairoSeederFactory = await starknet.getContractFactory("dungeonsSeeder");
        cairoSeeder = await cairoSeederFactory.deploy();
        console.log("Cairo Seeder deployed at ", cairoSeeder.address);

        solSeederFactory = await ethers.getContractFactory("dungeonsSeeder");
        solSeeder = await solSeederFactory.deploy();
        console.log("Solidity Seeder deployed at ", solSeeder.address);
    });

    it.skip("getSize should produce the same results", async function () {
        let n = 0;
        while (n <= iterations) {
            const { size } = await cairoSeeder.call("get_size", { seed: { high: 0, low: n } });
            const solSize = await solSeeder.getSize(n);
            expect(Number(size), "getSize mismatch").to.equal(solSize);
            n++;
        }
    });

    it.skip("getEnvironment should produce the same results", async function () {
        let n = 0;
        while (n <= iterations) {
            const { environment } = await cairoSeeder.call("get_environment", { seed: { high: 0, low: n } });
            const solEnvironment = await solSeeder.getEnvironment(n);

            expect(Number(environment), "getEnvironment mismatch").to.equal(solEnvironment);
            n++;
        }
    });

    it.skip("getName should produce the same results", async function () {
        // no need to compare affinity here, it's part of the outStr

        let n = 0;
        while (n <= iterations) {
            const { legendary, out } = await cairoSeeder.call("get_name", { seed: { high: 0, low: n } });
            const outStr = out.map(feltToString, out).join('');

            const r = await solSeeder.getName(n);
            const solOutStr = r[0];
            const solLegendary = r[2];

            expect(Number(legendary)).to.equal(solLegendary);
            expect(outStr).to.equal(solOutStr);
            n++;
        }
    });
});
