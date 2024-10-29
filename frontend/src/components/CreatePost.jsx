// components/createPost.js
import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = (props) => {
  const [snippet, setSnippet] = useState('');
  const [file, setFile] = useState(null);
  const {userId} = props;
  console.log(userId);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('snippet', snippet);
    if (file) {
      formData.append('file', file);
    }
    try {
      const response = await axios.post('http://localhost:3000/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Post created successfully:', response.data);
      setSnippet('');
      setFile(null);
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '400px' }}>
        <textarea
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          placeholder="Enter your code snippet here..."
          style={{ margin: '10px 0', padding: '10px', height: '100px' }}
        />
        <input
          type="file"
          onChange={handleFileChange}
          style={{ margin: '10px 0', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
