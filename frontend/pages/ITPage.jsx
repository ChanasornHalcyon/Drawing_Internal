import React, { useState, useEffect } from "react";
import NavbarIT from "../components/NavbarIT";
import { motion } from "framer-motion";
import ModalITForm from "../components/ModalITForm";
import ModalFixForm from "../components/ModalFixForm";
import { useRouter } from "next/router";
import axios from "axios";

const ITPage = () => {
    const router = useRouter();
    const [role, setRole] = useState("");
    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalFixForm, setShowModalFixForm] = useState(false);
    const [filteredCards, setFilteredCards] = useState([]);

    const openPendingPage = () => router.push("./Pending_Form");
    const openApprovePage = () => router.push("./Approve_Form");
    const openCompletePage = () => router.push("./Complete_Form");
    const openProblemPage = () => router.push("./Problem_Form");
    const openReportPage = () => router.push("./Report");

    const IT_CARDS = [
        { key: "ฟอร์มร้องขอ", title: "แบบฟอร์มร้องขอ IT", action: () => setShowModalForm(true) },
        { key: "ฟอร์มแจ้งซ่อม", title: "แบบฟอร์มแจ้งซ่อมอุปกรณ์ IT", action: () => setShowModalFixForm(true) },
        { key: "รายการที่รออนุมัติ", title: "รายการที่รออนุมัติ", action: openPendingPage },
        { key: "รายการที่รอดำเนินการ", title: "รายการที่รอดำเนินการ", action: openApprovePage },
        { key: "ประวัติรายการที่สำเร็จ", title: "ประวัติรายการที่สำเร็จ", action: openCompletePage },
        { key: "ประวัติรายการที่ติดปัญหา", title: "ประวัติรายการที่ติดปัญหา", action: openProblemPage },
        { key: "Report", title: "Report", action: openReportPage },
    ];
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const username = localStorage.getItem("username");
                const role = localStorage.getItem("role")?.toLowerCase() || "";

                setRole(role);

                if (!username) return;

                if (role === "admin") {
                    setFilteredCards(IT_CARDS);
                    return;
                }

                const res = await axios.get(
                    `http://localhost:4000/userPermissions?username=${username}`
                );

                const itPermissions = res.data.filter(
                    (p) => p.module === "IT" && p.enabled === 1
                );

                const allowedKeys = itPermissions.map((p) => p.permission);

                const result = IT_CARDS.filter((card) =>
                    allowedKeys.includes(card.key)
                );

                setFilteredCards(result);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPermissions();
    }, []);


    const cardClass =
        "h-44 w-80 flex flex-col items-center justify-center gap-1 bg-white rounded-2xl border border-gray-200 cursor-pointer shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-2 hover:border-[#1C70D3] hover:shadow-[0_20px_45px_rgba(28,112,211,0.25)] hover:bg-gradient-to-br hover:from-white hover:to-blue-50";

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-gradient-to-br from-[#F8F8FF] to-[#EEF2FF] relative">
            <NavbarIT />

            <div className="pt-28 md:pt-32 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-10">
                    {filteredCards.map((card, idx) => (
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
                        </motion.div>
                    ))}
                </div>
            </div>

            {showModalForm && <ModalITForm onClose={() => setShowModalForm(false)} />}
            {showModalFixForm && <ModalFixForm onClose={() => setShowModalFixForm(false)} />}
        </div>
    );
};

export default ITPage;
