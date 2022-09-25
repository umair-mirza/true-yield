import React, {useState, useEffect} from "react"
import {ethers} from 'ethers'
import artifacts from './artifacts/contracts/TrueYield.sol/TrueYield.json'
import {bytesToStrings, toEther, toWei} from './helpers/helpers'
import Header from "./components/Header"
import './App.css';
import Modal from "./components/Modal"
import StakeTable from "./components/StakeTable"
import StakeContainer from "./components/StakeContainer"
import Heading from "./components/Heading"
import Footer from "./components/Footer"

const CONTRACT_ADDRESS = "0x3B553618f0450D5427fB75e5B93d0eCfa4A447b5"

function App() {
  //General frontend variables
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  //Instance of the contract in the frontend
  const [contract, setContract] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)

  //Related to user Positions
  //Positions will be called Assets in the frontend
  const [assetIds, setAssetIds] = useState([])
  //Positions of the users that will be displayed if they are present
  const [assets, setAssets] = useState([])

  //Staking variables
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [stakingLength, setStakingLength] = useState(undefined)
  const [stakingPercent, setStakingPercent] = useState(undefined)
  //Amount of Ether a user wants to stake
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)

      const contract = await new ethers.Contract(
        CONTRACT_ADDRESS,
        artifacts.abi
      )
      setContract(contract)
    }
    onLoad()
  }, [])

  const isConnected = () => signer !== undefined

  const getSigner = async () => {
    //From Ethers.js to get a signer to call functions
    provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    return signer
  }

  const getAssetIds = async (address, signer) => {
    const assetIds = await contract.connect(signer).getAllPositionIdsByAddress(address)
    return assetIds
  }

  const getAssets = async (ids, signer) => {
    //Using a Promise.all so that we can wait until we can get the data for all the positions
    const queriedAssets = await Promise.all(
      ids.map(id => contract.connect(signer).getPositionById(id))
    )

    queriedAssets.map(async asset => {
      //Will be easy to work with an object of the data that comes back with getPositionById
      const parsedAsset = {
        positionId: asset.positionId,
        percentInterest: Number(asset.percentInterest) / 100,
        daysRemaining: calculateRemainingDays(Number(asset.unlockDate)),
        etherInterest: toEther(asset.weiInterest),
        etherStaked: toEther(asset.weiStaked),
        open: asset.open,
      }

      setAssets((prev) => [...prev, parsedAsset])
    })
  }

  const calculateRemainingDays = (unlockDate) => {
    const timeNow = Date.now() / 1000 //as Date.now() returns in milliseconds
    const remainingSeconds = unlockDate - timeNow
    return Math.max((remainingSeconds / 60 / 60 / 24).toFixed(0), 0) //To return result in days without decimals and Max of that number and hundred so that there is no negative number and past date is shown as 0
  }

  const connectAndLoad = async () => {
    const signer = await getSigner()
    setSigner(signer)

    const signerAddress = await signer.getAddress()
    setSignerAddress(signerAddress)
    console.log(signerAddress)

    const assetIds = await getAssetIds(signerAddress, signer)
    setAssetIds(assetIds)
    console.log(assetIds)

    getAssets(assetIds, signer)
    console.log(assets)
  }

  const openStakingModal = (stakingLength, stakingPercent) => {
    setShowStakeModal(true)
    setStakingLength(stakingLength)
    setStakingPercent(stakingPercent)
  }

  const stakeEther = () => {
    const wei = toWei(amount)
    const data = {value: wei}
    contract.connect(signer).stakeEther(stakingLength, data)
    console.log(String(wei))
  }

  const withdraw = positionId => {
    contract.connect(signer).closePosition(positionId)
  }

  return (
    <>
      <div className="mt-5 mr-5 flex justify-end">
        <Header isConnected={isConnected} connect={connectAndLoad} />
      </div>

      <Heading />
      <StakeContainer openStakingModal={openStakingModal} />
      <StakeTable assets={assets} withdraw={withdraw} />
      <Footer />

      {
        showStakeModal && (
          <Modal 
            setShowStakeModal={setShowStakeModal}
            stakingLength={stakingLength}
            stakingPercent={stakingPercent}
            amount={amount}
            setAmount={setAmount}
            stakeEther={stakeEther}
          />
        )
      }
    </>
  );
}

export default App;
