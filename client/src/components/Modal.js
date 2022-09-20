import React, {useState} from 'react'

const Modal = ({onClose, stakingLength, stakingPercent, amount, setAmount, stakeEther}) => {


  return (
    <>
    <div id="popup-modal" tabindex="-1" className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                  <div className="relative bg-neutral-700 rounded-lg shadow">
                      <button onClick={onClose} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800" data-modal-toggle="popup-modal">
                          <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                          <span className="sr-only">Close modal</span>
                      </button>
                      <div className="p-6 text-center">
                          <div className="text-2xl text-fuchsia-200">Stake Ether</div>
                          <div className="mt-6">
                            <p className="text-xl text-gray-100">Enter the amount to Stake in ETH:</p>
                            <div className="mt-6 flex space-x-4 justify-center">
                              <label className="text-lg text-fuchsia-200" for="staker">ETH</label>
                              <input id="staker" name="staker" value={amount} onChange={e => setAmount(e.target.value)} />
                            </div>
                          </div>
                          <div className="text-lg text-fuchsia-200">
                            <span>Duration: {stakingLength} days</span>
                            <span>Interest: {stakingPercent} APY</span>
                          </div>
                          <button onClick={() => stakeEther()} data-modal-toggle="popup-modal" type="button" className="mt-6 bg-fuchsia-200 opacity-75 py-1 px-4 text-lg text-gray-900 font-semibold hover:font-bold hover:outline-2 transition-all duration-200">
                              Stake
                          </button>
                      </div>
                  </div>
              </div>
          </div>
    </>
  )
}

export default Modal