import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', {
        email,
        password,
      });
      console.log('SignIn successful!', response.data);
      // Store token or user data in localStorage or context (if necessary)
      localStorage.setItem('token', response.data.token); // Example of storing token

      // Navigate to home page after successful sign-in
      navigate('/home');  // Redirect to the home page
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/signin">Sign In here</Link></p>  {/* Link to SignIn */}
    </div>
  );
};

export default SignUp;
