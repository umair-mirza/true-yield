const {
    getNamedAccounts,
    deployments,
    network,
    run,
    ethers,
  } = require("hardhat");

  const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
  } = require("../helper-hardhat-config");
  const { verify } = require("../utils/verify");

  module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments;
    const { deployer, player } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log("----------------------------------------------------");

  const arguments = []

  const trueYield = await deploy("TrueYield", {
    from: deployer,
    args: arguments,
    value: ethers.utils.parseEther('0.2'),
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  const provider = ethers.getDefaultProvider();
  const balance = await provider.getBalance(trueYield.address);
  console.log("TrueYield contract deployed to: ", trueYield.address, " by ", deployer);
  console.log("Contract Balance: ", ethers.utils.formatEther(balance));

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(trueYield.address, arguments);
  }

  }

  module.exports.tags = ["all", "trueyield"];