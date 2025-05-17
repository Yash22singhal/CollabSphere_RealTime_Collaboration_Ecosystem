// components/LoginPrompt.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserLock } from '@fortawesome/free-solid-svg-icons'

const LoginPrompt = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 mt-16">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full px-6 py-10 text-center">
        <FontAwesomeIcon icon={faUserLock} className="text-5xl text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Restricted</h2>
        <p className="text-gray-600 mb-6">
          You need to log in or sign up to access this content.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Log In / Sign Up
        </button>
      </div>
    </div>
  )
}

export default LoginPrompt
