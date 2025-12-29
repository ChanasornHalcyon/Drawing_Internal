import React from "react";
import { motion } from "framer-motion";

const ModalCompleteForm = ({ item, onClose, onConfirm }) => {
    if (!item) return null;

    return (
        <>

            <motion.div
                className="fixed inset-0 z-50 flex justify-center items-start mt-10"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div className="bg-white w-[350px] sm:w-[520px] md:w-[500px] rounded-2xl shadow-xl">


                    <div className="p-5 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-black">ยืนยันการ Complete</h2>
                        <button onClick={onClose} className="text-2xl text-black cursor-pointer">✕</button>
                    </div>

                    <div className="p-6 space-y-4 text-sm">
                        <div className="bg-gray-100 p-3 rounded-lg text-gray-800">
                            <div><b>ผู้ร้องขอ:</b> {item.requester}</div>
                            <div><b>แผนก:</b> {item.department}</div>
                            <div><b>วัตถุประสงค์:</b> {item.purpose}</div>
                            <div><b>รายละเอียด:</b> {item.detail}</div>
                        </div>
                    </div>


                    <div className="p-5 border-t flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg text-black cursor-pointer"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </motion.div>


            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        </>
    );
};

export default ModalCompleteForm;