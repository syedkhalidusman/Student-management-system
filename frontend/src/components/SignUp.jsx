import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      await axios.post('/api/auth/signup', { name, email, password });

      setError('');
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      setError('An error occurred during registration. Please try again later.');
    }
  };

  // Handle close button
  const handleClose = () => {
    navigate('/'); // Navigate to the homepage or another route
  };

  return (
    <div className="flex justify-center items-center w-full h-full bg-transparent relative">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg relative">
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          &#x2715; {/* Close icon */}
        </button>

        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account? <a href="/signin" className="text-blue-600 hover:text-blue-800">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
