import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

const Homepage = () => {
  const [role, setRole] = useState("");
  const router = useRouter();

  const clickCard = (path) => {
    router.push({
      pathname: `/${path}`,
      query: { role },
    });
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");
  }, []);

  const cardClass =
    "h-44 flex items-center justify-center cursor-pointer text-[#0B4EA2] font-semibold text-lg rounded-2xl " +
    "border border-gray-500 bg-gradient-to-br from-white to-blue-50 shadow-md " +
    "hover:shadow-xl hover:from-[#E3F2FD] hover:to-white transition-all duration-300";

  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-[#F8F8FF] relative">
      <Navbar />

      <div className="py-40 md:py-32">
        <div className="grid grid-cols-3 md:grid-cols-2 gap-10 max-w-2xl mx-5 md:mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => clickCard("Add_Drawing")}
            className={cardClass}
          >
            Add_Drawing
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => clickCard("Search_Drawing")}
            className={cardClass}
          >
            Search_Drawing
          </motion.div>

          {role === "Admin" && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => clickCard("Users_Management")}
              className={cardClass}
            >
              Users_Management
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
