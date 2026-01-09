import React from "react";
import { useRouter } from "next/router";
import NavbarDrawing from "../components/NavbarDrawing";
import { motion } from "framer-motion";

const Search_Drawing = () => {
  const router = useRouter();
  const card = ["Search_Drill"];
  const clickCard = (path) => {
    router.push(`/${path}`);
  };

  const cssCard = "h-44 w-80 flex flex-col items-center justify-center gap-1 " +
    "bg-white rounded-2xl border border-gray-200 cursor-pointer " +
    "shadow-[0_8px_25px_rgba(0,0,0,0.08)] " +
    "transition-all duration-200 " +
    "hover:-translate-y-2 hover:border-[#1C70D3] " +
    "hover:shadow-[0_20px_45px_rgba(28,112,211,0.25)] " +
    "hover:bg-gradient-to-br hover:from-white hover:to-blue-50 text-[#0B4EA2] text-lg font-semibold";
  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-[#F8F8FF] relative">
      <NavbarDrawing />
      <div className="py-40 md:py-32 flex justify-center">
        {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-10 max-w-3xl mx-5 md:mx-auto "> */}
        {card.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => clickCard(item)}
            className={cssCard}
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
