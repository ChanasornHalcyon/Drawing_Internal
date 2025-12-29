import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";
import ModalITForm from "./components/ModalItForm";
import ModalFixForm from "./components/ModalFixForm";
import { useRouter } from "next/router";
const ITPage = () => {
    const router = useRouter();
    const [role, setRole] = useState("");
    const [showModalForm, setshowModalForm] = useState(false);
    const [showModalFixForm, setshowModalFixForm] = useState(false);

    const openPendingPage = () => {
        router.push("./Pending_Form")
    }
    const openApprovePage = () => {
        router.push("./Approve_Form")
    }
    const openReportpage = () => {
        router.push("./Report")
    }
    const openCompletepage = () => {
        router.push("./Complete_Form")
    }
    const openProblempage = () => {
        router.push("./Problem_Form")
    }
    useEffect(() => {
        const userRole = localStorage.getItem("role");
        setRole(userRole || "");
    }, []);

    const cardClass =
        " h-32 lg:h-48 w-72 flex flex-col items-center justify-center \
     bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] \
     border transition-all duration-150 cursor-pointer \
     border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] \
     hover:border-[#1C70D3] hover:bg-gradient-to-br hover:from-white hover:to-blue-50";

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
            <Navbar />
            <div className="pt-28 md:pt-32 flex justify-center ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-5 ">
                    <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        onClick={() => setshowModalForm(true)}
                        className={cardClass}
                    >
                        <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                            แบบฟอร์มร้องขอ IT
                        </span>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className={cardClass}
                        onClick={() => setshowModalFixForm(true)}
                    >
                        <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                            แบบฟอร์มแจ้งซ่อมอุปกรณ์ IT
                        </span>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className={cardClass}
                        onClick={openPendingPage}
                    >
                        <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                            รายการที่รออนุมัติ
                        </span>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className={cardClass}
                        onClick={openApprovePage}
                    >
                        <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                            รายการที่รอดำเนินการ
                        </span>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className={cardClass}
                        onClick={openCompletepage}
                    >
                        <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                            ประวัติรายการที่สำเร็จ
                        </span>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className={cardClass}
                        onClick={openProblempage}
                    >
                        <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                            ประวัติรายการที่ติดปัญหา
                        </span>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className={cardClass}
                        onClick={openReportpage}
                    >
                        <span className="text-lg font-semibold text-[#0B4EA2] tracking-wide">
                            Report
                        </span>
                    </motion.div>

                </div>
            </div>


            {showModalForm && <ModalITForm onClose={() => setshowModalForm(false)} />}
            {showModalFixForm && <ModalFixForm onClose={() => setshowModalFixForm(false)} />}
        </div>
    );
};

export default ITPage;