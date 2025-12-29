import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";

const ModalProblemForm = ({ item, onClose, onSubmitProblem, refreshData }) => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert("กรุณากรอกปัญหา");
            return;
        }
        setLoading(true);

        const result = await onSubmitProblem(item.id, text);

        setLoading(false);

        if (result.success) {
            alert("บันทึกปัญหาเรียบร้อย");
            if (refreshData) refreshData();
            onClose();
        } else {
            alert("บันทึกไม่สำเร็จ");
        }
    };

    return (
        <>

            <motion.div
                className="fixed inset-0 z-50 flex justify-center items-start mt-10"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div className="bg-white w-[350px] sm:w-[480px] rounded-2xl shadow-xl">
                    <div className="p-5 border-b flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-red-600">
                            แจ้งปัญหา / แก้ไขไม่ได้
                        </h2>
                        <button onClick={onClose} className="text-2xl text-gray-500 cursor-pointer">✕</button>
                    </div>

                    <div className="p-5 space-y-4">
                        <p className="text-gray-700">
                            คุณต้องการแจ้งว่า <b>{item.purpose}</b> นั้น
                            <span className="text-red-600 font-semibold"> มีปัญหา / ไม่สามารถแก้ไขได้</span>?
                        </p>

                        <textarea
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-3 border rounded-lg text-gray-800"
                            rows="4"
                            placeholder="กรุณาระบุปัญหา..."
                        ></textarea>
                    </div>

                    <div className="p-5 border-t flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-black bg-gray-200 rounded-lg cursor-pointer"
                        >
                            ยกเลิก
                        </button>

                        <button onClick={handleSubmit}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                        >
                            บันทึกปัญหา
                        </button>
                    </div>
                </div>
            </motion.div>

            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            ></div>
        </>
    );
};

export default ModalProblemForm;