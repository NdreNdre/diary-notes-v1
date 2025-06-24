
import React from 'react';
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import hk1 from '../src/assets/peek9.png';
// import hk2 from '../src/assets/peek6.png';
import hk1 from '../assets/peek9.png'
import hk2 from '../assets/peek6.png'

const LoginPages = () => {

    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin  = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3010/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if(data.success){
                toast.success('Login Successfully');
                localStorage.setItem('token', data.token)
                navigate('/home')
            } else {
                toast.error(`Login Failed : ${data.message}`);
            }
            
        } catch (error) {
            console.error('Failed To Login : ', error);
            toast.error('Failed To Login : ', error);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 bg-opacity-20">
            <div className="relative flex items-center justify-center "> 
                <div className="bg-white p-8 rounded-lg shadow-lg w-80 z-10 ">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <form onSubmit={(e) => handleLogin(e)}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                        >
                            Login
                        </button>
                    </form>
                </div>
                <img src={hk1} alt="" className='peek-character w-40 h-72 absolute -bottom-16'/>               
                <img src={hk2} alt="" className='w-32 h-32 absolute right-0 peek-character2 -top-[88px]'/>
            </div>
        </div>
    );
};

export default LoginPages;
