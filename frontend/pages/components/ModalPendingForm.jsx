import React from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ModalPendingForm = ({ onClose, data, onApprove }) => {
    const formatDate = (dateStr) =>
        dateStr ? new Date(dateStr).toLocaleDateString("th-TH") : "-";

    const handleApprove = async () => {
        try {
            await axios.post("http://localhost:4000/ITApproveForm", {
                id: data.id,
            });
            onApprove(data.id);
            onClose();
        } catch (err) {
            console.error(err);
            alert("อนุมัติไม่สำเร็จ");
        }
    };

    const Row = ({ label, value }) => (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-sm text-gray-900 font-medium">{value || "-"}</span>
        </div>
    );

    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 flex justify-center items-start mt-20 px-4"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden">


                    <div className="px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                        <h2 className="text-lg font-semibold text-gray-800">
                            รายละเอียดคำขอ IT
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer transition"
                        >
                            ✕
                        </button>
                    </div>


                    <div className="p-6 space-y-5 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <Row label="ผู้ร้องขอ" value={data.requester} />
                            <Row label="แผนก / ฝ่าย" value={data.department} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Row label="วันที่ร้องขอ" value={formatDate(data.request_date)} />
                            <Row label="วันที่ต้องการ" value={formatDate(data.required_date)} />
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <Row label="วัตถุประสงค์" value={data.purpose} />
                            <Row label="รายละเอียด" value={data.detail} />
                            <Row label="เหตุผล" value={data.reason} />
                            <Row label="Spec" value={data.spec} />
                        </div>
                    </div>


                    <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="
                            px-4 py-2 rounded-lg text-gray-700 bg-white border
                            hover:bg-gray-100 transition
                            active:scale-95 cursor-pointer
              "
                        >
                            ปิด
                        </button>

                        <button
                            onClick={handleApprove}
                            className="
                                        px-5 py-2 rounded-lg text-white font-medium
                                        bg-gradient-to-r from-green-500 to-green-600
                                        hover:from-green-600 hover:to-green-700
                                        shadow-md hover:shadow-lg
                                        transition-all duration-150
                                        active:scale-95 cursor-pointer
                                        "
                        >
                            Approve
                        </button>

                    </div>
                </div>
            </motion.div>


            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />
        </>
    );
};

export default ModalPendingForm;