import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavbarDrawing from "./components/NavbarDrawing";
import { motion } from "framer-motion";

const DrawingPage = () => {
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
        "h-48 w-72 flex flex-col items-center justify-center \
     bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] \
     border transition-all duration-150 cursor-pointer \
     border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] \
     hover:border-[#1C70D3] hover:bg-gradient-to-br hover:from-white hover:to-blue-50";

    const cards = [];
    if (role === "Admin") {
        cards.push({ label: "Users_Management", path: "Users_Management" });
        cards.push({ label: "Users_Logs", path: "Users_Logs" });
    } else {
        cards.push(
            { label: "Add Drawing", path: "Add_Drawing" },
            { label: "Search Drawing", path: "Search_Drawing" }
        );
    }

    return (
        <div className="container mx-auto max-w-[1920px] h-dvh bg-[#F8F8FF] relative">
            <NavbarDrawing />

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

export default DrawingPage;
