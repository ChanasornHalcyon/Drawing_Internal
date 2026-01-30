import React from "react";
import { useRouter } from "next/router";
import NavbarDrawing from "../components/NavbarDrawing";
import { motion } from "framer-motion";
import Image from "next/image";

const add_drawing = () => {
  const router = useRouter();

  const card = [
    "Drill",
    "DrillMockUp",
    "Reamer",
    "EndMill",
    "FaceMill",
    "HollowTool",
    "Insert",
    "BoringBar",
  ];

  const cardImages = {
    Drill: "/DRILL.png",
    DrillMockUp:"/DRILL.png",
    Reamer: "/Reamer.png",
    EndMill: "/EndMill.png",
    FaceMill: "/FaceMill.png",
    HollowTool: "/HollowTool.png",
    Insert: "/Insert.png",
    BoringBar: "/BoringBar.png",
  };

  const clickCard = (path) => {
    router.push(`/${path}`);
  };

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <NavbarDrawing />
      <div className="pt-40 md:pt-32 pb-10 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          {card.map((item, index) => {
            const enabled = ["Drill", "DrillMockUp"];
            const isDisabled = !enabled.includes(item);
            return (
              <motion.div
                key={index}
                whileHover={isDisabled ? {} : { scale: 1.06, y: -2 }}
                whileTap={isDisabled ? {} : { scale: 0.97 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                onClick={() => {
                  if (!isDisabled) clickCard(item);
                }}
                className={`h-48 w-72 flex flex-col items-center justify-center
                  bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                  border transition-all duration-300 cursor-pointer
                  ${isDisabled
                    ? "border-gray-300 opacity-50 cursor-not-allowed"
                    : "border-gray-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:border-[#1C70D3] hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
                  }`}
              >
                {cardImages[item] && (
                  <Image
                    src={cardImages[item]}
                    alt={item}
                    width={80}
                    height={80}
                    className="mb-6 object-contain max-h-25"
                  />
                )}

                <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                  {item}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default add_drawing;
