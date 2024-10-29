import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <nav style={{
      padding: '20px',
      backgroundColor: '#eee',
      position: 'fixed',
      top: '0',
      width: '100%',
      zIndex: '1000',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    }}>
      <Link to="/home" style={{ margin: '0 10px' }}>Home</Link>
      <Link to="/notifications" style={{ margin: '0 10px' }}>Notifications</Link>
      

      {user ? (
        <>
          <Link to="/my-posts" style={{ margin: '0 10px' }}>My Posts</Link>
          <button onClick={signOut} style={{
            marginLeft: '10px',
            padding: '10px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/signin" style={{ marginLeft: '10px' }}>Sign In</Link>
          <Link to="/signup" style={{ marginLeft: '10px' }}>Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
