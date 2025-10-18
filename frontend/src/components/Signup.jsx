import React from 'react';
import { useState, useMemo } from 'react';
import axios from 'axios'; // <-- Replaced with MOCK definition
import { useAppContext } from '../context/UserContext'; // <-- Replaced with MOCK definition
import { useContext } from 'react'; // <-- Removed unnecessary import
import { useNavigate } from 'react-router-dom'; // <-- Replaced with MOCK definition


const Signup = () => {
    
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const { serverurl } = useAppContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage(null);
    } 

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            // NOTE: axios is the MOCK definition here
            const res = await axios.post(`${serverurl}/api/auth/signup`, form, { withCredentials: true });
            setMessage(res.data.message);
            // Simulate success and redirect
            setTimeout(() => {
                navigate("/signin");
            }, 1000); 

        } catch (error) {
            // NOTE: error is likely from the mock definition above for preview purposes
            setMessage(error.response?.data?.message || "Signup failed (Network or Server Error)");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-900 font-mono">
            <form 
                onSubmit={handleSubmit} 
                className="bg-gray-900 p-8 rounded-xl w-full max-w-sm 
                           border-2 border-cyan-600 shadow-2xl 
                           shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all"
            >
                <h2 className="text-4xl font-extrabold mb-8 text-center uppercase tracking-widest text-yellow-400">
                    ACCESS INITIATE
                </h2>
                
                {/* Name Input */}
                <input
                    type="text"
                    name="name"
                    placeholder="USERNAME"
                    onChange={handleChange}
                    required
                    className="w-full mb-4 p-3 bg-gray-800 text-white rounded-lg 
                               border-b-2 border-gray-600 focus:border-cyan-400 focus:outline-none 
                               transition-colors placeholder-gray-500"
                />
                
                {/* Email Input */}
                <input
                    type="email"
                    name="email"
                    placeholder="ACCESS KEY (Email)"
                    onChange={handleChange}
                    required
                    className="w-full mb-4 p-3 bg-gray-800 text-white rounded-lg 
                               border-b-2 border-gray-600 focus:border-cyan-400 focus:outline-none 
                               transition-colors placeholder-gray-500"
                />
                
                {/* Password Input */}
                <input
                    type="password"
                    name="password"
                    placeholder="ENCRYPTED PHRASE (Password)"
                    onChange={handleChange}
                    required
                    className="w-full mb-6 p-3 bg-gray-800 text-white rounded-lg 
                               border-b-2 border-gray-600 focus:border-cyan-400 focus:outline-none 
                               transition-colors placeholder-gray-500"
                />
                
                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg text-lg font-bold uppercase tracking-wider 
                                shadow-lg transition-all duration-200 
                                ${isLoading 
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] border-b-4 border-cyan-800'
                                }`}
                >
                    {isLoading ? "PROCESSING..." : "REGISTER USER"}
                </button>
                
                {/* Message Display */}
                {message && (
                    <div className='text-center m-4 p-2 rounded text-sm font-semibold 
                                     bg-gray-700 text-yellow-400 border border-yellow-500'>
                        {message}
                    </div>
                )}
                
                {/* Optional: Navigation Link (if you have one) */}
                <div className="mt-4 text-center text-gray-400 text-sm">
                    Already an agent? <a onClick={() => navigate("/signin")} className="text-cyan-400 hover:underline cursor-pointer">Login</a>
                </div>
            </form>
        </div>
    );
}

export default Signup;
