// // components/LoginPromptPopup.js
// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUserLock } from '@fortawesome/free-solid-svg-icons'

// const LoginPopup = ({ onClose }) => {
//   const navigate = useNavigate()

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50">
//       <div className="bg-white rounded-2xl shadow-lg max-w-md w-full px-6 py-8 text-center">
//         <FontAwesomeIcon icon={faUserLock} className="text-5xl text-yellow-500 mb-4" />
//         <h2 className="text-2xl font-semibold mb-2 text-gray-800">Access Restricted</h2>
//         <p className="text-gray-600 mb-6">
//           You need to be logged in to view this content.<br />Please log in or sign up to continue.
//         </p>
//         <div className="flex flex-col sm:flex-row justify-center gap-4">
//           <button
//             onClick={() => {
//               onClose()
//               navigate('/signup')
//             }}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
//           >
//             Log In
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginPopup






// components/LoginPromptPopup.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserLock, faTimes } from '@fortawesome/free-solid-svg-icons'

const LoginPromptPopup = ({ onClose }) => {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000008c] backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full px-6 py-8 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="Close popup"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Icon and Message */}
        <FontAwesomeIcon icon={faUserLock} className="text-5xl text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Restricted</h2>
        <p className="text-gray-600 mb-6">
          You need to log in or sign up to access this content.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              onClose()
              navigate('/signup')
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPromptPopup
