import React from 'react'

const Header = ({isConnected, connect}) => {
  return (
    <>
    <div className="flex gap-x-8 items-center">
    <div className="text-fuchsia-100 font-semibold lg:text-lg hover:border-b-2 cursor-pointer">
      <a href="https://github.com/umair-mirza/true-yield" target="_blank">Github</a>
      
    </div>
    <div>
    {
        isConnected() ? (
            <button className="px-4 py-2 bg-gradient-to-b from-gray-800 via-gray-700 to-purple-800 text-xs sm:text-sm lg:text-base text-gray-100 rounded-full shadow-md shadow-fuchsia-300">Connected</button>
        ) : (
            <button onClick={() => connect()} className="px-4 py-2 bg-gradient-to-b from-gray-800 via-gray-700 to-purple-800 text-xs sm:text-sm lg:text-base text-gray-100 rounded-full shadow-md shadow-fuchsia-300 hover:shadow-fuchsia-600 hover:font-semibold transition-shadow duration-200">Connect Wallet</button>
        )
    }
    </div>
    </div>
    </>
  )
}

export default Header