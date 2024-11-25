'use client'

import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Nav from './Nav.jsx'

axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

const Review = () => {

  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const { id } = useParams()
  const navigate = useNavigate()
  async function handleSubmit(e){

    e.preventDefault()

    try {
      const response = await axios.post(`/api/v1/books/${ id }/review`, { content, rating })
      navigate(`/view/${ id }`)
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
        style={{ backgroundImage: `url('/library.jpg')` }} 
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
          <h2 className="text-4xl font-bold mb-4 text-purple-300">Review this Book!</h2>
          <p className="text-gray-300 mb-6">How did you like this book? Please leave us a review so we can understand you better!</p>

          <form className="space-y-4" onSubmit={handleSubmit} method='POST'>
            <input 
              type="text" 
              placeholder="Review" 
              name='review'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setContent(e.target.value) }
            />
            <Listbox value={rating} onChange={setRating}>
              <Label className="block text-sm/6 font-medium text-purple-300">Rating</Label>
              <div className="relative mt-2">
                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm/6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{rating}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon aria-hidden="true" className="size-5 text-gray-400" />
                  </span>
                </ListboxButton>

                <ListboxOptions
                  transition
                  className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                  {[1,2,3,4,5].map((rating) => (
                    <ListboxOption
                      key={rating}
                      value={rating}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                      <div className="flex items-center">
                        <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                          {rating}
                        </span>
                      </div>

                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                        <CheckIcon aria-hidden="true" className="size-5" />
                      </span>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Post your review!
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

export default Review;
