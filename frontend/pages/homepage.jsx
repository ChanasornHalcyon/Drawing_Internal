import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import SuccessPopup from "../components/SuccessPopup";
import axios from "axios";
import ModalAddUser from "../components/ModalAddUser";
const CARD_MAP = {
  Drawing: { label: "Drawing", path: "DrawingPage" },
  Users_Management: { label: "Users_Management", path: "Users_Management" },
  Users_Logs: { label: "Users_Logs", path: "Users_Logs" },
  Add_User: { label: "AddUser", path: "AddUser" },
};

const Homepage = () => {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [formAddUser, setFormAddUser] = useState({
    role: "User",
    level: "1",
  });
  const [submittingAddUser, setSubmittingAddUser] = useState(false)

  const clickCard = (path) => {
    if (path === "AddUser") {
      setShowAddUserModal(true);
      return;
    }
    router.push(`/${path}`);
  };

  const fetchPermissions = async () => {
    try {
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");

      if (role?.toLowerCase() === "admin") {
        setCards([
          CARD_MAP["Add_User"],
          CARD_MAP["Users_Management"],
          CARD_MAP["Users_Logs"],

        ]);
        return;
      }

      const res = await axios.get(
        `/api/userPermissions?username=${username}`
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
          className={
            cards.length <= 2
              ? "flex justify-center gap-10 flex-wrap"
              : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 max-w-5xl mx-auto"
          }
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
      {showAddUserModal && (
        <ModalAddUser
          onClose={() => setShowAddUserModal(false)}
          submitting={submittingAddUser}
          setSubmitting={setSubmittingAddUser}
          refreshData={fetchPermissions}
          form={formAddUser}
          setForm={setFormAddUser}
        />
      )}

    </div>
  );
};

export default Homepage;
