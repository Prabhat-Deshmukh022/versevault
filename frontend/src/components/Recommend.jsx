import axios from "axios";
import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { Link } from "react-router-dom";

function Recommend() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);      
    async function recommend() {
        const res = await axios.get(`/api/v1/books/recommend`)
        console.log(res.data)
        setBooks(res.data)
        setLoading(false)
    }
    recommend()
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-80"></div>
        <div className="relative z-10 text-center text-white p-8">
        {loading && (
              <div className="mt-8">
                {/* Loading spinner */}
                <div className="loader"></div>
                <p>Loading...</p>
              </div>
            )}

            {!loading && books.length > 0 && (
              <div className="mt-8 max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-white grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 p-8">
                  {books.map((book) => (
                    <Link to={`/view/${ book.book_id }`} className="group">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                        <img
                          src={book.book_cover || "/default-cover.jpg"}  // Default image if cover is missing
                          alt={book.title}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <h3 className="mt-4 text-sm text-gray-700">{book.title}</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{book.price}</p>
                      
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
    </section>
    </div>
  );
}

export default Recommend;
