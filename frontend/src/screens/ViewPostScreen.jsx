import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

const ViewPostScreen = () => {
    const { id } = useParams();  // Get the post ID from URL params
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fileContent, setFileContent] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/posts/${id}`);
                setPost(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load post');
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const [showSnippet, setShowSnippet] = useState(false);

    const handleToggleCode = async () => {
        if (!showSnippet) {
            try {
                const response = await fetch(post.codeSnippet);
                const content = await response.text();
                setFileContent(content);
            } catch (error) {
                console.error('Error fetching file content:', error);
                alert('Error fetching file content. Please try again.');
            }
        }
        setShowSnippet((prevState) => !prevState);
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        post && (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-24"> {/* Padding top for navbar */}
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">{post.title}</h1>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <p className="text-gray-700 mb-4">{post.content}</p>

                        {post.codeSnippet && (
                            <>
                                <button
                                    onClick={handleToggleCode}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                                >
                                    {showSnippet ? 'Hide Code Snippet' : 'Show Code Snippet'}
                                </button>

                                {showSnippet && (
                                    <pre className="mt-4 bg-gray-50 p-4 rounded-md text-sm text-gray-800 overflow-auto border border-gray-300">
                                        <code>
                                            {fileContent || 'Loading...'}
                                        </code>
                                    </pre>
                                )}
                            </>
                        )}
                        <p className="text-sm text-gray-500 mt-4">Posted by: {post.user && post.user.name}</p>
                    </div>
                </div>
            </div>
        )
    );
};

export default ViewPostScreen;
