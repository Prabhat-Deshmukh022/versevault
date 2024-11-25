import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Nav from './Nav';
import { useContext } from 'react';
import { MyContext } from '../MyContext.js';

const Login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const { user, setUser } = useContext(MyContext)
  const navigate = useNavigate()

  async function handleLogin(e){

    e.preventDefault()

    const loginInfo={
      "username":username,
      "password":password
    }

    try {
      const response = await axios.post("/api/v1/users/login", loginInfo, 
        {
          withCredentials:true
        }
      )
      setUser(response.data)
      navigate('/')
    } catch (error) {
      // Extract the error message from the backend's response
    if (error.response && error.response.data && error.response.data.message) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage("An unexpected error occurred.");
    }
  }}

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>

      {/* Login Form Section with Background Image */}
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-800 opacity-70"></div>

        <div className="relative z-10 bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-purple-300">Welcome Back</h2>
          <p className="text-gray-300 mb-6">Log in to access your account and explore your favorite books.</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input 
              type="username" 
              placeholder="Enter Username" 
              name="username"
              onChange={ (e) => {setUsername(e.target.value)} }
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <input 
              type="password" 
              placeholder="Password" 
              name="password"
              onChange={ (e) => {setPassword(e.target.value)} }
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Login
            </button>
          </form>

          {errorMessage && (
                        <div className="mt-4 text-sm text-red-600">
                          {errorMessage}
                        </div>
                      )}

          <p className="text-gray-400 mt-4">
            Don't have an account? 
            <Link to="/register" className="text-blue-300 hover:underline ml-1">Register here</Link>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
