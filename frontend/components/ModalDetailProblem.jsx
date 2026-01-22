import React from "react";
import { motion } from "framer-motion";

const ModalDetailProblem = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 flex justify-center items-start pt-20"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className="bg-white w-[380px] sm:w-[500px] rounded-2xl shadow-xl overflow-hidden">

                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold text-black">
                            รายละเอียดปัญหา
                        </h2>
                        <button
                            className="text-3xl text-gray-600 hover:text-black cursor-pointer"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>

                    <div className="p-6 space-y-3 text-gray-800">

                        <p><strong>ผู้ร้องขอ:</strong> {item.requester}</p>
                        <p><strong>แผนก:</strong> {item.department}</p>
                        <p><strong>วัตถุประสงค์:</strong> {item.purpose}</p>

                        <p><strong>รายละเอียด:</strong></p>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            {item.detail || "-"}
                        </div>

                        <p><strong>ปัญหา:</strong></p>
                        <textarea
                            value={item.problem_detail || "-"}
                            readOnly
                            rows={4}
                            className="
                                    w-full p-3 rounded-lg 
                                    bg-red-100 text-red-700 
                                    border border-red-300 
                                    outline-none 
                                    resize-none 
                                    cursor-default
                                        "
                        ></textarea>


                        <p><strong>เวลาที่เกิดปัญหา:</strong></p>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            {item.problem_at
                                ? new Date(item.problem_at).toLocaleString("th-TH")
                                : "-"}
                        </div>

                    </div>

                    <div className="p-4 border-t flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                        >
                            ปิด
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

export default ModalDetailProblem;
