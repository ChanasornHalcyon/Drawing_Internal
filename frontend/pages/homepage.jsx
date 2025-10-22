import React from "react";
import { useRouter } from "next/router";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

const Homepage = () => {
  const router = useRouter();
  const card = ["Add_Drawing", "Search_Drawing"];
  const clickCard = (path) => {
    router.push(`/${path}`);
  };

  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-[#F8F8FF] relative">
      <Navbar />

      <div className="md:mt-14 py-10">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-10 max-w-2xl mx-5 xl:mx-auto">
          {card.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => clickCard(item)}
              className="h-44 border border-gray-500 flex items-center justify-center
                         bg-gradient-to-br from-white to-blue-50 text-[#0B4EA2]
                         font-semibold text-lg rounded-2xl shadow-md cursor-pointer
                         hover:shadow-xl hover:from-[#E3F2FD] hover:to-white
                         transition-all duration-300"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
