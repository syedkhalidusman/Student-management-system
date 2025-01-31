import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset errors on new attempt

    if (!email || !password) {
      setError('Both email and password are required!');
      return;
    }

    try {
      const response = await axios.post('/api/auth/signin', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password!');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Invalid email or password!');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleClose = () => navigate('/');

  return (
    <div className="flex justify-center items-center w-full h-full bg-transparent relative">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          &#x2715;
        </button>

        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center">
          Don’t have an account? <a href="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
