import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./components/Navbar";
import axios from "axios";

const Index = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/verifyUser", {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("role", res.data.user.role);

        router.push("/homepage");
      } else {
        setError(" Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (err) {
      setError(" Username หรือ Password ไม่ถูกต้อง");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#e8f0ff] via-[#f2f7ff] to-white">
      <Navbar />

      <div className="flex justify-center items-center pt-36 pb-10 px-4">
        <div
          className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl 
                        rounded-2xl p-8 w-[350px] md:w-[400px] animate-fadeIn"
        >
          <div className="flex justify-center mb-6">
            <img
              src="ht-logo.png"
              alt="logo"
              className="w-20 h-20 opacity-90"
            />
          </div>

          <form className="flex flex-col gap-5" onSubmit={login}>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="username"
                className="font-medium text-gray-700 text-sm"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           text-gray-900 transition"
                placeholder="Enter username"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="font-medium text-gray-700 text-sm"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           text-gray-900 transition"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center mt-1 font-medium ">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
                         text-white py-2 rounded-lg font-medium 
                         hover:from-blue-700 hover:to-blue-800 
                         shadow-md transition transform hover:-translate-y-0.5 active:scale-95 
                         cursor-pointer"
            >
              Login
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Drawing Database System © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
