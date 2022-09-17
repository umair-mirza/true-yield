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
    value: ethers.utils.parseEther('10'),
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  const provider = ethers.getDefaultProvider();
  const balance = await provider.getBalance(trueYield.address);
  console.log("TrueYield contract deployed to: ", trueYield.address, " by ", deployer);
  console.log("Contract Balance: ", ethers.utils.formatEther(balance));

//   if(chainId === 31337) {
//     let data;
//     let transaction;
//     let receipt;
//     let block;
//     let newUnlockDate;

//     //First Transaction from Player account
//     data = {value: ethers.utils.parseEther('0.5')}
//     transaction = await trueYield.connect(player).stakeEther(30, data)

//     //Second Transaction from Player account
//     data = {value: ethers.utils.parseEther('0.5')}
//     transaction = await trueYield.connect(player).stakeEther(90, data)

//     //Third Transaction from Player account that will verify backdated staking result
//     data = {value: ethers.utils.parseEther('0.5')}
//     transaction = await trueYield.connect(player).stakeEther(90, data)
//     receipt = await transaction.wait()
//     block = await provider.getBlock(receipt.blockNumber)
//     newUnlockDate = block.timestamp - (60 * 60 * 24 * 100) //100 days
//     await trueYield.connect(deployer).changeUnlockDate(2, newUnlockDate)
//   }


  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(stallionRun.address, arguments);
  }

  }

  module.exports.tags = ["all", "trueyield"];