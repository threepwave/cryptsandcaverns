require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: false  // fix for optimizer and inline assembly
        }
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
        blockNumber: 13649106 // Pin to a recent block to go faster
      },
    },
  },
};
