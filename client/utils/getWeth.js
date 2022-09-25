const { getNamedAccounts } = require("hardhat")


async function getWeth() {
    const {deployer} = await getNamedAccounts()

    //Call the Deposit function on the WETH contract
    //we need abi and contract address for it to work
    //Create an IWeth Interface and compile the contracts
    //WETH mainnet address: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

    const iWeth = await ethers.getContractAt("IWeth", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", deployer)

    const tx = await iWeth.deposit({value: AMOUNT})
    await tx.wait(1)

    const wethBalance = await iWeth.balanceOF(deployer)
    
}

module.exports = {getWeth}