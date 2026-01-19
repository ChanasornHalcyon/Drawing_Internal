import React, { useState, useEffect } from "react";
import NavbarIT from "../components/NavbarIT";
import { motion } from "framer-motion";
import ModalITForm from "../components/ModalITForm";
import ModalFixForm from "../components/ModalFixForm";
import { useRouter } from "next/router";

const ITPage = () => {
    const router = useRouter();
    const [role, setRole] = useState("");
    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalFixForm, setShowModalFixForm] = useState(false);

    const openPendingPage = () => router.push("./Pending_Form");
    const openApprovePage = () => router.push("./Approve_Form");
    const openCompletePage = () => router.push("./Complete_Form");
    const openProblemPage = () => router.push("./Problem_Form");
    const openReportPage = () => router.push("./Report");


    const IT_CARDS = [
        {
            title: "แบบฟอร์มร้องขอ IT",
            action: () => setShowModalForm(true),
        },
        {
            title: "แบบฟอร์มแจ้งซ่อมอุปกรณ์ IT",

            action: () => setShowModalFixForm(true),
        },
        {
            title: "รายการที่รออนุมัติ",
            action: openPendingPage,
        },
        {
            title: "รายการที่รอดำเนินการ",
            action: openApprovePage,
        },
        {
            title: "ประวัติรายการที่สำเร็จ",
            action: openCompletePage,
        },
        {
            title: "ประวัติรายการที่ติดปัญหา",
            action: openProblemPage,
        },
        {
            title: "Report",
            action: openReportPage,
        },
    ];

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        setRole(userRole || "");
    }, []);

  const cardClass =
    "h-44 w-80 flex flex-col items-center justify-center gap-1 " +
    "bg-white rounded-2xl border border-gray-200 cursor-pointer " +
    "shadow-[0_8px_25px_rgba(0,0,0,0.08)] " +
    "transition-all duration-200 " +
    "hover:-translate-y-2 hover:border-[#1C70D3] " +
    "hover:shadow-[0_20px_45px_rgba(28,112,211,0.25)] " +
    "hover:bg-gradient-to-br hover:from-white hover:to-blue-50";

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-gradient-to-br from-[#F8F8FF] to-[#EEF2FF] relative">
            <NavbarIT />

            <div className="pt-28 md:pt-32 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-10">
                    {IT_CARDS.map((card, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className={cardClass}
                            onClick={card.action}
                        >
                            <span className="text-lg lg:text-xl font-semibold text-[#0B4EA2] tracking-wide text-center">
                                {card.title}
                            </span>
                            <span className="text-sm text-gray-500 text-center">
                                {card.desc}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {showModalForm && (
                <ModalITForm onClose={() => setShowModalForm(false)} />
            )}

            {showModalFixForm && (
                <ModalFixForm onClose={() => setShowModalFixForm(false)} />
            )}
        </div>
    );
};

export default ITPage;
