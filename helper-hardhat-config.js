const networkConfig = {
    default: {
        name: "hardhat"
    },
    31337: {
        name: "localhost",
        subscriptionId: "588",
        keyHash: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
        entranceFee: "1000000000000000", // 0.001 ETH
        callbackGasLimit: "1000000", // 10,00000 gas
    },
    5: {
        name: "goerli",
        subscriptionId: "16",
        keyHash: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
        entranceFee: "1000000000000000", // 0.001 ETH
        callbackGasLimit: "1000000", // 10,00000 gas
        vrfCoordinator: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    },
    1: {
        name: "mainnet"
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile = "../constants/contractAddresses.json"
const frontEndAbiFile = "../constants/abi.json"

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndAbiFile,
}