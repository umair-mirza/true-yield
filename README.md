# TrueYield

TrueYield is a DeFi Staking dapp that lets you stake your ETH and Generate Passive income yield.
Contract is deployed on **Goerli Testnet**.

### Live Application URL:
https://trueyield.netlify.app/

### Deployed Contract:
https://goerli.etherscan.io/address/0x3B553618f0450D5427fB75e5B93d0eCfa4A447b5

## Authors

- [Umair Mirza - @umair-mirza](https://github.com/umair-mirza)

## Description

TrueYield is a Decentralized application build on Ethereum Blockchain that lets users stake their ETH and earn passive income yield on their ETH.
This is full-stack Web3 application with complete Frontend and Backend functionality.
The dapp also integrates with Aave Lending pool so that the staked funds can be further lended to the Aave Lending Pool to generate yield.

## Features

* Three different Staking periods (30 days, 90 days and 1 Year)
* Users can un-stake before the unlock date (but won't earn any interest in that case)
* The contract will automatically lend staked funds to **Aave lending pool** for generating yield
* Users will be able to see the remaining days until lock period and Interest ratio
* Contract owner will be able to create more staking tiers

## Tech Stack

* **Backend** - Solidity, Hardhat, Ethers.js, Aave Interfaces
* **Frontend** - React.js, Tailwind CSS
* **Testing Library** - Foundry

## Usage

### Deploy Contract to the Local Hardhat Network
```
npx hardhat node
```

### Deploy Contract to the Goerli Testnet
```
npx hardhat deploy --network goerli
```
Change default network to "Goerli" in Hardhat.config.js

### Run the frontend app
```
npm start
```
