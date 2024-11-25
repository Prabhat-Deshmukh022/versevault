import axios from "axios";
import React, { useState } from "react";
import Nav from "./Nav";
import { Link } from "react-router-dom";

function BookSearch() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);  
    setBooks([]);      

    try {
      console.log("QUERY", query);
      let response = await axios.post('/api/v1/books/', { query });
      console.log("RESPONSE DATA", response.data);  // Check the structure here
      let booksData = response.data;
    
      booksData = Array.isArray(response.data) ? response.data : [response.data];
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with the correct path to your image
      >
        <div className="flex flex-col items-center justify-center min-h-screen bg-center bg-[url('/search.jpg')]">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-80"></div>
          <div className="relative z-10 text-center text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Find Your Next Book</h2>
            <p className="text-gray-300 mb-8">
              Discover a world of books by searching for your favorite title or author.
            </p>

            <form onSubmit={handleSearch} className="flex space-x-2 pl-28">
              <input
                type="text"
                placeholder="Search for books..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-4 py-2 rounded-lg focus:outline-none w-64 text-black placeholder-gray-500"
              />
              <button
                type="submit"
                className="text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                Search
              </button>
            </form>

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
                    <Link to={`/view/${ book.book_id }`} className="group" key={book.book_id}>
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
        </div>
      </section>
    </div>
  );
}

export default BookSearch;
