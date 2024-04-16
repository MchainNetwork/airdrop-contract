require('dotenv').config();

module.exports = {
  dashboard: {
    port: 24012,
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    arbitrum: {
      network_id: 42161,
    },
    dashboard: {
      networkCheckTimeout: 120000,
      network_id: 42161,
      from: process.env.DEPLOYER_ADDRESS,
      gas: 2000000,
      gasPrice: 500000000,
    },
  },
  compilers: {
    solc: {
      version: '0.8.8',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    arbiscan: process.env.ARBISCAN_API_KEY,
  },
};
