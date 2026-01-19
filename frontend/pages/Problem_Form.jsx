
import React from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const CARD_MAP = {
    ITFormProblem: { label: "รายการร้องขอที่ติดปัญหา", path: "ITProblemPage" },
    FixITFormProblem: { label: "รายการแจ้งซ่อมที่ติดปัญหา", path: "FixITProblemPage" },
};

const Problem_Form = () => {
    const router = useRouter();

    const clickCard = (path) => {
        router.push(`/${path}`);
    };

    const cardClass =
        "h-44 w-80 flex flex-col items-center justify-center gap-1 " +
        "bg-white rounded-2xl border border-gray-200 cursor-pointer " +
        "shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-200 " +
        "hover:-translate-y-2 hover:border-[#1C70D3] " +
        "hover:shadow-[0_20px_45px_rgba(28,112,211,0.25)] " +
        "hover:bg-gradient-to-br hover:from-white hover:to-blue-50";

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
            <Navbar />

            <div className="pt-32 flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {Object.values(CARD_MAP).map((card) => (
                        <motion.div
                            key={card.path}
                            whileHover={{ scale: 1.06, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => clickCard(card.path)}
                            transition={{ duration: 0.12, ease: "easeOut" }}
                            className={cardClass}
                        >
                            <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide text-center">
                                {card.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Problem_Form;
