import React from 'react'

const Header = ({isConnected, connect}) => {
  return (
    <>
    {
        isConnected() ? (
            <button className="px-4 py-2 bg-gradient-to-b from-gray-800 via-gray-700 to-purple-800 text-xs sm:text-sm lg:text-base text-gray-100 rounded-full shadow-md shadow-fuchsia-300">Connected</button>
        ) : (
            <button onClick={() => connect()} className="px-4 py-2 bg-gradient-to-b from-gray-800 via-gray-700 to-purple-800 text-xs sm:text-sm lg:text-base text-gray-100 rounded-full shadow-md shadow-fuchsia-300 hover:shadow-fuchsia-600 hover:font-semibold transition-shadow duration-200">Connect Wallet</button>
        )
    }
    </>
  )
}

export default Header