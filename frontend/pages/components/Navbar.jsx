import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const router = useRouter();
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
    <nav
      className="fixed top-0 left-0 w-full z-50 
                 bg-[linear-gradient(90deg,#D9D9D9_0%,#737373_50%,#BDBDBD_100%)] 
                 p-5 flex justify-between items-center shadow-md"
    >
      <div className="flex items-center gap-3">
        <img
          onClick={goHomePage}
          className="w-14 cursor-pointer ml-4"
          src="ht-logo.png"
          alt="HT"
        />
        <span className="text-black hidden lg:flex text-xl font-bold">
          Drawing Database System
        </span>
      </div>

      {username && (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="text-black font-medium flex items-center gap-2 mr-2 hover:text-gray-700 transition cursor-pointer"
          >
            <FaUserCircle className="text-2xl text-black" />
            <span className="text-black text-xl">{username}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl z-50 border border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-red-500 transition rounded-b-xl flex items-center gap-2"
              >
                <FiLogOut className="text-base" />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
