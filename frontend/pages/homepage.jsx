import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import SuccessPopup from "../components/SuccessPopup";
import axios from "axios";

const CARD_MAP = {
  IT: { label: "IT", path: "ITPage" },
  Drawing: { label: "Drawing", path: "DrawingPage" },
  Users_Management: { label: "Users_Management", path: "Users_Management" },
  Users_Logs: { label: "Users_Logs", path: "Users_Logs" },
};

const Homepage = () => {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const clickCard = (path) => {
    router.push(`/${path}`);
  };

  const fetchPermissions = async () => {
    try {
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");

      if (role?.toLowerCase() === "admin") {
        setCards([
          CARD_MAP["Users_Management"],
          CARD_MAP["Users_Logs"],
        ]);
        return;
      }

      const res = await axios.get(
        `http://localhost:4000/userPermissions?username=${username}`
      );

      const permissionCards = res.data
        .filter((p) => p.enabled === 1)
        .map((p) => CARD_MAP[p.module])
        .filter(Boolean);

      const showCard = Array.from(
        new Map(permissionCards.map((card) => [card.path, card])).values()
      );

      setCards(showCard);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPermissions();

    if (sessionStorage.getItem("loginSuccess") === "1") {
      setShowPopup(true);
      sessionStorage.removeItem("loginSuccess");
    }
  }, []);

  const cardClass =
    "h-44 w-80 flex flex-col items-center justify-center gap-1 " +
    "bg-white rounded-2xl border border-gray-200 cursor-pointer " +
    "shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-200 " +
    "hover:-translate-y-2 hover:border-[#1C70D3] " +
    "hover:shadow-[0_20px_45px_rgba(28,112,211,0.25)] " +
    "hover:bg-gradient-to-br hover:from-white hover:to-blue-50";

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

      <SuccessPopup
        showPopup={showPopup}
        message="เข้าสู่ระบบสำเร็จ"
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default Homepage;
