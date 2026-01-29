import React from "react";
import { motion } from "framer-motion";

const DetailModal = ({ item, onClose }) => {
    if (!item) return null;

    let images = [];
    try {
        const raw = item.completed_images;

        if (Array.isArray(raw)) {
            images = raw;
        } else if (typeof raw === "string") {
            images = JSON.parse(raw);
        }
    } catch (e) {
        images = [];
    }

    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 flex justify-center items-start mt-14 px-4"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">

                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-xl font-bold text-black">รายละเอียดงานเสร็จ</h2>
                        <button
                            onClick={onClose}
                            className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <Info label="ผู้ร้องขอ" value={item.requester} />
                                    <Info label="แผนก" value={item.department} />
                                    <Info label="วัตถุประสงค์" value={item.purpose} />
                                    <Info label="รายละเอียด" value={item.detail} />
                                    <Info label="เหตุผล" value={item.reason || "-"} />
                                    <Info label="ผู้แก้ไข" value={item.completed_by} />
                                    <Info
                                        label="วันที่เสร็จ"
                                        value={
                                            item.completed_at
                                                ? new Date(item.completed_at).toLocaleString("th-TH")
                                                : "-"
                                        }
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-black">สิ่งที่แก้ไข</h3>
                                    <p className="bg-gray-100 p-3 rounded-xl text-red-400">
                                        {item.completed_detail || "-"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                {/* <h3 className="font-semibold mb-2 text-black">รูปภาพประกอบ</h3> */}
                                {images.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {images.map((img, index) => {
                                            const fullUrl = `http://localhost:4000${img}`;
                                            return (
                                                <a
                                                    key={index}
                                                    href={fullUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={fullUrl}
                                                        alt=""
                                                        className="w-full h-40 object-cover rounded-xl border cursor-pointer hover:opacity-80"
                                                    />
                                                </a>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">ไม่มีรูปภาพ</p>
                                )}
                            </div>

                        </div>
                    </div>


                    <div className="p-4 border-t flex justify-end bg-gray-50">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 cursor-pointer"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        </>
    );
};

const Info = ({ label, value }) => (
    <div className="flex gap-3 text-sm">
        <div className="w-28 text-gray-500">{label}</div>
        <div className="font-medium text-gray-800 break-words">{value}</div>
    </div>
);

export default DetailModal;
