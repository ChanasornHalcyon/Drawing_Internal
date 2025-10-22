import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
const Navbar = () => {
  const router = useRouter();
  const isIndexPage = router.pathname === "/";
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/");
  };
  const goHomePage = () => {
    router.push("../homepage");
  };
  useEffect(() => {
    const showUserName = localStorage.getItem("username");
    if (showUserName) setUsername(showUserName);
  }, []);

  return (
    <nav className="bg-[linear-gradient(90deg,#D9D9D9_0%,#737373_50%,#BDBDBD_100%)]  p-5 flex justify-between items-center relative">
      <div className="flex items-center gap-3">
        <img
          onClick={goHomePage}
          className="w-14 cursor-pointer ml-4 filter "
          src="ht-logo.PNG"
          alt="HT"
        />
        <span className="text-black hidden lg:flex text-xl font-bold">
          Drawing Database System
        </span>
      </div>

      {isIndexPage ? (
        <button className="hidden md:flex px-3 py-1 bg-white text-[#FF1493] rounded-md hover:bg-[#FF1493] hover:text-white">
          Sign Up
        </button>
      ) : username ? (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="text-white font-medium flex items-center gap-2 mr-2 hover:text-gray-300 cursor-pointer"
          >
            <FaUserCircle className="text-2xl text-black" />
            <span className="text-black text-xl">{username}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl z-50 border border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-red-500 transition rounded-b-xl cursor-pointer flex items-center gap-2"
              >
                <FiLogOut className="text-base" />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
