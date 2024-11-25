import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Nav from './Nav.jsx';

axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

const UpdateBook = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [plot, setPlot] = useState('');
  const [book_price, setBook_price] = useState('');
  const [copies, setCopies] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchBookData() {
      try {
        const res = await axios.get(`/api/v1/books/${id}`);
        const bookData = res.data;
        setData(bookData);
        // Set each field individually
        setTitle(bookData.title);
        setGenre(bookData.genre);
        setAuthor(bookData.author);
        setPlot(bookData.plot);
        setBook_price(bookData.price);
        setCopies(bookData.copies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchBookData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/v1/books/${id}`, { title, author, genre, plot, book_price, copies });
      navigate(`/view/${ id }`)
    } catch (error) {
      console.error("Error updating book:", error);
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav />

      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-800 opacity-70"></div>

        <div className="relative z-10 bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-purple-300">Update Book Details</h2>
          <p className="text-gray-300 mb-6">Post your books here!</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Title" 
              name='title'
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={title} // Set value
              onChange={(e) => setTitle(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Author" 
              name='author'
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={author} // Set value
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Genre" 
              name='genre'
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={genre} // Set value
              onChange={(e) => setGenre(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Plot" 
              name='plot'
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={plot} // Set value
              onChange={(e) => setPlot(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Price" 
              name='book_price'
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={book_price} // Set value
              onChange={(e) => setBook_price(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Copies" 
              name='copies'
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={copies} // Set value
              onChange={(e) => setCopies(e.target.value)}
            />
            
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Update
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UpdateBook;
