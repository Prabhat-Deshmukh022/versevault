import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav.jsx'

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>
      
      {/* Enlarged Header Section with Background Image */}
      <header 
        className="h-screen bg-cover bg-center flex items-center justify-center text-center py-32 relative"
        style={{ backgroundImage: `url('/library.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-800 opacity-70"></div>
        <div className="relative z-10">
          <h2 className="text-6xl md:text-7xl font-bold mb-4">Discover Your Next Great Read</h2>
          <p className="text-xl text-gray-300 mb-8">Explore a world of stories and knowledge at your fingertips.</p>
          <Link to="/recommend" className="bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 book-link">
            Recommended!
          </Link>
        </div>
      </header>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
