import React, { useState } from "react";
import { motion } from "framer-motion";

const ModalRejectForm = ({ item, onClose, onSubmitReject }) => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert("กรุณาระบุเหตุผลที่ไม่สามารถอนุมัติ");
            return;
        }
        setLoading(true);

        const result = await onSubmitReject(item.id, text);

        setLoading(false);

        if (result.success) {
            alert("บันทึกเหตุผลเรียบร้อย");
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
                            ไม่สามารถอนุมัติ
                        </h2>
                        <button onClick={onClose} className="text-2xl text-gray-500 cursor-pointer">✕</button>
                    </div>

                    <div className="p-5 space-y-4">
                        <p className="text-gray-700">
                            กรุณาระบุเหตุผลที่รายการ <b>{item.purpose}</b>{" "}
                            ไม่สามารถอนุมัติได้
                        </p>

                        <textarea
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-3 border rounded-lg text-gray-800"
                            rows="4"
                            placeholder="กรุณาระบุเหตุผล..."
                        ></textarea>
                    </div>

                    <div className="p-5 border-t flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-black bg-gray-200 rounded-lg cursor-pointer"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                        >
                            บันทึกเหตุผล
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}></div>
        </>
    );
};

export default ModalRejectForm;
