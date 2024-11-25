import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from './Nav.jsx'

axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

const NewBook = () => {

  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")
  const [author, setAuthor] = useState("")
  const [plot, setPlot] = useState("")
  const [book_price, setBook_price] = useState(0)
  const [book_cover, setBook_cover] = useState(null)
  const [copies, setCopies] = useState(0)

  const navigate = useNavigate()

  async function handleSubmit(e){

    e.preventDefault()

    try {
      const response = await axios.post("/api/v1/books/new", { title, author, genre, plot, book_price, book_cover, copies })
      navigate('/viewBook')
  
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>

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
            </div>
          </div>
        </nav>
          <h2 className="text-4xl font-bold mb-4 text-purple-300">Add a New Book</h2>
          <p className="text-gray-300 mb-6">Post your books here!</p>

          <form className="space-y-4" onSubmit={handleSubmit} method='POST'>
            <input 
              type="text" 
              placeholder="Title" 
              name='title'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setTitle(e.target.value) }
            />
            <input 
              type="text" 
              placeholder="Author" 
              name='author'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setAuthor(e.target.value) }
            />
            <input 
              type="text" 
              placeholder="Genre" 
              name='genre'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setGenre(e.target.value) }
            />
            <input 
              type="text" 
              placeholder="Plot" 
              name='plot'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setPlot(e.target.value) }
            />
            <input 
              type="number" 
              placeholder="Price" 
              name='book_price'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setBook_price(e.target.value) }
            />
            <input 
              type="number" 
              placeholder="Copies" 
              name='copies'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setCopies(e.target.value) }
            />
            {/* Custom file upload styling */}
            <label className="w-full flex flex-col items-center px-4 py-3 bg-gray-700 text-white rounded cursor-pointer">
            <span>Upload Book Cover</span>
            <input 
              type="file" 
              name="book_cover"
              className="hidden" 
              onChange={(e) => setBook_cover(e.target.files[0])} // use files[0] for file object
            />
          </label>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Add Book!
            </button>
          </form>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NewBook;
