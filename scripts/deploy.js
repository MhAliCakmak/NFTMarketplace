
const hre = require('hardhat');

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory('NFTMarketplace');
  const nFTMarketplace = await NFTMarketplace.deploy();

  await nFTMarketplace.deployed();
  console.log('NFTMarketplace deployed to:', nFTMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
