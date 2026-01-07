import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import axios from "axios";

const ADMIN_CARDS = [
  { label: "Users_Management", path: "Users_Management" },
  { label: "Users_Logs", path: "Users_Logs" },
];

const CARD_MAP = {
  IT: { label: "IT", path: "ITPage" },
  Drawing: { label: "Drawing", path: "DrawingPage" },
};

const Homepage = () => {
  const router = useRouter();
  const [cards, setCards] = useState([]);

  const clickCard = (path) => {
    router.push(`/${path}`);
  };

  const fetchPermissions = async () => {
    try {
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");

      let resultCards = [];

      if (role === "Admin") {
        resultCards = [...ADMIN_CARDS];
      }

      const res = await axios.get(
        `http://localhost:4000/userPermissions?username=${username}`
      );

      const permissionCards = res.data
        .filter((p) => p.enabled)
        .map((p) => CARD_MAP[p.module])
        .filter(Boolean);

      resultCards = [...resultCards, ...permissionCards];

      setCards(resultCards);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const cardClass =
    "h-48 w-72 flex flex-col items-center justify-center " +
    "bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] " +
    "border transition-all duration-150 cursor-pointer " +
    "border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] " +
    "hover:border-[#1C70D3] hover:bg-gradient-to-br hover:from-white hover:to-blue-50";

  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-[#F8F8FF] relative">
      <Navbar />

      <div className="py-40 md:py-32 flex justify-center">
        <div
          className={`grid gap-10 ${cards.length === 1
            ? "grid-cols-1 max-w-[350px]"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 max-w-2xl"
            }`}
        >
          {cards.map((card) => (
            <motion.div
              key={card.path}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => clickCard(card.path)}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className={cardClass}
            >
              <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                {card.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
