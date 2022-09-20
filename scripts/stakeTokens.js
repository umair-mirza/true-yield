const { Contract } = require("ethers")
const {
    ethers,
  } = require("hardhat");

const abi = "../client/src/artifacts/contracts/TrueYield.sol/TrueYield.json"

async function main() {

    [signer1, signer2] = await ethers.getSigners()

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const trueYieldContract = await ethers.getContractAt("TrueYield", contractAddress)

    let data;
    let transaction;
    let receipt;
    let block;
    let newUnlockDate;

    const provider = ethers.getDefaultProvider();

    //First Transaction from Signer2 account
    data = {value: ethers.utils.parseEther('0.5')}
    transaction = await trueYieldContract.connect(signer2).stakeEther(30, data)
    await transaction.wait(1)

    //Second Transaction from Signer2 account
    data = {value: ethers.utils.parseEther('0.5')}
    transaction = await trueYieldContract.connect(signer2).stakeEther(90, data)

    //Third Transaction from Signer2 account that will verify backdated staking result
    data = {value: ethers.utils.parseEther('0.5')}
    transaction = await trueYieldContract.connect(signer2).stakeEther(90, data)
    receipt = await transaction.wait()
    block = await provider.getBlock(receipt.blockNumber)
    newUnlockDate = block.timestamp - (60 * 60 * 24 * 100) //100 days back
    await trueYieldContract.connect(signer1).changeUnlockDate(2, newUnlockDate)
    
    //If this returns the bytecode, it means the contract is deployed correctly and should return some byte code
    // const result = await signer1.provider.getCode(contractAddress)
    // console.log(result)

    // const allPositions = await trueYieldContract.getAllPositionIdsByAddress(signer2.address)
    // console.log(allPositions)

    console.log(signer1.address)
    console.log(signer2.address)
    console.log("successfully ran the script")
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})