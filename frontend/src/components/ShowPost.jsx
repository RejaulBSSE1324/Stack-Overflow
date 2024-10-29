// components/showPost.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error.response?.data || error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Posts</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {posts.map(post => (
          <li key={post.user._id} style={{
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px'
          }}>
            <h3>User ID: {post.user._id}</h3>
            <p><strong>Date:</strong> {new Date(post.date).toLocaleString()}</p>

            {/* Display the code snippet text if it exists */}
            {post.snippet && (
              <div>
                <h4>Code Snippet:</h4>
                <pre style={{ border: '1px solid #ddd',  padding: '15px', borderRadius: '8px' }}>
                  {post.snippetFileName}
                </pre>
              </div>
            )}

            {/* Display the file name and download link if a file was uploaded */}
            {post.snippetFileName && (
              <div style={{ marginTop: '10px' }}>
                <h4>File:</h4>
                <p>{post.snippetFileName}</p>
                <a
                  href={`http://localhost:9000/code-storage/${post.snippetFileName}`}
                  download
                  style={{
                    color: '#007bff',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Download File
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowPost;
