import React from "react";
import { motion } from "framer-motion";

const ModalStartWork = ({ item, onClose, onConfirm }) => {
    if (!item) return null;

    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 flex justify-center items-start mt-16 px-4"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border">


                    <div className="p-5 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">

                            <h2 className="text-xl font-semibold text-gray-800">
                                ยืนยันการเริ่มงาน
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-xl text-gray-400 hover:text-gray-600 transition cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>


                    <div className="p-6 space-y-4 text-sm text-gray-700">


                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                            <Info label="ผู้ร้องขอ" value={item.requester} />
                            <Info label="แผนก" value={item.department} />
                            <Info label="วัตถุประสงค์" value={item.purpose} />
                            <Info label="รายละเอียด" value={item.detail} />
                        </div>
                    </div>


                    <div className="p-5 border-t flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={onConfirm}
                            className="
                px-5 py-2 rounded-lg
                bg-blue-600 text-white font-medium
                hover:bg-blue-700
                shadow-md hover:shadow-lg
                transition cursor-pointer
              "
                        >
                            เริ่มงาน
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

const Info = ({ label, value }) => (
    <div className="flex">
        <div className="w-28 text-gray-500">{label}</div>
        <div className="font-medium text-gray-800">{value || "-"}</div>
    </div>
);

export default ModalStartWork;
