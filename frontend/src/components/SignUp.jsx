import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';

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
    <div className="min-h-screen bg-gradient-to-br from-[#1f1c2c] via-[#302b63] to-[#24243e] flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-white text-gray-800 p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-wide">
            {currentState === "login" ? "Login" : "Create Account"}
          </h2>
          {currentState === "signup" && (
            <button onClick={() => setCurrentState("login")} className="text-gray-400 hover:text-gray-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-md text-sm">
            <strong className="font-bold">Error: </strong>{error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded-md text-sm">
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
                className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
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
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
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
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              required
            />
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <input type="checkbox" id="terms" className="mr-2" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms" className="text-indigo-500 hover:underline transition duration-300">terms</a> and <a href="/privacy" className="text-indigo-500 hover:underline transition duration-300">privacy policy</a>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-medium transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            {currentState === "signup" ? "Create Account" : "Login"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            {currentState === "login" ? (
              <p>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentState("signup")}
                  className="text-indigo-500 hover:underline transition duration-300"
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
                  className="text-indigo-500 hover:underline transition duration-300"
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default Signup;
