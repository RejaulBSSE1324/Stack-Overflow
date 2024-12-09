import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaUserCircle, FaUserPlus, FaSignOutAlt, FaRegUser, FaBell } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import axios from 'axios';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [notificationCount, setNotificationCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();

  // Fetch the count of unread notifications
  const fetchNotifications = async () => {
    if (userInfo) {
      try {
        const { data } = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setNotificationCount(data.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userInfo, location]);  // Add location to dependencies

  const handleNotificationsClick = async () => {
    try {
      await axios.post('/api/notifications/mark-as-read', null, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      //setNotificationCount(0); 
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar
        expand="lg"
        collapseOnSelect
        className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg h-20 fixed-top"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="text-white font-bold text-xl tracking-wide">
              @Stack Overflow
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-white" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto flex items-center space-x-4">
              {userInfo ? (
                <div className="flex items-center space-x-4">
                  <LinkContainer to="/notifications">
                    <Nav.Link
                      className="d-flex items-center text-white"
                      onClick={handleNotificationsClick}
                    >
                      <FaBell size={20} className="mr-2" />
                      Notifications
                      {notificationCount > 0 && (
                        <span className="badge bg-red-600 text-white ml-2">
                          {notificationCount}
                        </span>
                      )}
                    </Nav.Link>
                  </LinkContainer>

                  <NavDropdown
                    title={
                      <span className="flex items-center text-white">
                        <FaUserCircle />
                        <span>{userInfo.name}</span>
                      </span>
                    }
                    id="username"
                    className="text-white"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item className="d-flex items-center text-gray-700 hover:bg-gray-200">
                        <FaRegUser className="mr-2" /> Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item
                      className="d-flex items-center text-gray-700 hover:bg-gray-200"
                      onClick={logoutHandler}
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link className="d-flex items-center text-white hover:text-yellow-300 transition duration-200">
                      <FaUserCircle className="mr-2" /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link className="d-flex items-center text-white hover:text-yellow-300 transition duration-200">
                      <FaUserPlus className="mr-2" /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
