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
        router.push("/homepage");
      } else {
        setError(" Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (err) {
      setError(" Username หรือ Password ไม่ถูกต้อง");
    }
  };

  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-white">
      <Navbar />
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white border border-gray-300 shadow-lg rounded-xl p-8 w-[350px] md:w-[400px]">
          <form className="flex flex-col gap-4" onSubmit={login}>
            <div>
              <label
                htmlFor="username"
                className="block mb-1 font-medium text-black text-left"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                placeholder=" username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-black text-left"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                placeholder=" password"
              />

              {error && (
                <div className="text-red-500 text-sm text-center mt-5">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full  bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
