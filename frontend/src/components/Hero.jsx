import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 py-20">
            <div className="absolute inset-0 bg-black opacity-30"></div> {/* Gradient overlay */}
            <div className="container mx-auto px-6 z-10 relative flex items-center justify-center">
                <div className="bg-white bg-opacity-90 p-10 rounded-lg shadow-xl w-full max-w-3xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                        Stack Overflow
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    For over 15 years we’ve been the Q&A platform of choice that millions of people visit every month to ask questions, learn, and share technical knowledge.
                    </p>
                    <Link to="/login">
                        <button className="mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition duration-300">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;
