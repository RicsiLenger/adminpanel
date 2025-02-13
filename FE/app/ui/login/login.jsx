import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import axios from 'axios';

const Login = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
      });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', user);
      if (response.data.success) {
        window.location.href = '/homepage';
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during login");
    }
};
  return (
    <div className="flex items-center justify-center bg-slate-800 rounded-3xl p-8 bg-opacity-60 w-96">
      <div className="max-w-2xl w-full">
        <form
          onSubmit={handleLogin}
          className="rounded-lg shadow-md max-w-md"
        >
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            Login
          </h1>
          <div className="mb-4 relative bg-none">
            <input
              type="text"
              placeholder="Username"
              value={user.username}
              onChange={(e) =>
                 setUser((prevUser) => ({ ...prevUser, username: e.target.value }))}
              required
              className="w-full h-10 px-4 border-2 rounded-md focus:outline-none border-white-300 text-black"
            />
            <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-400" />
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) =>
                setUser((prevUser) => ({ ...prevUser, password: e.target.value }))}
              required
              className="w-full h-10 px-4 border-2 border-white-300 rounded-md focus:outline-none text-slate-700"
            />
            <RiLockPasswordFill className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-400" />
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-md focus:outline-none hover:from-blue-800 hover:to-blue-500 transition duration-300"
          >
            Bejelentkezés
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
