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
    dashboard: {
      networkCheckTimeout: 120000,
      network_id: '*',
      from: process.env.DEPLOYER_ADDRESS,
    },
  },
  compilers: {
    solc: {
      version: '0.8.8',
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
  },
};
