require('@nomiclabs/hardhat-waffle'); 

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: false
        }
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
        blockNumber: 14216900 // Pin to a recent block to go faster
      },
    }
  },
  paths: {  // Reference contracts in our project
    root: "../contract",
    sources: "../contract/contracts",
    tests: "../contract/test",
    cache: "../contract/cache",
    artifacts: "../contract/artifacts"
  },
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: true,
    only: ['Dungeons'],
    spacing: 2
  }
};
