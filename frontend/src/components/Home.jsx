import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CreatePost from './createPost';
import ShowPost from './showPost';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();

  const userId = location.state.userId
  
  return (
    <div>
      <CreatePost userId={userId}></CreatePost>
      <ShowPost></ShowPost>
    </div>
  );
}

export default Home;
