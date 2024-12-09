import React, { useEffect, useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const GetPostScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fileContent, setFileContent] = useState({}); // New state for file content

    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            const fetchPosts = async () => {
                setLoading(true);
                try {
                    const { data } = await axios.get('/api/posts');  // Authorization not needed here
                    setPosts(data);
                    setLoading(false);
                } catch (error) {
                    setError('Failed to load posts');
                    setLoading(false);
                }
            };

            fetchPosts();
        }
    }, [userInfo, navigate]);

    const [showSnippet, setShowSnippet] = useState({});

    const handleToggleCode = async (postId, codeSnippet) => {
        try {
            // Fetch the file content from the codeSnippet URL
            const response = await fetch(codeSnippet);
            const content = await response.text(); // Read the response as text
            setFileContent((prev) => ({
                ...prev,
                [postId]: content, // Store the fetched content
            }));

            // Toggle visibility of the code snippet
            setShowSnippet((prevState) => ({
                ...prevState,
                [postId]: !prevState[postId],
            }));
        } catch (error) {
            console.error('Error fetching file content:', error);
            alert('Error fetching file content. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-24"> {/* Added pt-24 to give space for the fixed navbar and button */}
            <div className="fixed top-20 w-full bg-white z-10 px-24 shadow-md flex "> {/* Position fixed below the navbar */}
            <Button variant='success' href='/create-post' className='me-3'>
                            Create a New Post
            </Button>
            </div>

            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">All Posts</h1>

                {loading && <Loader />}
                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Set grid-cols-1 for a vertical single-column layout */}
                <div className="grid grid-cols-1 gap-6">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                            <p className="text-gray-700 mb-4">{post.content}</p>

                            {post.codeSnippet && (
                                <>
                                    <button
                                        onClick={() => handleToggleCode(post._id, post.codeSnippet)} // Pass the codeSnippet URL
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                        {showSnippet[post._id] ? 'Hide Code Snippet' : 'Show Code Snippet'}
                                    </button>

                                    {showSnippet[post._id] && (
                                        <pre className="mt-4 bg-gray-100 p-4 rounded-md text-sm text-gray-800 overflow-auto">
                                            <code>
                                                {fileContent[post._id] || 'Loading...'} {/* Show the fetched content */}
                                            </code>
                                        </pre>
                                    )}
                                </>
                            )}
                            <p className="text-sm text-gray-500">Posted by: {post.user && post.user.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GetPostScreen;
