import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';

const Cart = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function getCart() {
      try {
        // Add 'await' here to resolve the promise
        const res = await axios.get('/api/v1/users/shopping');
        console.log('books', res.data);
        setBooks(res.data || []); // Fallback to empty array if res.data is undefined
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setBooks([]); // Ensure books is always an array
      }
    }
    getCart();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav />
      <section
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Ensure the path is correct
      >
        {books.length > 0 ? (
          <div className="mt-8 max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-white grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 p-8">
          <ul>
            {books.map((book) => (
              <li key={book.book_id} className="flex py-6">
                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    alt={book.title}
                    src={book.book_cover}
                    className="size-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <a>{book.title}</a>
                      </h3>
                      <p className="ml-4">{book.genre}</p>
                    </div>
                    {/* <p className="mt-1 text-sm text-gray-500">{book.plot}</p> */}
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">{book.vendor_username}</p>
                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        <Link to={`/buy/${ book.book_id }`}>Buy</Link>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          </div>
          </div>
        ) : (
          <p>No books found in your cart.</p>
        )}
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
