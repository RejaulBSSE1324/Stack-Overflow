import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/auth/signin', {
        email,
        password,
      });
      console.log('SignIn successful!', response.data);

      const userId = response.data.user._id;

      // Store the token and userId in localStorage (if needed)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', userId);
      console.log(userId);
      // Navigate to home page with userId in state
      navigate('/home', { state: { userId } });
    } catch (error) {
      alert("Invalid Credentials");
      console.error('Error during sign in:', error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sign In</h2>
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
        <button type="submit" style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>Sign In</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up here</Link></p>
    </div>
  );
};

export default SignIn;
