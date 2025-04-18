// import React, { useContext, useState } from 'react';
// import { AppContext } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';

// function Signup() {

//   const navigate = useNavigate();
//   const { url, setToken } = useContext(AppContext);

//   const [currentState, setCurrentState] = useState('login');
//   const [data, setData] = useState({
//     username: "",
//     email: "",
//     password: ""
//   });
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData(data => ({ ...data, [name]: value }));
//     console.log(data);
    
//   };

//   const onLogin = async (event) => {
//     event.preventDefault();
//     let apiUrl = url;
//     if (currentState === "login") {
//       apiUrl += "/api/auth/login";
//     } else {
//       apiUrl += "/api/auth/signup";
//     }

//     try {
//       const response = await fetch(apiUrl, { // Use the dynamically constructed apiUrl
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data), // Send the data from the state
//       });

//       const responseData = await response.json();

//       if (response.ok) {
//         setMessage(responseData.message);
//         if (responseData.token) {
//           setToken(responseData.token);
//           localStorage.setItem("token", responseData.token);
//           localStorage.setItem("userId", responseData.userId);
//           console.log(`${currentState} successful:`, responseData);
//           navigate("/");
//         }
//       } else {
//         setError(responseData.message || `${currentState} failed.`);
//         console.error(`${currentState} failed:`, responseData);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred.');
//       console.error(`${currentState} error:`, error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-md shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold capitalize">{currentState}</h2>
//         {currentState === "login" ? null : (
//           <button onClick={() => setCurrentState("login")} className="text-gray-500 hover:text-gray-700 focus:outline-none">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>
//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//         <strong className="font-bold">Error!</strong>
//         <span className="block sm:inline">{error}</span>
//       </div>}
//       {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
//         <strong className="font-bold">Success!</strong>
//         <span className="block sm:inline">{message}</span>
//       </div>}
//       <form onSubmit={onLogin} className="space-y-4">
//         <div>
//           {currentState === "login" ? null : (
//             <input
//               type="text"
//               name="username"
//               onChange={onChangeHandler}
//               value={data.name}
//               placeholder="Username"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//               required
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             onChange={onChangeHandler}
//             value={data.email}
//             placeholder="Your email"
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             onChange={onChangeHandler}
//             value={data.password}
//             placeholder="Password"
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//         >
//           {currentState === "signup" ? "Create Account" : "Login"}
//         </button>
//         <div className="flex items-center">
//           <input type="checkbox" id="terms" className="mr-2" required />
//           <label htmlFor="terms" className="text-gray-700 text-sm">By continuing, I agree to terms of use & privacy policy.</label>
//         </div>
//         <div className="text-center text-sm text-gray-600">
//           {currentState === "login" ? (
//             <p>
//               Create a new account?
//               <button type="button" onClick={() => setCurrentState("signup")} className="text-blue-500 hover:underline focus:outline-none ml-1">
//                 Click here
//               </button>
//             </p>
//           ) : (
//             <p>
//               Already have an account?
//               <button type="button" onClick={() => setCurrentState("login")} className="text-blue-500 hover:underline focus:outline-none ml-1">
//                 Login here
//               </button>
//             </p>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Signup;










// import React, { useContext, useState } from 'react';
// import { AppContext } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';

// function Signup() {

//   const navigate = useNavigate();
//   const { url, setToken } = useContext(AppContext);

//   const [currentState, setCurrentState] = useState('login');
//   const [data, setData] = useState({
//     username: "",
//     email: "",
//     password: ""
//   });
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData(data => ({ ...data, [name]: value }));
//   };

//   const onLogin = async (event) => {
//     event.preventDefault();
//     let apiUrl = url;
//     if (currentState === "login") {
//       apiUrl += "/api/auth/login";
//     } else {
//       apiUrl += "/api/auth/signup";
//     }

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const responseData = await response.json();

//       if (response.ok) {
//         setMessage(responseData.message);
//         if (responseData.token) {
//           setToken(responseData.token);
//           localStorage.setItem("token", responseData.token);
//           localStorage.setItem("userId", responseData.userId);
//           navigate("/");
//         }
//       } else {
//         setError(responseData.message || `${currentState} failed.`);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred.');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold capitalize text-center">{currentState === "login" ? "Login" : "Create Account"}</h2>
//         {currentState === "login" ? null : (
//           <button onClick={() => setCurrentState("login")} className="text-gray-500 hover:text-gray-700 focus:outline-none">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>
      
//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//         <strong className="font-bold">Error!</strong>
//         <span className="block sm:inline">{error}</span>
//       </div>}
      
//       {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
//         <strong className="font-bold">Success!</strong>
//         <span className="block sm:inline">{message}</span>
//       </div>}

//       <form onSubmit={onLogin} className="space-y-6">
//         <div className="space-y-4">
//           {currentState === "login" ? null : (
//             <div>
//               <input
//                 type="text"
//                 name="username"
//                 onChange={onChangeHandler}
//                 value={data.username}
//                 placeholder="Username"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           )}
          
//           <div>
//             <input
//               type="email"
//               name="email"
//               onChange={onChangeHandler}
//               value={data.email}
//               placeholder="Your email"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <input
//               type="password"
//               name="password"
//               onChange={onChangeHandler}
//               value={data.password}
//               placeholder="Password"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//         </div>
        
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white font-bold py-3 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-500 transform hover:bg-blue-700 transition-all duration-300"
//         >
//           {currentState === "signup" ? "Create Account" : "Login"}
//         </button>

//         <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-4">
//           <input type="checkbox" id="terms" className="mr-2" required />
//           <label htmlFor="terms">By continuing, I agree to the <a href="/terms" className="text-blue-500 hover:underline">terms of use</a> & <a href="/privacy" className="text-blue-500 hover:underline">privacy policy</a>.</label>
//         </div>

//         <div className="text-center text-sm text-gray-600 mt-4">
//           {currentState === "login" ? (
//             <p>
//               Create a new account?
//               <button type="button" onClick={() => setCurrentState("signup")} className="text-blue-500 hover:underline">
//                 Sign up here
//               </button>
//             </p>
//           ) : (
//             <p>
//               Already have an account?
//               <button type="button" onClick={() => setCurrentState("login")} className="text-blue-500 hover:underline">
//                 Login here
//               </button>
//             </p>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Signup;











import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const { url, setToken } = useContext(AppContext);

  const [currentState, setCurrentState] = useState('login');
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let apiUrl = currentState === "login" ? `${url}/api/auth/login` : `${url}/api/auth/signup`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(responseData.message);
        if (responseData.token) {
          setToken(responseData.token);
          localStorage.setItem("token", responseData.token);
          localStorage.setItem("userId", responseData.userId);
          navigate("/");
        }
      } else {
        setError(responseData.message || `${currentState} failed.`);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#2a2a2a] text-white p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold tracking-wide">
            {currentState === "login" ? "Login" : "Create Account"}
          </h2>
          {currentState === "signup" && (
            <button onClick={() => setCurrentState("login")} className="text-gray-400 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-sm">
            <strong className="font-bold">Error: </strong>{error}
          </div>
        )}

        {message && (
          <div className="bg-green-600/20 border border-green-500 text-green-300 px-4 py-2 rounded mb-4 text-sm">
            <strong className="font-bold">Success: </strong>{message}
          </div>
        )}

        <form onSubmit={onLogin} className="space-y-6">
          {currentState === "signup" && (
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={data.username}
                onChange={onChangeHandler}
                className="w-full bg-[#1f1f1f] text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={onChangeHandler}
              className="w-full bg-[#1f1f1f] text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={onChangeHandler}
              className="w-full bg-[#1f1f1f] text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center text-sm text-gray-400">
            <input type="checkbox" id="terms" className="mr-2" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms" className="text-blue-400 hover:underline">terms</a> and <a href="/privacy" className="text-blue-400 hover:underline">privacy policy</a>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            {currentState === "signup" ? "Create Account" : "Login"}
          </button>

          <div className="text-center text-sm text-gray-400 mt-4">
            {currentState === "login" ? (
              <p>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentState("signup")}
                  className="text-blue-400 hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentState("login")}
                  className="text-blue-400 hover:underline"
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
