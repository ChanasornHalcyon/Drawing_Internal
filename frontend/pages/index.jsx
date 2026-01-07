import React, { useState } from "react";
import { useRouter } from "next/router";
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
    <div className="relative min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#F5F7FF] to-[#E0E7FF]">
      <div className="flex justify-center items-center min-h-screen px-4 bg-gradient-to-br from-[#EEF2FF] via-[#F8F8FF] to-[#E0E7FF]">
        <div
          className="relative bg-white/80 backdrop-blur-xl 
               border border-blue-200/60 
               shadow-[0_20px_60px_rgba(37,99,235,0.25)] 
               rounded-3xl p-8 md:p-10 w-[350px] md:w-[420px]
               animate-fadeIn mb-32"
        >

          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-2xl -z-10" />

          <div className="flex justify-center mb-6">
            <img
              src="ht-logo.png"
              alt="logo"
              className="w-20 h-20 opacity-90 drop-shadow-md"
            />
          </div>


          <h1 className="text-center text-xl font-semibold text-gray-800 mb-2">
            Halcyon System
          </h1>

          <form className="flex flex-col gap-5" onSubmit={login}>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 
                     bg-white/70 text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
                     transition"
                placeholder="Enter username"
              />
            </div>


            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 
                     bg-white/70 text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
                     transition"
                placeholder="Enter password"
              />
            </div>


            {error && (
              <div className="text-red-500 text-sm text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold text-white mt-4
                   bg-gradient-to-r from-blue-600 to-blue-700
                   hover:from-blue-700 hover:to-blue-800
                   shadow-[0_8px_25px_rgba(37,99,235,0.35)]
                   transition-all duration-200
                   hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              Login
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-6">
            Halcyon © {new Date().getFullYear()}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Index;
