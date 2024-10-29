import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';  // Import SignUp component
import Home from './components/Home';
import Notifications from './components/Notification';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  //const location = useLocation();
  //const hideNavbar = location.pathname === '/signin' || location.pathname === '/signup'; 

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />  {/* Add SignUp route */}
          <Route path="/home" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
