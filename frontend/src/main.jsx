import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import CreatePostScreen from './screens/CreatePostScreen.jsx'; // Import CreatePostScreen
import GetPost from './screens/GetPost.jsx'; // Import GetPostScreen
import PrivateRoute from './components/PrivateRoute.jsx';  // PrivateRoute component
import NotificationScreen from './screens/NotificationScreen.jsx';
import ViewPostScreen from './screens/ViewPostScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      
      {/* Protected routes */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/create-post' element={<CreatePostScreen />} /> {/* Create Post is now a private route */}
        <Route path='/posts' element={<GetPost />} /> {/* Add GetPostScreen to display posts */}
        <Route path='/posts/:id' element={<ViewPostScreen />} />
        <Route path="/notifications" element={<NotificationScreen />} />

      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
