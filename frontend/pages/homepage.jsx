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
    "h-44 flex items-center  justify-center cursor-pointer text-[#0B4EA2] font-semibold text-lg rounded-2xl " +
    "border border-gray-500 bg-gradient-to-br from-white to-blue-50 shadow-md " +
    "hover:shadow-xl hover:from-[#E3F2FD] hover:to-white transition-all duration-300";

  const cards = [];
  if (role === "Admin") {
    cards.push({ label: "Users_Management", path: "Users_Management" });
  } else {
    cards.push(
      { label: "Add_Drawing", path: "Add_Drawing" },
      { label: "Search_Drawing", path: "Search_Drawing" }
    );
  }

  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-[#F8F8FF] relative">
      <Navbar />

      <div className="py-40 md:py-32">
        <div
          className={`grid gap-10 mx-5 md:mx-auto ${
            cards.length === 1
              ? "grid-cols-1 justify-center max-w-[350px]"
              : "grid-cols-2 md:grid-cols-2 max-w-2xl"
          }`}
        >
          {cards.map((card) => (
            <motion.div
              key={card.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => clickCard(card.path)}
              className={cardClass}
            >
              {card.label}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
