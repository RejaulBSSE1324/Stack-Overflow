import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

const CreatePostScreen = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [language, setLanguage] = useState('C++');
    const [file, setFile] = useState(null);
    const [uploadOption, setUploadOption] = useState('codeSnippet');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!title || !content || (!codeSnippet && uploadOption === 'codeSnippet') || (!file && uploadOption === 'file')) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (uploadOption === 'codeSnippet') {
                formData.append('codeSnippet', codeSnippet);
                formData.append('language', language);
            } else {
                formData.append('file', file);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('/api/posts', formData, config);
            setLoading(false);
            navigate('/posts');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while creating the post');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-24 px-4"> {/* Padding top for navbar */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg mx-auto">
                <h1 className="text-3xl font-semibold mb-6 text-center text-indigo-600">Create a New Post</h1>

                {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
                {loading && <Loader />}

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-600">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                            placeholder="Enter title"
                        />
                    </div>

                    {/* Content Input */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-600">Content</label>
                        <textarea
                            id="content"
                            rows="5"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                            placeholder="Enter content"
                        ></textarea>
                    </div>

                    {/* Upload Option Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Upload Option</label>
                        <div className="flex items-center mt-1 space-x-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="uploadOption"
                                    value="codeSnippet"
                                    checked={uploadOption === 'codeSnippet'}
                                    onChange={() => setUploadOption('codeSnippet')}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2 text-gray-700">Code Snippet</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="uploadOption"
                                    value="file"
                                    checked={uploadOption === 'file'}
                                    onChange={() => setUploadOption('file')}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2 text-gray-700">File Upload</span>
                            </label>
                        </div>
                    </div>

                    {/* Conditionally Render Code Snippet or File Upload */}
                    {uploadOption === 'codeSnippet' ? (
                        <>
                            <div>
                                <label htmlFor="codeSnippet" className="block text-sm font-medium text-gray-600">Code Snippet</label>
                                <textarea
                                    id="codeSnippet"
                                    rows="8"
                                    value={codeSnippet}
                                    onChange={(e) => setCodeSnippet(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                                    placeholder="Enter code snippet"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-600">Programming Language</label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                                >
                                    <option value="C++">C++</option>
                                    <option value="Python">Python</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="Java">Java</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-600">Upload File</label>
                            <input
                                type="file"
                                id="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg shadow-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Upload Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostScreen;
