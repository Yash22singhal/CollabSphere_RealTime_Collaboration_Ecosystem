// components/ErrorPage.js
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

const ErrorPage = ({ code = 'Error', message = 'Something went wrong!' }) => {
  return (
    <div className="flex flex-col justify-center items-center mt-16 h-[calc(100vh-64px)] text-gray-800 px-4 text-center">
      <div className="flex items-center gap-4 mb-4">
        <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500 text-6xl" />
        <h1 className="text-4xl font-bold">{code}</h1>
      </div>
      <p className="text-lg max-w-xl">
        {message}
      </p>
      <button 
        onClick={() => window.history.back()} 
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  )
}

export default ErrorPage
