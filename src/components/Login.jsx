"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter} from 'next/navigation';

const Login = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {   
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.BACKEND_API_URL}/api/auth/login`, formData);
        const { token } = response.data;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
        localStorage.setItem('loginId', response.data.user._id);
        localStorage.setItem('loginName', response.data.user.name);
        sessionStorage.setItem('token', token);
        router.push('/dashboard');  
        toast.success(response.data.message);
     
    } catch (error) {
      if (error.status === 401)
      console.error('Error logging in:', error);
      toast.error("Invalid email or password");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleInputChange}
              autoComplete="email"
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleInputChange}
              autoComplete="current-password"
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Login
            </button>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                className="text-blue-500 cursor-pointer hover:underline" href={`/signup`}
              >
                Create one
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;