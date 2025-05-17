// components/Loading.js
import React from 'react'

const Loading = ({ message = 'Loading, please wait...' }) => {
  return (
    <div className="mt-16 flex flex-col items-center justify-center h-[calc(100vh-64px)] text-gray-700 px-4 text-center">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-50 mb-6"></div>
      
      {/* Optional Message */}
      <p className="text-lg font-medium">{message}</p>
    </div>
  )
}

export default Loading
