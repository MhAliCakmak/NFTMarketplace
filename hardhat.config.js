require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
const { privateKey, bscscanApiKey } = require('./secrets.json');

module.exports = {

  networks: {
    testnet: {
      url: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [privateKey],
    },
    mainnet: {
      url: 'https://bsc-dataseed.bnbchain.org/',
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [privateKey],
    },
  },

  etherscan: {
    apiKey: bscscanApiKey,
  },
  solidity: '0.8.4',
};
