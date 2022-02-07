require('@nomiclabs/hardhat-waffle');
require('@symblox/hardhat-abi-gen');  // Generate ABI config from contract
require("@nomiclabs/hardhat-etherscan");
require("@shardlabs/starknet-hardhat-plugin");

// Uncomment to deploy
// require('hardhat-deploy');
// require('hardhat-deploy-ethers');

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
      // accounts: [{
      // privateKey: process.env.WALLET_PRIVATE_KEY,
      // balance: '0'}],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
      // accounts: [process.env.WALLET_PRIVATE_KEY],
      // gasPrice: 125000000000
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.alchemy_key}`,
      // accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    starknetLocal: {
      url: "http://127.0.0.1:5000"
    }
  },
  cairo: {
    venv: "active",
  },
  mocha: {
    starknetNetwork: "starknetLocal"
  },
  etherscan: {
    apiKey: process.env.etherscan_key,
  },
  namedAccounts: {
    deployer: '0x34734543e8a2505224a7b4Ad42Ac89AD88FEf39A',
    tokenOwner: '0x34734543e8a2505224a7b4Ad42Ac89AD88FEf39A'
  },
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: true,
    // only: ['Dungeons', 'Loot', 'dungeonsRender', 'dungeonsSeeder', 'dungeonsGenerator', 'IDungeons', 'IDungeonsGenerator', 'IDungeonsRender', 'IDungeonsSeeder'],
    spacing: 2
  }
};
