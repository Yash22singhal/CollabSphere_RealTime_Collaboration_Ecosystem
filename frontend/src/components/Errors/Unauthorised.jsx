// import React from 'react'
// import { assets } from '../../assets/data'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

// const Unauthorised = () => {
//   return (
//     <div className='flex flex-col justify-center items-center mt-16 h-[calc(100vh-64px)]'>
//         <div className="flex gap-5 items-center justify-center">
//             <FontAwesomeIcon icon={faTriangleExclamation} className='text-6xl' />
//             <h1 className='text-4xl'>Unautorised</h1>
//         </div>
//         <div className='text-center'>
//             <p>You are not authrorised to access this document <br /> please contact the owner of the docuemnt to add you as a collaborator.</p>
//         </div>
//     </div>
//   )
// }

// export default Unauthorised










import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

const Unauthorized = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-16 h-[calc(100vh-64px)] text-gray-800 px-4 text-center">
      <div className="flex items-center gap-4 mb-4">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-500 text-6xl" />
        <h1 className="text-4xl font-bold">Unauthorized Access</h1>
      </div>
      <p className="text-lg max-w-xl">
        You are not authorized to view this document. <br />
        Please contact the owner to request access or be added as a collaborator.
      </p>
      {/* Optional: Add a navigation button */}
      
      <button 
        onClick={() => window.history.back()} 
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </button> 
     
    </div>
  )
}

export default Unauthorized
