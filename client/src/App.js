import react, {useState, useEffect} from "react"
import {ethers} from 'ethers'
import artifacts from './artifacts/contracts/TrueYield.sol/TrueYield.json'
import {bytesToStrings, toEther, toWei} from './helpers/helpers'
import Header from "./components/Header"
import './App.css';
import Modal from "./components/Modal"

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

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
    //Using a Promise.all so that we can wait until we can the data for all the positii=ons
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
  }

  const withdraw = positionId => {
    contract.connect(signer).closePosition(positionId)
  }

  return (
    <>
      <div className="mt-5 mr-5 flex justify-end">
        <Header isConnected={isConnected} connect={connectAndLoad} />
      </div>

      <div className="mt-8 text-center">
        <div className="font-extrabold text-transparent text-4xl md:text-6xl bg-clip-text bg-gradient-to-b from-gray-300 via-gray-300 to-purple-300 tracking-wide">
          TrueYield
        </div>
      </div>

        <div className="mt-8 flex justify-center">
          <div className="relative group w-3/5 px-16 py-6 bg-neutral-900 rounded-lg">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-400 to-purple-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
            <div className="text-center text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-fuchsia-600">
              1 ETH = $1300
            </div>
            <div className="mt-6 flex justify-between">
                <div className="flex flex-col justify-center text-fuchsia-200 text-center">
                  <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-14 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <div className="text-lg leading-none mt-3">
                    30 Days with 7% APY
                  </div>
                  <div>
                    <button className="mt-4 bg-fuchsia-200 opacity-75 py-1 px-4 text-lg text-gray-900 font-semibold hover:font-bold hover:outline-2 transition-all duration-200">Stake</button>
                  </div>
                </div>

                <div className="flex flex-col justify-center text-fuchsia-200 text-center">
                  <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-14 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <div className="text-lg leading-none mt-3">
                    90 Days with 10% APY
                  </div>
                  <div>
                    <button className="mt-4 bg-fuchsia-200 opacity-75 py-1 px-4 text-lg text-gray-900 font-semibold hover:font-bold hover:outline-2 transition-all duration-200">Stake</button>
                  </div>
                </div>

                <div className="flex flex-col justify-center text-fuchsia-200 text-center">
                  <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-14 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <div className="text-lg leading-none mt-3">
                    365 Days with 12% APY
                  </div>
                  <div>
                    <button className="mt-4 bg-fuchsia-200 opacity-75 py-1 px-4 text-lg text-gray-900 font-semibold hover:font-bold hover:outline-2 transition-all duration-200">Stake</button>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-center font-extrabold text-transparent text-5xl md:text-3xl bg-clip-text bg-gradient-to-b from-gray-300 via-gray-300 to-purple-300 tracking-wide">
            Staked Assets
          </div>

          <div className="mt-8 mb-5 flex justify-center">

          
          <div class="overflow-x-auto relative rounded-lg border-2 border-purple-700">
              <table class="w-full text-sm text-left text-gray-500">
                  <thead class="text-lg text-center text-fuchsia-200 bg-neutral-900">
                      <tr>
                          <th scope="col" class="py-3 px-6">
                              Asset
                          </th>
                          <th scope="col" class="py-3 px-6">
                              Percent Interest
                          </th>
                          <th scope="col" class="py-3 px-6">
                              Staked
                          </th>
                          <th scope="col" class="py-3 px-6">
                              Interest
                          </th>
                          <th scope="col" class="py-3 px-6">
                              Days Remaining
                          </th>
                          <th scope="col" class="py-3 px-6">
                          </th>
                      </tr>
                  </thead>
                  <tbody className="text-lg text-gray-200 text-center">
                      <tr class="bg-neutral-700 border-b border-neutral-400">
                          <td class="py-4 px-6">
                              White
                          </td>
                          <td class="py-4 px-6">
                              Sliver
                          </td>
                          <td class="py-4 px-6">
                              Laptop
                          </td>
                          <td class="py-4 px-6">
                              $2999
                          </td>
                          <td class="py-4 px-6">
                              90
                          </td>
                          <td class="py-4 px-6">
                            <button className="mt-4 bg-fuchsia-200 opacity-75 py-1 px-4 text-lg text-gray-900 font-semibold hover:font-bold hover:outline-2 transition-all duration-200">Withdraw</button>
                          </td>
                      </tr>
                      <tr class="bg-neutral-700 border-b border-neutral-400">
                          <td class="py-4 px-6">
                              White
                          </td>
                          <td class="py-4 px-6">
                              White
                          </td>
                          <td class="py-4 px-6">
                              Laptop PC
                          </td>
                          <td class="py-4 px-6">
                              $1999
                          </td>
                          <td class="py-4 px-6">
                              90
                          </td>
                          <td class="py-4 px-6">
                            <button className="mt-4 bg-fuchsia-200 opacity-75 py-1 px-4 text-lg text-gray-900 font-semibold hover:font-bold hover:outline-2 transition-all duration-200">Withdraw</button>
                          </td>
                      </tr>
                      <tr class="bg-neutral-700 border-b border-neutral-400">
                          <td class="py-4 px-6">
                              White
                          </td>
                          <td class="py-4 px-6">
                              Black
                          </td>
                          <td class="py-4 px-6">
                              Accessories
                          </td>
                          <td class="py-4 px-6">
                              $99
                          </td>
                          <td class="py-4 px-6">
                              90
                          </td>
                          <td class="py-4 px-6">
                            <button className="mt-4 bg-fuchsia-200 opacity-75 py-1 px-4 text-lg text-gray-900 font-semibold hover:font-bold hover:outline-2 transition-all duration-200">Withdraw</button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          </div>
        </div>

        {
          showStakeModal && (
            <Modal 
              onClose={() => showStakeModal(false)}
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
