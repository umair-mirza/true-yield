import react, {useState, useEffect} from "react"
import ethers from 'ethers'
import artifacts from './artifacts/contracts/TrueYield.sol/TrueYield.json'
import './App.css';

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
  const [amount, ssetAmount] = useState(0)

  return (
    <div>
      <div className="mt-20 text-center">
        <div className="font-extrabold text-transparent text-5xl md:text-7xl bg-clip-text bg-gradient-to-b from-gray-300 via-gray-300 to-purple-300 tracking-wide">
          TrueYield
        </div>
      </div>
      
    </div>
  );
}

export default App;
