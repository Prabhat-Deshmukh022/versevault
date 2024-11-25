import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Nav from './Nav';

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function getVendors() {
      const res = await axios.get('/api/v1/admin/vendors')
      setVendors(res.data)
    }
    getVendors()
  }, [])

  async function handleDelete(username) {
    setErrorMessage('')
    try {
        const res = await axios.delete(`/api/v1/admin/delete/${ username }`) 
        if(res.data==='Cannot delete vendor with pending orders!'){
          setErrorMessage(`Cannot delete vendor with pending orders!`)
        }else {
          // Update the vendors state to remove the deleted vendor
          setVendors(vendors.filter(vendor => vendor.vendor_username !== username));
        navigate('/vendors')}
    } catch (err) {
        console.log(err)
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-80"></div> */}
        {/* <div className="mt-8 max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden"> */}
        <div className="bg-white grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 p-8">
      {vendors.map((vendor) => (
        <li key={vendor.vendor_username} className="flex py-6">
          <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img
              alt=""
              src={vendor.profile}
              className="size-full object-cover object-center"
            />
          </div>
          
        {errorMessage && (
                        <div className="mt-4 text-sm text-red-600">
                          {errorMessage}
                        </div>
                      )}
          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <h3>
                  <a>{vendor.vendor_username}</a>
                </h3>
                <p className="ml-4">{vendor.vendor_email}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">{vendor.vendor_contact}</p>
            </div>
            
            <div className="flex flex-1 items-end justify-between text-sm">

              <div className="flex">
                <button type="button" onClick={() => handleDelete(vendor.vendor_username)} className="font-medium text-indigo-600 hover:text-indigo-500">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
      </div>
      {/* </div> */}
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
      </div>
  );
};

export default Vendors;
