const { Contract } = require("ethers")
const {
    ethers,
  } = require("hardhat");

const abi = "../client/src/artifacts/contracts/TrueYield.sol/TrueYield.json"

async function main() {

    [signer1, signer2] = await ethers.getSigners()

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const trueYieldContract = (await ethers.getContractAt("TrueYield", contractAddress)).connect(signer1)

    let data;
    let transaction;
    let receipt;
    let block;
    let newUnlockDate;

    const provider = ethers.getDefaultProvider();

    //First Transaction from Signer2 account
    data = {value: ethers.utils.parseEther('0.5')}
    transaction = await trueYieldContract.connect(signer2).stakeEther(30, data)

    //Second Transaction from Signer2 account
    data = {value: ethers.utils.parseEther('0.5')}
    transaction = await trueYieldContract.connect(signer2).stakeEther(90, data)

    //Third Transaction from Signer2 account that will verify backdated staking result
    data = {value: ethers.utils.parseEther('0.5')}
    transaction = await trueYieldContract.connect(signer2).stakeEther(90, data)
    receipt = await transaction.wait()
    block = await provider.getBlock(receipt.blockNumber)
    newUnlockDate = block.timestamp - (60 * 60 * 24 * 100) //100 days
    await trueYieldContract.connect(signer1).changeUnlockDate(2, newUnlockDate)

    console.log(signer1.address)
    console.log("successfully ran the script")
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})