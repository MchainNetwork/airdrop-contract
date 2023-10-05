const Airdrop = artifacts.require('Airdrop');

module.exports = function (deployer) {
  const tokenAddress = process.env.TOKEN_ADDRESS;

  deployer.deploy(Airdrop, tokenAddress);
};
