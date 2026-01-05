import React from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const Search_Drawing = () => {
  const router = useRouter();
  const card = ["Search_Drill"];
  const clickCard = (path) => {
    router.push(`/${path}`);
  };
  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-[#F8F8FF] relative">
      <Navbar />
      <div className="py-40 md:py-32 flex justify-center">
        {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-10 max-w-3xl mx-5 md:mx-auto "> */}
        {card.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => clickCard(item)}
            className="h-44 w-72 flex items-center justify-center
                     border border-gray-500 bg-gradient-to-br from-white to-blue-50 
                     text-[#0B4EA2] font-semibold text-lg rounded-2xl shadow-md cursor-pointer
                     hover:shadow-xl hover:from-[#E3F2FD] hover:to-white 
                     transition-all duration-300"
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
    // </div>
  );
};

export default Search_Drawing;
