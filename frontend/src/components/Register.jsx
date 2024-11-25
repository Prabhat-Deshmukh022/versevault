import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from './Nav.jsx';

axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

const Register = () => {

  const [isVendor, setIsVendor] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [user_password, setUser_password] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [contact, setContact] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("username", username);
    formData.append("email", email);
    formData.append("user_password", user_password);
    formData.append("confirm_password", confirm_password);
    formData.append("contact", contact);
    formData.append("profile", profile);
    formData.append("isVendor", isVendor);

    try {
      const response = await axios.post("/api/v1/users/register", formData);
      navigate('/login')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav />

      {/* Register Form Section with Background Image */}
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-800 opacity-70"></div>

        <div className="relative z-10 bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
          <nav className="bg-gray py-6 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6">
              <div className="space-x-6">
                <span className="sm:ml-3">
                  <button 
                    type="button" 
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setIsVendor(false)}
                  >
                    <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    Customer
                  </button>
                </span>
                <span>
                  <button 
                    type="button" 
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setIsVendor(true)}
                  >
                    <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    Book Vendor
                  </button>
                </span>
              </div>
            </div>
          </nav>
          <h2 className="text-4xl font-bold mb-4 text-purple-300">Create Your Account</h2>
          <p className="text-gray-300 mb-6">Join us to explore and save your favorite books.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Your Name" 
              name='customer_username'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              name='customer_email'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              name='customer_password'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={(e) => setUser_password(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              name='confirm_password'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={(e) => setConfirm_password(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Contact Number" 
              name='customer_contact'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={(e) => setContact(e.target.value)}
            />
            {/* Custom file upload styling */}
            <label className="w-full flex flex-col items-center px-4 py-3 bg-gray-700 text-white rounded cursor-pointer">
              <span>Upload Profile Image</span>
              <input 
                type="file" 
                name="profile"
                className="hidden" 
                onChange={(e) => setProfile(e.target.files[0])} // use files[0] for file object
              />
            </label>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-gray-400 mt-4">
            Already have an account? 
            <Link to="/login" className="text-blue-300 hover:underline ml-1">Login here</Link>.
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

export default Register;
